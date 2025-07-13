import { AppDataSource } from 'config/db'; // Đổi lại đường dẫn nếu cần
import { Product } from '../entities/Product';
import { ProductImage } from '../entities/ProductImage';
import { ProductVariant } from '../entities/ProductVariant';
import { ProductDetailDTO } from 'dtos/product/ProductDetailDTO';
import { ProductRatingDTO } from 'dtos/product/ProductRatingDTO';
import { ProductVariantDTO } from 'dtos/product/ProductVariantDTO';
import { ProductImageDTO } from 'dtos/product/ProductImageDTO';

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
        // Lấy sản phẩm và các quan hệ
        const product = await this.repo.findOne({
            where: { id, isDeleted: false },
            relations: ["images", "variants", "ratings", "brand", "shop", "category"],
        });
        if (!product) return { error: "Product not found" };

        const { avg_rating = 0, total_rating = 0 } =
            await this.repo.createQueryBuilder("product")
                .leftJoin("product.ratings", "ratings")
                .select([
                    "COALESCE(AVG(ratings.rating), 0)::float AS avg_rating",
                    "COUNT(ratings.id)::int AS total_rating",
                ])
                .where("product.id = :id", { id })
                .getRawOne() || {};

        const mapOrEmpty = <T, R>(arr: T[] | undefined, fn: (item: T) => R): R[] =>
            Array.isArray(arr) ? arr.map(fn) : [];

        return {
            product_id: product.id,
            shop_id: product.shop?.id ?? 0,
            category_id: product.category?.id ?? 0,
            product_name: product.productName,
            description: product.description ?? null,
            price: Number(product.price),
            is_deleted: !!product.isDeleted,
            created_by: product.createdBy,
            created_at: product.createdAt?.toISOString?.(),
            updated_by: product.updatedBy,
            updated_at: product.updatedAt?.toISOString?.(),
            brand_id: product.brand?.id ?? null,
            brand_name: product.brand?.brandName ?? null,
            shop_name: product.shop?.shopName,
            category_name: product.category?.name,
            avg_rating: Number(avg_rating),
            total_rating: Number(total_rating),
            images: mapOrEmpty(product.images, (img): ProductImageDTO => ({
                image_id: img.id,
                image_url: img.imageUrl,
                sort_order: img.sortOrder,
            })),
            variants: mapOrEmpty(product.variants, (v): ProductVariantDTO => ({
                variant_id: v.id,
                color: v.color ?? "",
                size: v.size ?? "",
                stock_quantity: v.stockQuantity,
                price: Number(v.price),
            })),
            ratings: mapOrEmpty(product.ratings, (r): ProductRatingDTO => ({
                rating_id: r.id,
                user_id: r.userId ?? 0,
                rating: Number(r.rating),
                comment: r.comment,
                created_at: r.createdAt?.toISOString?.(),
            })),
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
