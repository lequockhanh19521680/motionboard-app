export class Product {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly shopId: number,
    public readonly categoryId: number,
    public readonly brandId?: number,
    public readonly image?: string,
    public readonly stock: number = 0,
    public readonly isDeleted: boolean = false,
    public readonly createdAt: Date = new Date()
  ) {}

  static create(
    name: string,
    description: string,
    price: number,
    shopId: number,
    categoryId: number,
    brandId?: number,
    image?: string,
    stock: number = 0
  ): Omit<Product, 'id'> {
    return new Product(
      0, // ID will be set by repository
      name,
      description,
      price,
      shopId,
      categoryId,
      brandId,
      image,
      stock,
      false,
      new Date()
    );
  }

  updateStock(newStock: number): Product {
    return new Product(
      this.id,
      this.name,
      this.description,
      this.price,
      this.shopId,
      this.categoryId,
      this.brandId,
      this.image,
      newStock,
      this.isDeleted,
      this.createdAt
    );
  }

  updatePrice(newPrice: number): Product {
    return new Product(
      this.id,
      this.name,
      this.description,
      newPrice,
      this.shopId,
      this.categoryId,
      this.brandId,
      this.image,
      this.stock,
      this.isDeleted,
      this.createdAt
    );
  }

  isAvailable(): boolean {
    return !this.isDeleted && this.stock > 0;
  }
}