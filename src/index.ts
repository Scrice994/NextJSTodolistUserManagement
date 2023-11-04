import "dotenv/config";
import cors from "cors";
import express from "express";
import env from "./env";
import passport from "passport";
import userRoutes from "./routes/users";
import errorHandler from "./middleware/errorHandler";
import createHttpError from "http-errors";
import session from "express-session";
import sessionConfig from "./config/session";
import "./config/passport";


export const app = express();

app.use(express.json());
app.use(cors({
    origin: env.TODOLIST_BACKEND_URL,
    credentials: true
}));

app.use(session(sessionConfig));
app.use(passport.authenticate("session"));

app.use("/", userRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

app.use(errorHandler);