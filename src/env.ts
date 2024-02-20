import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env, {
    PORT: port(),
    MONGO_CONNECTION_URL: str(),
    TODOLIST_BACKEND_URL: str(),
    WEBSITE_URL: str(),
    SERVER_URL: str(),
    SESSION_SECRET: str(),
    MONGO_SESSION_STORE_URL: str(),
    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECRET: str(),
    SMTP_PASSWORD: str(),
    SMTP_MAIL: str(),
    SEND_VERIFICATION_EMAIL_URL: str(),
    SMTP_PORT: port(),
    RABBITMQ_URL: str()
});

export default env;