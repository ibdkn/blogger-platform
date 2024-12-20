import nodemailer from "nodemailer";
import {SETTINGS} from "../../settings";


export const nodemailerService = {

    async sendEmail(email: string, code: string, template: (code: string) => string): Promise<boolean> {
        let transporter = nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true,
            auth: {
                user: SETTINGS.EMAIL,
                pass: SETTINGS.EMAIL_PASS,
            },
        });

        try {
            let info = await transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: "Your code is here",
                html: template(code), // html body
            });

            console.log('Email sent:', info.response);
            return !!info;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
}