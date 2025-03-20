import express from "express";
import { router } from "./routes";
import 'dotenv/config';
import mongoose from "mongoose";
const app = express();

mongoose.connect(process.env.DATABASE_URL as string);

app.use("/api/v1", router);

app.listen(3000);