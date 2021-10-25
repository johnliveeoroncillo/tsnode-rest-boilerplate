import { writeFileSync, existsSync } from "fs";
import { snakeCase } from "case-anything";
import pluralize from "pluralize";
import { timestamp } from "../core/utils";

const content = `
const up =
    \`CREATE TABLE <table> ( 
        id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
        uuid VARCHAR(50) NOT NULL, 


        
        created_at DATETIME NOT NULL DEFAULT NOW(), 
        updated_at DATETIME NOT NULL DEFAULT NOW(),
        deleted_at DATETIME NULL,
        PRIMARY KEY (id),
        UNIQUE INDEX uuid_UNIQUE (uuid ASC));\`;

const down = \`DROP TABLE <table>;\`;

export = { up, down }`;

export class MigrationTemplate {
  private readonly filename: string;
  private readonly name: string;

  constructor(name: string) {
    this.name = snakeCase(name.trim()); //pluralize(name.trim())
    this.filename = `${timestamp(new Date())}_${this.name}_table.ts`;
  }

  generate(): void {
    if (existsSync(`./migrations/${this.filename}`))
      throw new Error("Migration file already existed");
    writeFileSync(
      `./migrations/${this.filename}`,
      content.replace(/<table>/g, this.name).trim()
    );
  }
}
