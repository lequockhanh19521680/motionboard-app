import { AppDataSource } from 'config/db'; // Đổi lại đường dẫn nếu cần
import { Product } from '../entities/Product';
import { ProductImage } from '../entities/ProductImage';
import { ProductVariant } from '../entities/ProductVariant';
import { ProductDetailDTO } from 'dtos/product/ProductDetailDTO';

export class ProductRepository {
    private repo = AppDataSource.getRepository(Product);

    async findProductsWithFilters(filters: any) {
        const qb = this.repo.createQueryBuilder('product')
            .leftJoinAndSelect('product.images', 'images')
            .leftJoinAndSelect('product.shop', 'shop')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.brand', 'brand')
            .leftJoinAndSelect('product.ratings', 'ratings')
            .where('product.isDeleted = false');

        if (filters.shopId) {
            qb.andWhere('product.shopId = :shopId', { shopId: filters.shopId });
        }
        if (filters.categoryIds?.length) {
            qb.andWhere('product.categoryId IN (:...categoryIds)', { categoryIds: filters.categoryIds });
        }
        if (filters.priceMin != null && filters.priceMax != null) {
            qb.andWhere('product.price BETWEEN :min AND :max', { min: filters.priceMin, max: filters.priceMax });
        }
        if (filters.search) {
            qb.andWhere('LOWER(product.productName) LIKE :search', { search: `%${filters.search.toLowerCase()}%` });
        }
        if (filters.brandIds?.length) {
            qb.andWhere('product.brandId IN (:...brandIds)', { brandIds: filters.brandIds });
        }
        qb.orderBy('product.updatedAt', 'DESC');

        const products = await qb.getMany();

        // Lọc theo avg rating sau khi lấy về
        if (filters.rating) {
            return products.filter(p => {
                if (!p.ratings || !p.ratings.length) return 0 >= filters.rating;
                const avg = p.ratings.reduce((acc, r) => acc + Number(r.rating), 0) / p.ratings.length;
                return avg >= filters.rating;
            });
        }
        return products;
    }

    async findById(id: number): Promise<ProductDetailDTO | { error: string }> {
        // 1. Lấy sản phẩm với đầy đủ quan hệ
        const productEntity = await this.repo.findOne({
            where: { id, isDeleted: false },
            relations: [
                "images",
                "variants",
                "ratings",
                "brand",
                "shop",
                "category"
            ],
        });

        if (!productEntity) return { error: "Product not found" };

        const aggregate = await this.repo
            .createQueryBuilder("product")
            .leftJoin("product.ratings", "ratings")
            .select([
                "AVG(ratings.rating) AS avg_rating",
                "COUNT(ratings.id) AS total_rating"
            ])
            .where("product.id = :id", { id })
            .getRawOne();

        return {
            product_id: productEntity.id,
            shop_id: productEntity.shop?.id ?? 0,
            category_id: productEntity.category?.id ?? 0,
            product_name: productEntity.productName,
            description: productEntity.description ?? undefined,
            price: Number(productEntity.price),
            is_deleted: productEntity.isDeleted,
            created_by: productEntity.createdBy,
            created_at: productEntity.createdAt?.toISOString?.() ?? undefined,
            updated_by: productEntity.updatedBy,
            updated_at: productEntity.updatedAt?.toISOString?.() ?? undefined,
            brand_id: productEntity.brand?.id ?? undefined,
            brand_name: productEntity.brand?.brandName ?? undefined,
            shop_name: productEntity.shop?.shopName ?? undefined,
            category_name: productEntity.category?.name ?? undefined,
            avg_rating: aggregate?.avg_rating ? Number(aggregate.avg_rating) : 0.0,
            total_rating: aggregate?.total_rating ? Number(aggregate.total_rating) : 0,
            images: productEntity.images?.map(img => ({
                image_id: img.id,
                image_url: img.imageUrl,
                sort_order: img.sortOrder,
            })) ?? [],
            variants: productEntity.variants?.map(variant => ({
                variant_id: variant.id,
                color: variant.color ?? '',
                size: variant.size ?? '',
                stock_quantity: variant.stockQuantity,
                price: Number(variant.price),
            })) ?? [],
            ratings: productEntity.ratings?.map(rating => ({
                rating_id: rating.id,
                user_id: rating.userId ?? 0,
                rating: Number(rating.rating),
                comment: rating.comment,
                created_at: rating.createdAt?.toISOString?.(),
            })) ?? [],
        };
    }

    async createProduct(data: Partial<Product>) {
        const product = this.repo.create(data);
        return await this.repo.save(product);
    }

    async updateProduct(id: number, data: Partial<Product>) {
        await this.repo.update(id, data);
        return this.findById(id);
    }

    async deleteProduct(id: number, userId: number) {
        await this.repo.update(id, { isDeleted: true, updatedBy: userId });
        return this.findById(id);
    }

    async addImages(productId: number, images: Partial<ProductImage>[]) {
        const product = await this.repo.findOne({ where: { id: productId, isDeleted: false } });
        if (!product) throw new Error('Product not found');

        const productImages = images.map(image => {
            const productImage = new ProductImage();
            productImage.imageUrl = image.imageUrl ?? '';
            productImage.product = product;
            return productImage;
        });

        // Save nhiều bản ghi thông qua manager
        return this.repo.manager.save(productImages);
    }

    async addVariants(productId: number, variants: Partial<ProductVariant>[]) {
        const product = await this.repo.findOne({ where: { id: productId, isDeleted: false } });
        if (!product) throw new Error('Product not found');

        const productVariants = variants.map(variant => {
            const productVariant = new ProductVariant();
            productVariant.sku = variant.sku ?? '';
            productVariant.price = variant.price ?? 0;
            productVariant.product = product;
            return productVariant;
        });

        return this.repo.manager.save(productVariants);
    }

}
