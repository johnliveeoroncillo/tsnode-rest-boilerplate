const up =
    'ALTER TABLE `event_logs` ' +
    'CHANGE COLUMN `message` `message` TEXT NOT NULL ;';

const down = 'DROP TABLE event_logs;';

export = { up, down }