import { Email } from '../../core/libs/Email';
import { SendEmailRequest } from './request';

export class SendEmailAction {
    private email: Email;
    constructor() {
        this.email = new Email();
    }

    async execute(request: SendEmailRequest): Promise<void> {
        const data = await this.email.send({
            to: request.to,
            from: process.env?.SMTP_USERNAME ?? '',
            subject: 'This is a test',
            html: request.message,
            text: request.message,
        });

        return data;
    }
}
