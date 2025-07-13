// base/BaseRepository.ts
import { Repository, ObjectLiteral, DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseRepository<T extends ObjectLiteral> {
    constructor(protected repo: Repository<T>) { }

    async saveWithUser(entity: DeepPartial<T>, userId: number) {
        (entity as any)['updatedBy'] = userId;
        if (!(entity as any)['id']) (entity as any)['createdBy'] = userId;
        return this.repo.save(entity);
    }

    async updateWithUser(id: number, partial: DeepPartial<T>, userId: number) {
        (partial as any)['updatedBy'] = userId;
        await this.repo.update(id as any, partial as QueryDeepPartialEntity<T>);
        return this.repo.findOne({ where: { id } as any });
    }

    async findOneWithUser(where: any): Promise<T | null> {
        return this.repo.findOne({
            where,
            relations: ['createdByUser', 'updatedByUser'],
        });
    }
}
