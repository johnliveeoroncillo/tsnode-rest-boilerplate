/* eslint-disable @typescript-eslint/no-var-requires */
import mysql from 'mysql';
const migrations = require('mysql-migrations');
import 'dotenv/config';
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';
// flush privileges;
// caching_sha2_password

const { MYSQL_HOST, MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_DB, MYSQL_PORT } = process.env;

async function execute() {
    const connection = mysql.createPool({
        connectionLimit: 10,
        host: MYSQL_HOST,
        user: MYSQL_USERNAME,
        password: MYSQL_PASSWORD,
        database: MYSQL_DB,
        port: Number(MYSQL_PORT),
    });

    migrations.init(connection, `${__dirname}/migrations`);
}

execute().then();
