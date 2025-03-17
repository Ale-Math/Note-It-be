import express from "express";
import { router } from "./routes";

const app = express();

app.use("/api/v1", router);

app.listen(3000);