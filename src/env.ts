import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env, {
    PORT: port(),
    TODOLIST_BACKEND_URL: str(),
    WEBSITE_URL: str(),
    SERVER_URL: str(),
    SESSION_SECRET: str(),
    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECRET: str(),
    SMTP_PASSWORD: str(),
    SMTP_MAIL: str(),
});

export default env;