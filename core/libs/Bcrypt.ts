import bcrypt from 'bcrypt';
export class Bcrypt {
    static async encrypt(plain_text: string, rounds = 10): Promise<string> {
        return bcrypt.hash(plain_text, rounds).then((hash: string) => {
            return hash;
        });
    }

    static async compare(plan_text: string, encrypted: string): Promise<boolean> {
        return bcrypt.compare(plan_text, encrypted).then(function (result: boolean) {
            return result;
        });
    }
}
