const up = `ALTER TABLE users 
    ADD COLUMN scope VARCHAR(8) NOT NULL AFTER deleted_at;`;

const down = `DROP TABLE users;`;

export = { up, down };
