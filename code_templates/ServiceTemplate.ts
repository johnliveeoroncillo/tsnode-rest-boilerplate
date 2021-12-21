import { writeFileSync, existsSync } from "fs";
import { pascalCase } from "case-anything";


const content = `
class <service_name> {
    
}
export { <service_name> };
`;

export class ServiceTemplate {
    private readonly filename: string;
    private readonly name: string;
  
    constructor(name: string) {
      this.name = pascalCase(`${name.trim()}Service`);
      this.filename = `${this.name}.ts`;
    }
  
    generate(): void {
        if (existsSync(`./services/${this.filename}`))
            throw new Error("Service file already existed");
        writeFileSync(
            `./services/${this.filename}`,
            content.replace(/<service_name>/g, this.name).trim()
        );
    }
  }