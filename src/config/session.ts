import { SessionOptions } from "express-session";
import env from "../env";
import MongoStore from "connect-mongo";

const sessionConfig: SessionOptions = {
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_SESSION_STORE_URL
    })
}

export default sessionConfig;