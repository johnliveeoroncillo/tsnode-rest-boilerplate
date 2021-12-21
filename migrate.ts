import { Database } from "./core/database";
import { Connection } from "typeorm";
import { loadMigrations } from "./core";
import path from "path";
import 'dotenv/config';
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';
// flush privileges;
// caching_sha2_password

const args = process.argv.slice(2);

const runMigration = async () => {     

  try {
    console.log("RUNNING MIGRATIONS");
    const migration_type = args[0] ?? 'up';
    const databaseName = process.env?.DB_NAME ?? '';

    console.log('DB', databaseName);

    const connection: Connection = await Database.getConnection();
    //CHECK MIGRATION TABLE
    const response = await connection.manager.query("SHOW TABLES");
    const column = `Tables_in_${databaseName}`;
    const find_migration = response.find(
      (el: { [x: string]: string; }) => el[column] === "migrations"
    );
    if (find_migration === undefined) {
      await connection.manager.query(`CREATE TABLE migrations (
                                                  id INT NOT NULL AUTO_INCREMENT,
                                                  migration VARCHAR(250) NOT NULL,
                                                  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                                                  PRIMARY KEY (id),
                                                  UNIQUE INDEX id_UNIQUE (id ASC));
                                              `);
    }

    const migrations = await loadMigrations();
    if (migrations.length) {
      if(migration_type == 'down') {
          console.log('TRUNCATED MIGRATIONS');
          await connection.manager.query('TRUNCATE TABLE migrations');
      }

      for (let i = 0; i < migrations.length; i++) {
        const element = migrations[i];
        const name = `${element.replace(/\\/g, "/")}`;
        const migration_name = path.basename(name).replace(/\.[^/.]+$/, "");
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const migration_script = require(name);
        const check_migration = await connection.manager.query(
          "SELECT * from migrations WHERE migration = ?",
          [migration_name]
        );
        if (!check_migration.length) {
          const response = await connection.manager.query(migration_script[migration_type]);
          if (response && migration_type != 'down') {
            await connection.manager.query(
              "INSERT INTO migrations (migration) VALUES (?)",
              [migration_name]
            );
          }
        }
      }
    }
    console.log("SUCCESSFULLY MIGRATED");
    connection.close();
  } 
  catch (e) {
    console.error("ERROR", e);
  }
  finally {
    await Database.closeConnection();
  }
};


runMigration().then();
