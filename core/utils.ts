
const bcrypt = require('bcrypt');
const timestamp = (date: Date): number => {
    var datum = Date.parse(date.toString());
    return datum / 1000;
};

const date_diff = (date1:Date | any , date2:Date | any): number => {
    let diff =(date2.getTime() - date1.getTime()) / 1000;
    diff /= 60;
    return diff;
}

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
  
export { timestamp, cryptPassword, comparePassword, date_diff }
