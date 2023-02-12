import { ObjectId } from 'mongodb';
import { DeepPartial, ObjectLiteral, Repository, SaveOptions } from 'typeorm';
import { Carbon } from '../../core/libs/Carbon';

export class MongoBaseRepository<T extends ObjectLiteral> extends Repository<T> {
    //Your generic methods here
    async findCollections(): Promise<T[]> {
        const response = await this.find({ withDeleted: true });
        return response.filter((item: T) => !item.deleted_at);
    }
    async findCollection(_id: string): Promise<T | undefined> {
        const id: ObjectId = new ObjectId(_id);
        const response = await this.find({
            where: {
                _id: id,
            },
            withDeleted: true,
        });
        if (!response || !response.length) return undefined;
        const data: any = response.pop();
        if (data?.deleted_at) return undefined;
        if (data) data.id = id;
        return data;
    }
    async softDeleteCollection(_id: string): Promise<void> {
        const collection: any = await this.findCollection(_id);
        console.log(collection);
        if (collection) {
            await this.updateByIdAndReturn(_id, { deleted_at: Carbon.timestamp() });
        }
    }
    async updateByIdAndReturn(id: any, partialEntity: DeepPartial<any>, options?: SaveOptions): Promise<T | undefined> {
        await this.update(id, partialEntity);
        const response: any = await this.findCollection(id);
        return response;
    }
}
