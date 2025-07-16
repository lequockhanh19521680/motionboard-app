export interface OrderDetailRequest {
  cartId: number;
  variantId: number;
  productId: number;
  productName: string;
  quantity: number;
  variantPrice: string;
  imageUrl: string;
  color: string;
  size: string;
  sku: string;
  brandId: number;
  stockQuantity: number;
}

export interface OrderRequest {
  shopId: number;
  shopName: string;
  items: OrderDetailRequest[];
  address: string;
  shopNote: string;
}
