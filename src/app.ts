import dotenv from "dotenv";
import express from "express";
import authRoutes from "./models/auth/auth.routes";
//import cors from "cors";

const app = express();

app.use(express.json());
dotenv.config();
// app.use(cors());
app.use("/auth", authRoutes);


export default app;