import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import createHttpError from "http-errors";
import passport from "passport";
import "./config/passport";
import sessionConfig from "./config/session";
import env from "./env";
import errorHandler from "./middleware/errorHandler";
import userRoutes from "./routes/users";

export const app = express();

app.use(express.json());
app.use(cors({
    origin: [env.TODOLIST_BACKEND_URL, "http://localhost:3001"],
    credentials: true
}));

app.use(session(sessionConfig));
app.use(passport.authenticate("session"));

app.use("/", userRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

app.use(errorHandler);