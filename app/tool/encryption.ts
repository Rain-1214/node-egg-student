import * as crypto from 'crypto';

export class Encryption {

    private static instance: Encryption;

    private constructor() {};

    public static getInstance(): Encryption {
        if (!this.instance) {
            this.instance = new Encryption();
        }
        return this.instance;
    }

    getEncryptString(data: string) {
        const cipher = crypto.createHash('sha1');
        cipher.update(data);
        return cipher.digest().toString();
    }

    /**
     * 加密一个邮箱地址
     * @param data 要加密的字符串
     * @returns {String} 返回将邮箱@前的所有字符除开头两位转换成* 并且将@后'.'之前的也换成*  123456789@xx.xxx => 12*******@**.xxx
     */
    encryptEmail(data: string): string {
        if (!data.includes('@')) {
            return data;
        }
        const tempArray = data.split('@');
        if (tempArray[0].length < 3) {
            return '兄弟别闹,哪有那么短的邮箱';
        }
        const prefixLength = tempArray[0].length;
        let newPrefix = tempArray[0].slice(0, 2);
        newPrefix = newPrefix.padEnd(prefixLength, '*');

        const suffixLength = tempArray[1].length;
        const suffixArrap = tempArray[1].split('.');
        const newSuffix = `.${suffixArrap[1]}`.padStart(suffixLength, '*');
        return `${newPrefix}@${newSuffix}`;
    }

}
