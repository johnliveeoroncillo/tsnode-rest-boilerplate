import nodemailer from 'nodemailer';
import { env } from '../../../core/libs/Env';
import { Logger } from '../../../core/libs/Logger';
import axios, { AxiosInstance } from 'axios';
import path from 'path';

interface FileData {
    name: string,
    mimetype: string,
    data: Buffer,
    mv: void,
    tempFilePath: string,
    truncated: boolean,
    size: number,
    md5: string,
}

const SMTP_HOST: string = process.env?.SMTP_HOST ?? '';
const SMTP_USERNAME: string = process.env?.SMTP_USERNAME ?? '';
const SMTP_PASSWORD: string = process.env?.SMTP_PASSWORD ?? '';
const SMTP_PORT = Number(process.env?.SMTP_POST ?? 465);

export class EmailService {
    private mailer;

    constructor() {
        this.mailer = nodemailer.createTransport({
            pool: true,
            host: SMTP_HOST,
            port: SMTP_PORT,
            // secure: true, // upgrade later with STARTTLS
            auth: {
                user: SMTP_USERNAME,
                pass: SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }

    private async verify(): Promise<void> {
        this.mailer.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log('Server is ready to take our messages');
            }
        });
    }

    async send(
        recipient: string | string[],
        subject: string,
        body: string,
        from = env('SMTP_FROM', ''),
        file?: FileData | FileData[],
    ): Promise<void> {
        Logger.info('PREPARING EMAIL', 'SENDING TO: ' + recipient.toString());

        const message: any = {
            from,
            to: recipient,
            subject,
        };

        message.text = body;
        message.html = body;
        if (file) {
            if (!Array.isArray(file)) {
                message.attachments.push({
                    filename: file.name,
                    content: file.data,
                })
            } else {
                message.attachments.push(...file.map((data: FileData) => {
                    return {
                        filename: data.name,
                        content: data.data,
                    }
                }));
            }
        }

        await this.mailer
            .sendMail(message)
            .then((info) => {
                Logger.info('EMAIL:', info);
            })
            .catch((err) => {
                Logger.error('EMAIL:', err);
            });
    }
}