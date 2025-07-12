
import { BrandRepository } from "repositories/brand.repository";

export class BrandUseCase {
    private brandRepo: BrandRepository;

    constructor() {
        this.brandRepo = new BrandRepository();
    }

    async listBrands() {
        return this.brandRepo.findAll();
    }

}
