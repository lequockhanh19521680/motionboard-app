export interface CartItemPreview {
  cartId: number;
  variantId: number;
  productName: string;
  quantity: number;
  variantPrice: string;
  imageUrl: string;
  color: string;
  size: string;
  sku: string;
  brandId: number;
  stockQuantity: number;
  shopId: number;        
  shopName: string;      
}

export interface ShopCart {
  shopId: number;
  shopName: string;
  items: CartItemPreview[];
}
