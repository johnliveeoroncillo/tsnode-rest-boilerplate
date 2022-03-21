const up =
    'CREATE TABLE event_logs ( ' +
        '`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, ' +
        '`uuid` VARCHAR(50) NOT NULL, ' +
        '`message` VARCHAR(255) NOT NULL,'+
        '`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , ' +
        '`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
        '`deleted_at` DATETIME NULL,' +
        'PRIMARY KEY (`id`),' +
        'UNIQUE INDEX `uuid_UNIQUE` (`uuid` ASC));';

const down = 'DROP TABLE event_logs;';

export = { up, down }