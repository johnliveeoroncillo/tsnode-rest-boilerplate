## Demo
#### Development
https://tsnode-rest-dev.herokuapp.com/

#### Production
https://tsnode-rest-prod.herokuapp.com/

#### CLIENT
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

#### ADMIN
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
Endpoint: /register/admin
Method: POST
Request:
  {
    username: '',
    password: '',
    scope: '' <- ADMIN or CLIENT
  }
```

## Coming soon ...

- Documentation creator
- Docker support
- Parallel processing or events


# Typescript Express Rest API Boilerplate

This is a boilerplate to create Rest API using Express + Typescript




## Features

- Integrated MySql and Typeorm
- Auto creation of API Routes.
- Support Middleware for Authorization
- Test API using Jest
- and many more ..

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
| jest.config.js
| migrate.ts
| tsconfig.json
| Procfile (Used to run custom command in Heroku)
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

## Environment Variables
```
#DATABASE CONFIGURATION
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=database
DB_LOGGING=true

#JWT CONFIGURATION
JWT_TOKEN=
JWT_ADMIN_TOKEN=

#CRYPTO SECRET KEY
SECRET_KEY=abcdef0123456789abcdef0123456789

#ALLOWED ORIGINS (CORS) - currently unavailable or not working
ALLOWED_ORIGINS=
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

#### Test Cron Job

```bash
  npm run cron
```

## Installation

Requires [Node.js](https://nodejs.org/) v10+ and Typescript to run.
Install the dependencies and devDependencies and start the server.
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

Development
```sh
npm run dev
```

Production
```sh
npm run start
```
## Development

Want to contribute? Great! Email me at johnliveeoroncillo@gmail.com

## License
MIT
