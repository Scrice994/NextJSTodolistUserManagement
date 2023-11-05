import { createTransport } from "nodemailer";
import env from "../env";

const transporter = createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: env.SMTP_MAIL,
        pass: env.SMTP_PASSWORD
    }
});

export async function sendVerificationEmail(username: string, toEmail: string, verificationCode: string){
    await transporter.sendMail({
        from: "noreply@todolist.com",
        to: toEmail,
        subject: "NextJS Todolist account verification",
        html: `<h1>Email Confirmation</h1>
        <p>Hello ${username}, please confirm your account by clicking on the following link</p>
        <div><a href=http://localhost:3000/accountVerification?username=${username}&verificationCode=${verificationCode}>Click here</a></div>`
    });
}