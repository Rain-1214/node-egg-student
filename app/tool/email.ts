import * as email from 'nodemailer';
import { account } from '../../config/email-config';

export class Email {

    private static instance: Email;
    private emailTransport: email.Transporter;

    private constructor() {
        this.creatTransport();
    }

    public static getInstance(): Email {
        if (!this.instance) {
            this.instance = new Email();
        }
        return this.instance;
    }

    public send(emailAddress: string, subject: string, html: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.emailTransport.sendMail({
                from : 'NodeJS Test <wh_test12138@163.com>',
                to : emailAddress,
                subject,
                html,
            }, (err: Error, info: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        });
    }

    private creatTransport() {
        this.emailTransport = email.createTransport({
            host: 'smtp.163.com',
            secure: true,
            auth: {
                user: account.user,
                pass: account.pass,
            },
        });
    }

}
