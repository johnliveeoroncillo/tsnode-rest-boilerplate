import yargs, { Arguments } from "yargs";
import { MigrationTemplate } from "./code_templates/MigrationTemplate";
import { ApiTemplate } from "./code_templates/ApiTemplate";
import { ModelTemplate } from './code_templates/ModelTemplate';
import { RepositoryTemplate } from './code_templates/RepositoryTemplate';
import { ServiceTemplate } from "./code_templates/ServiceTemplate";
import { CronTemplate } from "./code_templates/CronTemplate";

const commands = yargs(process.argv.slice(2)).options({
  docs: {
    type: "boolean",
    default: false,
    describe: "",
  },
});

try {
  commands.command(
    "make:migration <table>",
    "Create a migration file",
    () => {},
    (argv: Arguments) => {
      console.log("EXECUTING", argv);
      const template = new MigrationTemplate(<string>argv.table);
      template.generate();
      console.log("Migration file successfully created");
    }
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
          const template = new ModelTemplate(<string>argv.name, <string>argv.table_name);
          await template.generate();

          console.log('Model successfully created');
      },
  );

  commands.command(
      'make:repository <name> <table_name>',
      'Create a repository class',
      () => {},
      async (argv: Arguments) => {
          const repository = new RepositoryTemplate(<string>argv.name);
          repository.generate();

          const template = new ModelTemplate(<string>argv.name, <string>argv.table_name);
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
    'make:cron <name>',
    'Create a cron class',
    () => {},
    (argv: Arguments) => {
        const cron = new CronTemplate(<string>argv.name);
        cron.generate();

        console.log('Cron successfully created');
    },
);

  // commands.command(
  //     'make:event <name>',
  //     'Create a new event handler',
  //     () => {},
  //     (argv: Arguments) => {
  //         const template = new HandlerTemplate(<string>argv.name, Type.EVENT);
  //         template.generate();
  //         console.log('Event Handler successfully created');
  //     },
  // );

  // commands.command(
  //     'make:cron <name>',
  //     'Create a new cron handler',
  //     () => {},
  //     (argv: Arguments) => {
  //         const template = new HandlerTemplate(<string>argv.name, Type.CRON);
  //         template.generate();
  //         console.log('Cron Handler successfully created');
  //     },
  // );

  // commands.command(
  //     'make:repository <name>',
  //     'Create a repository class',
  //     () => {},
  //     (argv: Arguments) => {
  //         const template = new ModelTemplate(<string>argv.name, true);
  //         template.generate();

  //         const repository = new RepositoryTemplate(<string>argv.name);
  //         repository.generate();

  //         console.log('Repository successfully created');
  //     },
  // );

  // commands.command(
  //     'dynamo:model <name>',
  //     'Create a dynamodb model class',
  //     () => {},
  //     (argv: Arguments) => {
  //         const template = new DynamoModelTemplate(<string>argv.name);
  //         template.generate();

  //         console.log('DynamoDB Model successfully created');
  //     },
  // );

  // commands.command(
  //     'dynamo:repository <name>',
  //     'Create a dynamodb repository class',
  //     () => {},
  //     (argv: Arguments) => {
  //         const template = new DynamoModelTemplate(<string>argv.name, true);
  //         template.generate();

  //         const repository = new DynamoRepositoryTemplate(<string>argv.name);
  //         repository.generate();

  //         console.log('DynamoDB Repository successfully created');
  //     },
  // );

  // commands.command(
  //     'make:service <name>',
  //     'Create a service class',
  //     () => {},
  //     (argv: Arguments) => {
  //         const template = new ServiceTemplate(<string>argv.name);
  //         template.generate();

  //         console.log('Service successfully created');
  //     },
  // );

  // commands.command(
  //     'swagger:request <name>',
  //     'Create a swagger request definition file',
  //     () => {},
  //     (argv: Arguments) => {
  //         const template = new SwaggerRequestTemplate(<string>argv.name);
  //         template.generate();

  //         console.log('Swagger definition successfully created');
  //     },
  // );

  // commands.command(
  //     'swagger:response <name>',
  //     'Create a swagger response definition file',
  //     () => {},
  //     (argv: Arguments) => {
  //         const template = new SwaggerResponseTemplate(<string>argv.name);
  //         template.generate();

  //         console.log('Swagger definition successfully created');
  //     },
  // );

  // commands.command(
  //     'swagger:path <name>',
  //     'Create a swagger path file',
  //     () => {},
  //     (argv: Arguments) => {
  //         const template = new SwaggerPathTemplate(<string>argv.name);
  //         template.generate();

  //         console.log('Swagger path successfully created');
  //     },
  // );

  // commands.command(
  //     'make:sequence <name>',
  //     'Create a sequence file',
  //     () => {},
  //     (argv: Arguments) => {
  //         const template = new SequenceTemplate(<string>argv.name);
  //         template.generate();

  //         console.log('Sequence successfully created');
  //     },
  // );

  commands.strictCommands();
  commands.argv;
} catch (e: any) {
    console.error('\x1b[33m%s\x1b[0m', e.message);
}
// try {

// } catch (error) {
//     console.log(error.message);
// }
