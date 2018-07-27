import * as email from 'nodemailer';
import { account } from '../../config/email-config';

export class Email {

    private emailTransport: email.Transporter;

    constructor() {
        this.creatTransport();
    }

    creatTransport() {
        this.emailTransport = email.createTransport({
            host: 'smtp.163.com',
            secure: true,
            auth: {
                user: account.user,
                pass: account.pass,
            }
        });
    }

    send(emailAddress: string, subject: string, html: string): Promise<any> {
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

}

