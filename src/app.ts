import dotenv from "dotenv";
import express from "express";
import authRoutes from "./models/auth/auth.routes";
import adminRoutes from "./models/admin/admin.route";
//import cors from "cors";

const app = express();

app.use(express.json());
dotenv.config();
// app.use(cors());
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);


export default app;