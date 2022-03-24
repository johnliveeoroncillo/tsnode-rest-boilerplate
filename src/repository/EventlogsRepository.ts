import { EntityRepository, Repository } from "typeorm";
import { EventlogsModel } from "../models/EventlogsModel";
@EntityRepository(EventlogsModel)
export class EventlogsRepository extends Repository<EventlogsModel> {
    async getAll(): Promise<EventlogsModel[]> {
        const sql = this.createQueryBuilder('a');
        return sql.getMany();
    }
}