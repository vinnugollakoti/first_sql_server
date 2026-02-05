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

router.get("/admin/student-count", async (req: Request, res: Response) => {
  try {

    const counts = await prisma.student.groupBy({
      by: ["year"],
      _count: {
        year: true
      }
    });

    res.json(counts);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch counts" });
  }
});


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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      return res.status(401).json({ message: "Account not found" });
    }

    if (!student.isVerified) {
      return res.status(401).json({
        message: "Please verify your email first",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.student.update({
      where: { email },
      data: {
        otp,
        otpExpiry: expiry,
      },
    });

    await sendOtpMail(email, otp);

    res.status(200).json({
      message: "OTP sent",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});


router.post("/register", async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, college, year } = req.body;

    if (!fullName || !email || !phone || !college || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingStudent) {
      return res.status(409).json({
        message: "Student already exists",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    const student = await prisma.student.create({
      data: {
        fullName,
        email,
        phone,
        college,
        year,
        otp,
        otpExpiry: expiry,
      },
    });

    await sendOtpMail(email, otp);

    res.status(201).json({
      message: "Registration successful. Please verify OTP sent to email",
      studentId: student.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});



router.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student || !student.otp || !student.otpExpiry) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (student.otp !== otp) {
      return res.status(401).json({ message: "OTP incorrect" });
    }

    if (student.otpExpiry < new Date()) {
      return res.status(401).json({ message: "OTP expired" });
    }

    const updatedStudent = await prisma.student.update({
      where: { email },
      data: {
        otp: null,
        otpExpiry: null,
        isVerified: true,
      },
    });

    res.status(200).json({
      message: "Login successful",
      student: updatedStudent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
});


export default router;