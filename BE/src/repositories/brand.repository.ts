import { AppDataSource } from 'config/db';
import { BaseRepository } from './base.repository';
import { Brand } from 'entities/Brand';

export class BrandRepository extends BaseRepository<Brand> {
    constructor() {
        super(AppDataSource.getRepository(Brand));
    }

    async findAll() {
        return this.repo.find();
    }


}
