import fse from "fs-extra";
import { existsSync } from "fs";
import { pascalCase, snakeCase } from "case-anything";

const handler = `import { Carbon } from "../../core/libs/Carbon";

export async function execute(): Promise<void> {
    console.log('I am running every second: ' + Carbon.now());
}
`;

const config = `<name>: 
  handler: ./cron/<name>/handler
  enabled: false
  cron: '* * * * * *'
  timezone: 'Asia/Manila'`

export class CronTemplate {
  private readonly filename: string;
  private readonly name: string;

  constructor(name: string) {
    this.name = snakeCase(`${name.trim()}`);
    this.filename = `${this.name}.ts`;
  }

  generate(): void {
    if (existsSync(`./cron/${this.filename}`))
      throw new Error("Cron file already existed");
    
      //HANDLER
      fse.outputFileSync(
        `./cron/${this.name}/handler.ts`,
        handler.replace(/<name>/g, pascalCase(this.name))
      );

      //CONFIG
      fse.outputFileSync(
        `./cron/${this.name}/config.yml`,
        config.replace(/<name>/g, this.name)
      );
  }
}
