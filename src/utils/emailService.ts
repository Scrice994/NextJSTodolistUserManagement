import nodemailer from "nodemailer";
import env from "../env";

const transporter = nodemailer.createTransport({
    host: env.SEND_VERIFICATION_EMAIL_URL,
    port: env.SMTP_PORT,
    secure: false,
    ignoreTLS: true,
    auth: {
        user: env.SMTP_MAIL,
        pass: env.SMTP_PASSWORD,
    },
});

export async function sendVerificationEmail(username: string, toEmail: string, userId: string, verificationCode: string){
    const mailOptions = {
        from: "noreply@todolist.com",
        to: toEmail,
        subject: "NextJS Todolist account verification",
        html: `<h1>Email Confirmation</h1>
        <p>Hello ${username}, please confirm your account by clicking on the following link</p>
        <div><a href=http://localhost:3000/account-verification?userId=${userId}&verificationCode=${verificationCode}>Click here</a></div>`
    };

    const email = await transporter.sendMail(mailOptions);
    return email;
}
