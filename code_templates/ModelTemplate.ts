import { writeFileSync, existsSync } from "fs";
import { pascalCase } from "case-anything";
import { Database } from "../core/database";
import { Connection } from "typeorm";
import 'dotenv/config';

const exclude = ['id','uuid','created_at','updated_at','deleted_at'];
const numbers = ['bit','int','integer','tinyint','smallint','mediumint','bigint','float','double','double precision','dec','decimal','numeric','fixed','year']
const booleans = ['bool','boolean'];


const content = `
import { Entity, Column } from "typeorm";
import { Model } from "../core/libs/Model";
@Entity({
  name: "table_name",
})
export class <model_name> extends Model {
    <columns>
}
`;

// @Column({
//   type: "varchar",
//   length: 25,
// })
// public upass: string;

export class ModelTemplate {
  private readonly filename: string;
  private readonly name: string;
  private readonly table_name: string;

  constructor(name: string, table_name?:string) {
    this.table_name = (table_name ?? 'table_name');
    this.name = pascalCase(`${name.trim()}Model`);
    this.filename = `${this.name}.ts`;
  }

  async generate(): Promise<void> {
    if (existsSync(`./models/${this.filename}`))
      throw new Error("Model file already existed");

      const columns: string[] = [];
      const connection: Connection = await Database.getConnection();
      //CHECK MIGRATION TABLE
      const response = await connection.manager.query(`SELECT *
                                                    FROM INFORMATION_SCHEMA.COLUMNS
                                                    WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' AND TABLE_NAME = '${this.table_name}';`);
      if(response.length) {
          response.forEach((element: { COLUMN_NAME: string; DATA_TYPE: string; CHARACTER_MAXIMUM_LENGTH: null; }) => {
              if(!exclude.includes(element.COLUMN_NAME)) {
                let type = 'string';
                if(numbers.includes(element.DATA_TYPE)) type = 'number';
                else if(booleans.includes(element.DATA_TYPE)) type = 'boolean';


                const column = `
  @Column({
    type: "${element.DATA_TYPE}"${element.CHARACTER_MAXIMUM_LENGTH == null ? '' : `,\n    length: ${element.CHARACTER_MAXIMUM_LENGTH}`}
  })
  public ${element.COLUMN_NAME}: ${type};
                `
                columns.push(column);
              }
          });
      }



    writeFileSync(
      `./models/${this.filename}`,
      content.replace(/<model_name>/g, this.name).replace(/table_name/g, this.table_name).replace(/<columns>/g, columns.join('\n')).trim()
    );
    connection.close();
  }
}