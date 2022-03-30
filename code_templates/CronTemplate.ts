import fse from 'fs-extra';
import { existsSync } from 'fs';
import { pascalCase, snakeCase } from 'case-anything';

const handler = `import { Carbon } from '../../../../core/libs/Carbon';

export async function execute(): Promise<void> {
    console.log('I am running every second: ' + Carbon.now());
}
`;

const config = `<name>: 
  handler: ./src/functions/cron/<name>/handler
  enabled: false #MAKE SURE TO ENABLE THIS CRON
  cron: '* * * * * *'
  timezone: 'Asia/Manila'`;

export class CronTemplate {
    private readonly filename: string;
    private readonly name: string;

    constructor(name: string) {
        this.name = snakeCase(`${name.trim()}`);
        this.filename = `${this.name}.ts`;
    }

    generate(): void {
        if (existsSync(`./src/functions/cron/${this.filename}`)) throw new Error('Cron file already existed');

        //HANDLER
        fse.outputFileSync(
            `./src/functions/cron/${this.name}/handler.ts`,
            handler.replace(/<name>/g, pascalCase(this.name)),
        );

        //CONFIG
        fse.outputFileSync(`./src/functions/cron/${this.name}/config.yml`, config.replace(/<name>/g, this.name));
    }
}
