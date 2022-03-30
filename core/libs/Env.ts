import 'dotenv/config';

const env = (VARIABLE: any, DEFAULT: any = ''): string => {
    return process?.env?.[VARIABLE] ?? DEFAULT;
};

export { env };
