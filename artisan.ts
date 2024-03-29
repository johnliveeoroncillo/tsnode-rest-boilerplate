import yargs, { Arguments, option } from 'yargs';
import { MigrationTemplate } from './code_templates/MigrationTemplate';
import { ApiTemplate } from './code_templates/ApiTemplate';
import { ModelTemplate } from './code_templates/ModelTemplate';
import { RepositoryTemplate } from './code_templates/RepositoryTemplate';
import { ServiceTemplate } from './code_templates/ServiceTemplate';
import { CronTemplate } from './code_templates/CronTemplate';
import { EventTemplate } from './code_templates/EventTemplate';
import { DocsTemplate } from './code_templates/DocsTemplate';
import { SocketTemplate } from './code_templates/SocketTemplate';

const commands = yargs(process.argv.slice(2)).options({
    docs: {
        type: 'boolean',
        default: false,
        describe: '',
    },
});

try {
    commands.command(
        'make:migration <table>',
        'Create a migration file',
        () => {},
        (argv: Arguments) => {
            console.log('EXECUTING', argv);
            const template = new MigrationTemplate(<string>argv.table);
            template.generate();
            console.log('Migration file successfully created');
        },
    );

    commands.command(
        'make:api <name>',
        'Create a new api handler',
        () => {},
        (argv: Arguments) => {
            const template = new ApiTemplate(<string>argv.name);
            template.generate();
            console.log('API Handler successfully created');
        },
    );

    commands.command(
        'make:model <name> <table_name>',
        'Create a model class',
        () => {},
        async (argv: Arguments) => {
            let type = 'mysql';
            if (argv.mongo) {
                type = 'mongo';
            } else if (argv.postgre) {
                type = 'postgre';
            }
            const template = new ModelTemplate(<string>argv.name, <string>argv.table_name, type);
            await template.generate();

            console.log('Model successfully created');
        },
    );

    commands.command(
        'make:repository <name> <table_name>',
        'Create a repository class',
        () => {},
        async (argv: Arguments) => {
            let type = 'mysql';
            if (argv.mongo) {
                type = 'mongo';
            } else if (argv.postgre) {
                type = 'postgre';
            }
            const repository = new RepositoryTemplate(<string>argv.name, type);
            repository.generate();

            const template = new ModelTemplate(<string>argv.name, <string>argv.table_name, type);
            await template.generate();

            console.log('Repository successfully created');
        },
    );

    commands.command(
        'make:service <name>',
        'Create a service class',
        () => {},
        (argv: Arguments) => {
            const service = new ServiceTemplate(<string>argv.name);
            service.generate();

            console.log('Service successfully created');
        },
    );

    commands.command(
        'make:doc <name>',
        'Create a doc',
        () => {},
        (argv: Arguments) => {
            const service = new DocsTemplate(<string>argv.name);
            service.generate();

            console.log('Docs successfully created');
        },
    );

    commands.command(
        'make:event <name>',
        'Create a new event',
        () => {},
        (argv: Arguments) => {
            const template = new EventTemplate(<string>argv.name);
            template.generate();
            console.log('Event successfully created');
        },
    );

    commands.command(
        'make:socket <name>',
        'Create a new socket event',
        () => {},
        (argv: Arguments) => {
            const template = new SocketTemplate(<string>argv.name);
            template.generate();
            console.log('Socket event successfully created');
        },
    );

    commands.command(
        'make:cron <name>',
        'Create a cron class',
        () => {},
        (argv: Arguments) => {
            const cron = new CronTemplate(<string>argv.name);
            cron.generate();

            console.log('Cron successfully created');
        },
    );
    commands.strictCommands();
    commands.argv;
} catch (e: any) {
    console.error('\x1b[33m%s\x1b[0m', e.message);
}
