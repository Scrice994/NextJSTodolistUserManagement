import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env, {
    PORT: port(),
    TODOLIST_BACKEND_URL: str(),
    SESSION_SECRET: str(),
});

export default env;