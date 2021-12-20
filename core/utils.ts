
const bcrypt = require('bcrypt');
import Crypto from 'crypto-js';
require('dotenv').config();

const vector_key: any = process.env.VECTOR_KEY;
const secret_key: any = process.env.SECRET_KEY;
const salt: any = { iv : vector_key };


const cryptPassword = async (password:string): Promise<string> => {
    return bcrypt.hash(password, 10).then((hash:string) =>  {
        return hash
    });
};
 
const comparePassword = async (plainPass:string, hashword:string): Promise<boolean> => {
    return bcrypt.compare(plainPass, hashword).then(function(result: boolean) {
        return result;
    });
};

const encrypt = (value: any): string => {
    if(typeof value === 'object') value = JSON.stringify(value);
    const encrypted = Crypto.AES.encrypt(value, secret_key, salt).toString()
    return encrypted;
}

const decrypt = (value: string): any => {
    try  {
        let decrypted: any = Crypto.AES.decrypt(value, secret_key, salt).toString(Crypto.enc.Utf8);
        if(typeof decrypted === 'object') decrypted = JSON.parse(decrypted);
        if(decrypted === '') decrypted = null;
        return decrypted;

    }
    catch(e) {
        return null;
    }
}
  
export { encrypt, decrypt, cryptPassword, comparePassword }
