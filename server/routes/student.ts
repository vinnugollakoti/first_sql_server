import express, { Request, Response } from "express";
import prisma from "../prisma/client";
import {sendOtpMail, sendNotificationMail} from "../mailer/mail"
const router = express.Router();


router.post("/sendNotification", async (req: Request, res: Response) => {
  try {
    const { title, message, years } = req.body;

    if (!title || !message || !years || years.length === 0) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        targets: {
          create: years.map((year: string) => ({ year })),
        },
      },
    });

    const students = await prisma.student.findMany({
      where: {
        year: {
          in: years,
        },
      },
      select: {
        email: true,
      },
    });

    for (const student of students) {
      sendNotificationMail(student.email, title, message)
        .catch(err => console.error("Mail failed:", err));
    }

    res.status(201).json({
      message: "Notification sent & emails triggered",
      notification,
      emailsSent: students.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send notification" });
  }
});


router.post("/admin-login", async(req: Request, res: Response) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(401).json({message : "Email and passwords are required !"})
    }

    const admin = await prisma.admin.findUnique({
      where: {email}
    })

    if (!admin) {
      return res.status(401).json({message: "Admin not found"})
    }

    if (admin.password !== password) {
      return res.status(401).json({message: "Invalid credentials"})
    }

    res.status(200).json({
      message: "Admin Loggedin Successufully",
      adminId: admin.id
    })

  } catch (err) {
    console.log("Error : ", err)
    res.status(401).json({message: "Login Failed"})
  }
})

router.get("/admin/notifications", async (req: Request, res: Response) => {
  try {
    const {year} = req.query;

    const allowedYears = ["FIRST", "SECOND", "THIRD", "FOURTH"];

    if (year && !allowedYears.includes(year as string)) {
      return res.status(400).json({ message: "Invalid year" });
    }

    const notifications = await prisma.notification.findMany({
      where: year
        ? {
            targets: {
              some: {
                year: year as any,
              },
            },
          }
        : undefined,
      include: {
        targets: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
})

router.get("/:studentId/getnotifications", async (req: Request, res: Response) => {
  try {
    const studentId = Number(req.params.studentId);

    const student = await prisma.student.findUnique({
      where: {id: studentId}
    })

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        targets: {
          some: {
            year: student?.year,
          }
        }
      },
      orderBy: { createdAt: "desc"}
    })

    res.status(201).json({
      student,
      notifications
    })

  } catch (err) {
    console.log("Error", err)
    res.status(401).json({message: "Error happened"})
  }
})

router.post("/login", async (req: Request, res: Response) => {
  try {
    const {email} = req.body;

    if (!email) {
      return res.status(400).json({message: "Please enter your email properly"})
    }

    const student = await prisma.student.findFirst({
      where: {
          email: email
      }
    })

    if (!student) {
      return res.status(401).json({ message: "Account not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);


    await prisma.student.update({
      where: {email},
      data: {
        otp,
        otpExpiry: expiry
      }
    })
    
    await sendOtpMail(email, otp)

    res.status(200).json({message: "Please check your mail and enter the otp."})
  } catch (err) {
    console.log(err);
    res.status(401).json({message: "Error faced during login"})
  }
})

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, college, year } = req.body;


    if (!fullName || !email || !phone || !college || !year) {
      return res.status(400).json({message : "All fields are required"});
    }

    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          {email},
          {phone}
        ]
      }
    })

    if (existingStudent) {
     return res.status(401).json({
        message: "Student already exists",
      });
    }

    const student = await prisma.student.create({
      data: {
        fullName,
        email,
        phone,
        college,
        year,
      },
    });

    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error happened" });
  }
});


router.post("/verify-otp", async( req: Request, res: Response) => {
  try {
    const {email, otp} = req.body;

    if (!email || !otp) {
      return res.status(401).json({message: "Email and OTP required"})
    }

    const student = await prisma.student.findUnique({
      where: {email}
    })

    if (!student || !student.otp || !student.otpExpiry) {
      return res.status(401).json({message: "Invalid Otp"})
    }

    if (student.otp !== otp) {
      return res.status(401).json({message : "Otp is incorrect"})
    }

    if (student.otpExpiry < new Date()) {
      return res.status(401).json({message : "Your otp is expired please create another otp"})
    }

    await prisma.student.update({
      where: {email},
      data: {
        otp: null,
        otpExpiry: null
      }
    })

    return res.status(200).json({message: "Login successfull", student})
  } catch (err) {
    console.log("Error : ", err)
    return res.status(400).json({message: "Failed to verify OTP"})
  }
})

export default router;