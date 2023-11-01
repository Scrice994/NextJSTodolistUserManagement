import "dotenv/config";
import cors from "cors";
import express from "express";
import env from "./env";

export const app = express();

app.use(express.json());
app.use(cors({
    origin: env.TODOLIST_BACKEND_URL,
    credentials: true
}));