import dotenv from "dotenv";
import express from "express";
import path from "path";
import routes from "./routes";
import { errorMiddleware } from "./middilwares/error.middleware";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/", routes);
app.use(errorMiddleware);
app.use(cors({ credentials: true, origin: true }));
dotenv.config();

export default app;