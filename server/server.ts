import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import studentRoutes from "./routes/student"
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())


app.use("/", studentRoutes)

app.listen(3000, () => {
    console.log("Your server is running ✅")
})