import { Product } from "entities/Product";
import { ProductRepository } from "repositories/product.repository";
import { ProductImage } from "entities/ProductImage";
import { ProductVariant } from "entities/ProductVariant";

export class ProductUseCase {
    private productRepo: ProductRepository;

    constructor() {
        this.productRepo = new ProductRepository();
    }

    async searchProducts(filters: any) {
        return this.productRepo.findProductsWithFilters(filters);
    }

    async getProductDetailById(id: number) {
        return this.productRepo.findById(id);
    }

    async createProduct(data: Partial<Product>) {
        return this.productRepo.createProduct(data);
    }

    async updateProductById(id: number, data: Partial<Product>) {
        return this.productRepo.updateProduct(id, data);
    }

    async softDeleteProductById(id: number, userId: number) {
        return this.productRepo.deleteProduct(id, userId);
    }

    async addImagesToProduct(productId: number, images: Partial<ProductImage>[]) {
        return this.productRepo.addImages(productId, images);
    }

    async addVariantsToProduct(productId: number, variants: Partial<ProductVariant>[]) {
        return this.productRepo.addVariants(productId, variants);
    }


}
