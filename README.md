# Typescript Express Rest API Boilerplate

This is a boilerplate to create Rest API using Express + Typescript

## Features

- Integrated MySql and Typeorm
- Auto creation of API Routes.
- Support Middleware for Authorization
- Test API using Jest
- Parallel Processing or Events
- Create sequence diagram using PlantUML
- and many more ..



## Coming soon ...

- Add additional database like mongodb and postgres.
- Add multiple middlewares in single API endpoint


## Folder Structure

```
tsnode-rest-boilerplate
└─apis (Contains API Routes)
    └─sample-api (Created from npm run make:api sample-api)
        | config.yml (API Configuration)
        | handler.ts (1st lifecycle of the API)
        | action.ts (Action of the API connected to handler)
        | request.ts (Allowed Body Request)
        | response.ts (List of responses of the API)
        | validate.ts (Body Request Validation)
        | handler_test.ts (Unit Testing)
└─code_templates (Templates)
└─core (Main Core of the boilerplate)
└─cron (Contains Cron Jobs)
    └─sample-cron (Created from npm run make:cron sample-cron)
        | config.yml (Cron Configuration)
        | handler.ts (1st lifecycle of the CRON)
└─events (Contains Events)
    └─event_test (Created from npm run make:event event_test)
        | config.yml (Event Configuration)
        | handler.ts (1st lifecycle of the event)
        | action.ts (Action of the event connected to handler)
        | request.ts (Allowed Body Payload)
        | response.ts (List of responses of the event)
        | validate.ts (Payload Validation)
        | handler_test.ts (Unit Testing)
└─helpers (Helpers folder)
└─docs (API Documentations)
└─middlewares (Middlware of the API)
    | authorizer.ts (Sample middleware for authentication)
└─migrations (Migration files)
└─models (Table Models)
└─repository (Table Repository)
└─seeder (Seed fake data to table)
└─services (Custom Services)
| .env.example
| artisan.ts
| .eslintrc.js
| .gitignore
| .prettierrc
| docker-compose.yml (Docker image files and database configurations)
| jest.config.js
| migrate.ts
| tsconfig.json
```

## Config Structure
#### ./apis/sample-api/config.yml
```
sample-api: (Folder name) 
  handler: ./apis/sample-api/handler (1st lifecycle of the API)
  endpoint: /sample-api (API Route)
  method: post (API Method)
  enabled: true (Enable/Disable option)
  middleware: authorizer (File name of the middleware)
```

#### ./cron/sample-cron/config.yml
```
cron_today: (Folder name)
  handler: ./cron/cron_today/handler (1st lifecycle of the CRON)
  enabled: false (Enable/Disable option)
  cron: '* * * * * *' (Cron frequency)
  timezone: 'Asia/Manila' (Timezone)
```

#### ./events/event_test/config.yml
```
event_test: (Folder name) 
  handler: ./events/event_test/handler (1st lifecycle of the API)
  enabled: true (Enable/Disable option)
```

## Environment Variables
```
#DATABASE CONFIGURATION
##MYSQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=root
MYSQL_PASSWORD=admin
MYSQL_DB=database
MYSQL_LOGGING=true

##POSTGRES
POSTGRES_DB=database
POSTGRES_USERNAME=root
POSTGRES_PASSWORD=admin

##REDIS
REDIS_HOST=127.0.0.1
REDIS_USERNAME=root
REDIS_PASSWORD=admin
REDIS_PORT=6379
REDIS_TTL=3600

#JWT CONFIGURATION
JWT_TOKEN=
JWT_ADMIN_TOKEN=

#CRYPTO SECRET KEY
SECRET_KEY=abcdef0123456789abcdef0123456789

#ALLOWED ORIGINS (CORS) - currently unavailable or not working
ALLOWED_ORIGINS=

#EVENT
EVENT_HOST=127.0.0.1
```

## Demo
#### Development
https://tsnode-rest-dev.herokuapp.com/

#### Production
https://tsnode-rest-prod.herokuapp.com/

### REDIS
#### Create
```
Endpoint: /redis/insert
Method: POST
Request:
  {
    key: 'my-key',
    value: ['value1', 'value2']
  }
```
#### Get
```
Endpoint: /redis/:key
Method: GET
```

### CLIENT
#### Login
```
Endpoint: /login
Method: POST
Request:
  {
    username: '',
    password: ''
  }
```
#### Profile
```
Endpoint: /profile
Authorization: Bearer <TOKEN FROM LOGIN>
Method: GET
```

### ADMIN
#### Login
```
Endpoint: /login/admin
Method: POST
Request:
  {
    username: '',
    password: ''
  }
```
#### Profile
```
Endpoint: /profile/admin
Authorization: Bearer <TOKEN FROM LOGIN>
Method: GET
```



#### Register
```
Endpoint: /register
Method: POST
Request:
  {
    username: '',
    password: '',
    scope: '' <- ADMIN or CLIENT
  }
```

### EVENT USAGE
#### This function is inspired by AWS Lambda Event which drives the invocation or Lambda polls a queue or data stream and invokes the function in response to activity in the queue or data stream.
#### This custom event is using "net" package to recreate the AWS Lambda Event functionality. Wherein it executes functions in parallel processing and doesn't affect the current thread of your API.

```bash
import { EVENTS } from "../../helpers/Enums";
import { invokeEvent, invokeEventWithResponse } from "../../core/libs/Events";

//OPTION 1 - Event with Response
const data = await invokeEventWithResponse(EVENTS.EVENT_TEST, { message: request.message });
return data;

//OPTION 2 - Event without Response
await invokeEvent(EVENTS.EVENT_TEST, { message: request.message });

```

## API Reference

#### Create Model

```bash
  npm run make:model <model_name> <table_name>
```

#### Create Repository

```bash
  npm run make:repository <repository_name> <table_name>
```
This will create model and repository

#### Create Migration

```bash
  npm run make:migration <table_name>
```

#### Create API

```bash
  npm run make:api <api_name>
```

#### Create Service

```bash
  npm run make:service <service_name>
```

#### Create Cron

```bash
  npm run make:cron <cron_name>
```

#### Create Event

```bash
  npm run make:event <event_name>
```

#### Create PlantUML Diagram

```bash
  npm run make:puml <name>
```

## Other API Reference

#### Lint

```bash
  npm run lint
```

#### Migrate

```bash
  npm run migrate
```

#### Refresh Migrate

```bash
  npm run migrate:refresh
```
#### Run Local Cron Job

```bash
  npm run cron
```

#### Run Local Event

```bash
  npm run dev:event
```

## Running Tests

To run tests, run the following command

#### Silent Test
```bash
  npm run test <path_file>
```
Example: npm run test ./apis/login/

#### Documented Test
```bash
  npm run test:log <path_file>
```
Example: npm run test:log ./apis/login/

## Local Docker

#### Start Local MySQL/Redis/Postgres

```bash
  npm run docker:start
```

#### Stop Local MySQL/Redis/Postgres

```bash
  npm run docker:stop
```

## Installation

Requires [Node.js](https://nodejs.org/) v10+, Typescript and Docker (optional) to run.
Install the dependencies and devDependencies and start the server.  
Link to docker: [Docker](https://www.docker.com/)

### PlantUML
1. Download this VSCode Extension
    Name: PlantUML
    Id: jebbs.plantuml
    Description: Rich PlantUML support for Visual Studio Code.
    Version: 2.17.2
    Publisher: jebbs
    VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml
2. Download JRE for PlantUML Preview in VSCode - https://java.com/en/download/

#### PUML Preview
1. Open your .puml file in vscode
2. Press ALT + D

#### Exporting Diagram
1. Open your .puml file in vscode
2. Press CTRL + SHIFT + P
3. Select PlantUML: Export Current Diagram
4. Select your desired file extension


```sh
npm i -g node
npm i -g typescript
npm i -g ts-node
```


```sh
git clone https://github.com/johnliveeoroncillo/tsnode-rest-boilerplate.git
cd tsnode-rest-boilerplate
npm i
```

#### Development
```sh
npm run dev
```

#### Build
```sh
npm run build
```

#### Production
```sh
npm run start
```
## Development

Want to contribute? Great! Email me at johnliveeoroncillo@gmail.com

## License
MIT
