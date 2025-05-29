import express, { Request, Response } from "express";
import cors from "cors";
import dbConnect from "./config/dbConnect";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
const app = express();

dotenv.config();

app.use(
    cors({
        origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());
app.use('/api/users', authRoutes);
app.get('/', async(req: Request, res: Response) => {
    res.json({ message: "Hello World" });
});

const port = process.env.PORT || 5001;

dbConnect()



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
