import { writeFileSync, existsSync } from "fs";
import { pascalCase } from "case-anything";

const content = `
import { Entity, Column } from "typeorm";
import { Model } from "./Model";

@Entity({
  name: "table_name",
})
export class <model_name> extends Model {
  @Column({
    type: "varchar",
    length: 25,
  })
  public upass: string;
}
`;

export class ModelTemplate {
  private readonly filename: string;
  private readonly name: string;

  constructor(name: string) {
    this.name = pascalCase(`${name.trim()}Model`);
    this.filename = `${this.name}.ts`;
  }

  generate(): void {
    if (existsSync(`./models/${this.filename}`))
      throw new Error("Model file already existed");
    writeFileSync(
      `./models/${this.filename}`,
      content.replace(/<model_name>/g, this.name).trim()
    );
  }
}
