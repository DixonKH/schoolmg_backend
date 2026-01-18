import dotenv from "dotenv";
import express from "express";
import routes from "./routes";
import { errorMiddleware } from "./middilwares/error.middleware";
//import cors from "cors";

const app = express();

app.use(express.json());
dotenv.config();
// app.use(cors());
app.use("/", routes);

app.use(errorMiddleware);


export default app;