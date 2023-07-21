import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { pascalCase } from 'case-anything';

let content = `import { EntityRepository, Repository } from 'typeorm';
import { model_name } from '../models/model_name';
@EntityRepository(model_name)
export class <repository_name> extends Repository<model_name> {
    async getAll(): Promise<model_name[]> {
        const sql = this.createQueryBuilder('a');
        return sql.getMany();
    }
}
`;

export class RepositoryTemplate {
    private readonly filename: string;
    private readonly name: string;
    private readonly type: string;

    constructor(name: string, type?: string) {
        this.name = pascalCase(`${name.trim()}Repository`);
        this.filename = `${this.name}.ts`;
        this.type = type ?? 'mysql';
    }

    generate(): void {
        if (!existsSync(`./src/models/${this.type}`)) {
            mkdirSync(`./src/models/${this.type}`);
        }
        if (existsSync(`./src/repository/${this.type}/${this.filename}`))
            throw new Error('Repository file already existed');

        const rawName = this.filename.replace(/Repository/g, '').replace(/\.[^/.]+$/, '');
        content = content.replace(/model_name/g, `${rawName}Model`);
        writeFileSync(`./src/repository/${this.filename}`, content.replace(/<repository_name>/g, this.name));
    }
}
