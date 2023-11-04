import { SessionOptions } from "express-session";
import env from "../env";
import MongoStore from "connect-mongo";

const sessionConfig: SessionOptions = {
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1:27017/TodoList"
    })
}

export default sessionConfig;