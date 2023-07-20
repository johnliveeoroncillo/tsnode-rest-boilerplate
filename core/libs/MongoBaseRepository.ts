import { DeepPartial, ObjectLiteral, Repository, SaveOptions, ObjectID } from 'typeorm';
import { Carbon } from '../../core/libs/Carbon';

export class MongoBaseRepository<T extends ObjectLiteral> extends Repository<T> {
    //Your generic methods here
    async findCollections(where?: Record<string, any>): Promise<T[]> {
        const response = await this.find({ where, withDeleted: true });
        return response.filter((item: T) => !item.deleted_at);
    }
    async findCollection(_id: string): Promise<T | undefined> {
        const id: ObjectID = new ObjectID(_id);
        const response: T[] = await this.findCollections({
            where: {
                _id: id,
            },
        });
        if (!response || !response.length) return undefined;
        const data: T | undefined = response.pop();
        if (data) {
            return {
                id,
                ...data,
            };
        }
        return data;
    }
    async softDeleteCollection(_id: string): Promise<void> {
        const collection: T | undefined = await this.findCollection(_id);
        if (collection) {
            await this.updateByIdAndReturn(_id, { deleted_at: Carbon.timestamp() });
        }
    }
    async updateByIdAndReturn(
        id: any,
        partialEntity: DeepPartial<Record<string, any>>,
        options?: SaveOptions,
    ): Promise<T | undefined> {
        await this.update(id, partialEntity);
        return await this.findCollection(id);
    }
}
