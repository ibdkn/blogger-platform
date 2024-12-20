import nodemailer from "nodemailer";
import {SETTINGS} from "../../settings";


export const nodemailerService = {

    async sendEmail(email: string, code: string, template: (code: string) => string): Promise<boolean> {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: SETTINGS.EMAIL,
                pass: SETTINGS.EMAIL_PASS,
            },
        });

        try {
            let info = await transporter.sendMail({
                from: '"Hello there 🖖" <codeSender>',
                to: 'bellagothica28@gmail.com',
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