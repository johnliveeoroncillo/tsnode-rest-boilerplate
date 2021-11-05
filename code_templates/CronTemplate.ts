import { writeFileSync, existsSync } from "fs";
import { pascalCase } from "case-anything";

const content = `
export class Cron {
    //*second
    //*minute
    //*hour
    //*day of month
    //*month
    //*day of week
    // * * * * * * every second
    // * * * * * every minute
    static cron: string = '* * * * * *';
    static timezone: string = 'Asia/Manila';
    static auto_start: boolean = true; //auto start if true
    
    static execute() {
        console.log('Hi');
    }
}
`;

export class CronTemplate {
  private readonly filename: string;
  private readonly name: string;

  constructor(name: string) {
    this.name = pascalCase(`${name.trim()}`);
    this.filename = `${this.name}.ts`;
  }

  generate(): void {
    if (existsSync(`./cron/${this.filename}`))
      throw new Error("Cron file already existed");
    writeFileSync(
      `./cron/${this.filename}`,
      content.trim()
    );
  }
}
