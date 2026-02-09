import dotenv from "dotenv";
import express from "express";
import path from "path";
import routes from "./routes";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middilwares/error.middleware";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);
app.use(errorMiddleware);
dotenv.config();

export default app;