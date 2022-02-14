import 'dotenv/config';
import nodemailer, { TransportOptions } from 'nodemailer';

export interface EmailData {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
}

export class Email {
    private SMTP_PORT = Number(process.env?.SMTP_PORT ?? 0); 
    private SMTP_HOST: string = process.env?.SMTP_HOST ?? '';
    private SMTP_SECURE = Boolean(process.env?.SMTP_SECURE ?? false);
    private SMTP_USERNAME: string = process.env?.SMTP_USERNAME ?? '';
    private SMTP_PASSWORD: string = process.env?.SMTP_PASSWORD ?? '';
    private transporter: any;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: this.SMTP_HOST,
            port: this.SMTP_PORT,
            secure: this.SMTP_SECURE,
            auth: {
                user: this.SMTP_USERNAME,
                pass: this.SMTP_PASSWORD,
            }
        } as TransportOptions)
    }

    async send(data: EmailData): Promise<void> {
        return await this.transporter.sendMail(data)
    }
}