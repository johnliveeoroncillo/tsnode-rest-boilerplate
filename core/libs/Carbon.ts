const { moment } = require('moment-timezone');
moment.tz.setDefault('Asia/Manila');

export class Carbon {
    static date_diff(date1: Date, date2: Date): number {
        return moment.diff(new Date(date1), new Date(date2));
    }

    static timestamp(): number {
        return moment().time
    }
}