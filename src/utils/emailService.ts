import nodemailer from "nodemailer";
import env from "../env";

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: env.SMTP_MAIL,
        pass: env.SMTP_PASSWORD
    }
});

export async function sendVerificationEmail(username: string, toEmail: string, verificationCode: string){
    const mailOptions = {
        from: "noreply@todolist.com",
        to: toEmail,
        subject: "NextJS Todolist account verification",
        html: `<h1>Email Confirmation</h1>
        <p>Hello ${username}, please confirm your account by clicking on the following link</p>
        <div><a href=http://localhost:3000/accountVerification?username=${username}&verificationCode=${verificationCode}>Click here</a></div>`
    };

    return await transporter.sendMail(mailOptions);
}

// export class EmailService{
//     private transporter: nodemailer.Transporter

//     constructor(){
//         this.transporter = nodemailer.createTransport({
//             host: "smtp-relay.brevo.com",
//             port: 587,
//             auth: {
//                 user: env.SMTP_MAIL,
//                 pass: env.SMTP_PASSWORD
//             }
//         });
//     }

//     async sendVerificationEmail(username: string, toEmail: string, verificationCode: string){
//         const mailOptions = {
//             from: "noreply@todolist.com",
//             to: toEmail,
//             subject: "NextJS Todolist account verification",
//             html: `<h1>Email Confirmation</h1>
//             <p>Hello ${username}, please confirm your account by clicking on the following link</p>
//             <div><a href=http://localhost:3000/accountVerification?username=${username}&verificationCode=${verificationCode}>Click here</a></div>`
//         };

//         return await this.transporter.sendMail(mailOptions);
//     }
// }
