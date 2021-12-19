
# Typescript Express Rest API Boilerplate

This is a boilerplate to create API using Express + Typescript




## Features

- Integrated MySql and Typeorm
- Auto creation of API Routes.
- Support Middleware for Authorization
- Test API using Jest
- and many more ..

## API Reference

#### Create Model

```bash
  npm run make:model <table_name>
```
Create typeorm model.

#### Create Repository

```bash
  npm run make:repository <table_name>
```
Create typeorm repository and model.

#### Create Migration

```bash
  npm run make:migration <table_name>
```
Create mysql migration file.

#### Create API

```bash
  npm run make:api <api_name>
```
Create API.

#### Create Service

```bash
  npm run make:service <service_name>
```
Create service file.

#### Create Cron

```bash
  npm run make:cron <cron_name>
```
Create cron file.


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

## Installation

Requires [Node.js](https://nodejs.org/) v10+ and Typescript to run.
Install the dependencies and devDependencies and start the server.
```sh
npm i -g node
npm i -g typescript
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