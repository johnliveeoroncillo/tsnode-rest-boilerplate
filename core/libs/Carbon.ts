import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

export class Carbon {
    static date_diff(date1: Date | string | undefined, date2: Date | string | undefined, type: moment.unitOfTime.Diff, precise = true): number {
        return moment(date2).diff(date1, type, precise);
    }

    static timestamp(date: Date | string | undefined = undefined): number {
        return moment(date).unix();
    }
}