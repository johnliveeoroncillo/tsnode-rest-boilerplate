/* eslint-disable @typescript-eslint/no-var-requires */
const mysql = require('mysql');
const migrations = require('mysql-migrations');
require('dotenv/config');
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';
// flush privileges;
// caching_sha2_password

const {
  MYSQL_HOST,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_NAME,
  MYSQL_PORT,
} = process.env;


async function execute() {
  const connection = mysql.createPool({
      connectionLimit: 10,
      host: MYSQL_HOST,
      user: MYSQL_USERNAME,
      password: MYSQL_PASSWORD,
      database: MYSQL_NAME,
      port: Number(MYSQL_PORT),
  });

  migrations.init(connection, `${__dirname}/migrations`);
}

execute().then();