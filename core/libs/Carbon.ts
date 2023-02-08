import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

export class Carbon {
    static moment(): moment.Moment {
        return moment();
    }

    static format(date: string | Date, format = 'YYYY-MM-DD'): string {
        return moment(date).format(format);
    }

    static now(format = 'YYYY-MM-DD HH:mm:ss'): string {
        return moment().format(format);
    }

    static date_diff(
        date1: Date | string | undefined,
        date2: Date | string | undefined,
        type: moment.unitOfTime.Diff,
        precise = true,
    ): number {
        return moment(date2).diff(date1, type, precise);
    }

    static timestamp(date: Date | string | undefined = undefined): number {
        return moment(date).unix();
    }
}
