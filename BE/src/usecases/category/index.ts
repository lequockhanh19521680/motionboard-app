import { Category } from "entities/Category";
import { CategoryRepository } from "repositories/category.repository";


export class CategoryUseCase {
    private categoryRepo: CategoryRepository;

    constructor() {
        this.categoryRepo = new CategoryRepository();
    }

    async listCategories() {
        return this.categoryRepo.findAll();
    }

    async getCategoryById(id: number) {
        return this.categoryRepo.findById(id);
    }

    async createCategory(data: Partial<Category>) {
        return this.categoryRepo.createCategory(data);
    }

    async updateCategoryById(id: number, data: Partial<Category>) {
        return this.categoryRepo.updateCategory(id, data);
    }

    async softDeleteCategoryById(id: number) {
        return this.categoryRepo.deleteCategory(id);
    }
}
