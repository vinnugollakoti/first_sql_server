import express, { Request, Response } from "express";
import prisma from "../prisma/client";

const router = express.Router();

router.post("/add", async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, college, year } = req.body;

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

export default router;
