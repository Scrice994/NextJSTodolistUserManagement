import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env, {
    PORT: port(),
    TODOLIST_BACKEND_URL: str(),
});

export default env;