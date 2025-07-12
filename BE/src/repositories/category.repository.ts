import { Category } from 'entities/Category';
import { EntityRepository, Repository } from 'typeorm';
import { AppDataSource } from 'config/db';

@EntityRepository(Category)
export class CategoryRepository {
    private repo = AppDataSource.getRepository(Category);

    async findAll() {
        return await this.repo.find({ where: { isDeleted: false } });
    }

    async findById(id: number) {
        return await this.repo.findOne({ where: { id, isDeleted: false } });
    }

    async createCategory(data: Partial<Category>) {
        const category = this.repo.create(data);
        return await this.repo.save(category);
    }

    async updateCategory(id: number, data: Partial<Category>) {
        await this.repo.update(id, data);
        return await this.findById(id);
    }

    async deleteCategory(id: number) {
        await this.repo.update(id, { isDeleted: true });
        return await this.findById(id);
    }
}