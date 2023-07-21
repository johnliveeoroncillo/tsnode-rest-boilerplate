import { DeepPartial, ObjectLiteral, Repository, SaveOptions } from 'typeorm';
import { Carbon } from '../../core/libs/Carbon';
import { v4 } from 'uuid';
export class MongoBaseRepository<T extends ObjectLiteral> extends Repository<T> {
    async insertCollection(payload: ObjectLiteral): Promise<T> {
        payload.created_at = Carbon.now();
        payload.updated_at = Carbon.now();
        payload.uuid = v4();
        await this.insert(payload as T);
        return payload as unknown as T;
    }
    async updateCollection(payload: ObjectLiteral): Promise<T> {
        payload.updated_at = Carbon.now();
        await this.updateByUuIdAndReturn(payload.uuid, payload as T);
        return payload as T;
    }
    async findCollections(where?: any): Promise<T[]> {
        const response = await this.find({ where, withDeleted: true });
        return response.filter((item: T) => !item.deleted_at);
    }
    async findCollection(where: any): Promise<T | undefined> {
        const response = await this.find({
            where,
            withDeleted: true,
        });
        if (!response || !response.length) return undefined;
        const data: any = response.pop();
        if (data?.deleted_at) return undefined;
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
        return await this.findCollection(id);
    }
    async updateByUuIdAndReturn(
        uuid: any,
        partialEntity: DeepPartial<any>,
        options?: SaveOptions,
    ): Promise<T | undefined> {
        await this.update(
            {
                uuid,
            },
            partialEntity,
        );
        return await this.findCollection({ uuid });
    }
}
