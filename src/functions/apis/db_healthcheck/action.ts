import { Mongo } from '../../../../core/databases/Mongo';
import { Mysql } from '../../../../core/databases/Mysql';
import { Postgres } from '../../../../core/databases/Postgres';
import { Redis } from '../../../../core/databases/Redis';
import { HttpRequest } from '../../../../core/libs/ApiEvent';

interface Details {
    name: string;
    up: boolean;
    icon: string;
}
export class HealthcheckAction {
    async execute(req: HttpRequest): Promise<Details[]> {
        let details: Details[] = [
            {
                name: 'MYSQL',
                up: false,
                icon: '❌',
            },
            {
                name: 'REDIS',
                up: false,
                icon: '❌',
            },
            {
                name: 'POSTGRESQL',
                up: false,
                icon: '❌',
            },
            {
                name: 'MONGODB',
                up: false,
                icon: '❌',
            },
        ];
        /**
         * CHECK MYSQL
         */
        await Mysql.getConnection()
            .then(() => {
                details = this.updateToTrue('MYSQL', details);
            })
            .catch((err) => {
                console.error(err);
            });
        await Mysql.closeConnection();

        /**
         * CHECK REDIS
         */
        const redis = new Redis();
        await redis
            .getConnection()
            .then(() => {
                details = this.updateToTrue('REDIS', details);
            })
            .catch((err) => {
                console.error(err);
            });
        await redis.closeConnection();

        /**
         * CHECK POSTGRE
         */
        await Postgres.getConnection()
            .then(() => {
                details = this.updateToTrue('POSTGRESQL', details);
            })
            .catch((err) => {
                console.error(err);
            });
        await Postgres.closeConnection();

        /**
         * CHECK POSTGRE
         */
        await Mongo.getConnection()
            .then(() => {
                details = this.updateToTrue('MONGODB', details);
            })
            .catch((err) => {
                console.error(err);
            });
        await Mongo.closeConnection();

        return details;
    }

    updateToTrue(name: string, details: Details[]): Details[] {
        const index = details.findIndex((el: Details) => el.name === name);
        if (index !== -1) {
            details[index].up = true;
            details[index].icon = '✅';
        }
        return details;
    }
}
