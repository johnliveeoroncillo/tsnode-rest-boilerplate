import CryptoJS from 'crypto-js';
import { env } from './Env';

export class Crypto {
    private static key = env('SECRET_KEY', '');
    private static salt: any = CryptoJS.lib.WordArray.random(128 / 8);
    private static iv = CryptoJS.enc.Hex.parse(this.salt);

    static encrypt(plain_text: string): string {
        return CryptoJS.AES.encrypt(plain_text, this.key, {
            iv: this.iv,
        }).toString();
    }

    static decrypt(encrypted: string): string {
        return CryptoJS.AES.decrypt(encrypted, this.key, {
            iv: this.iv,
        }).toString(CryptoJS.enc.Utf8);
    }
}
