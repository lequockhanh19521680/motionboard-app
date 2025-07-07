export const USER_ROLE = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SHOP: 'shop',
}

export const PAGE_ROUTES = {
  TEST: '/test',
  LOGIN: '/login',
  REGISTER: '/register',
  HOME: '/home',
  SHOP: '/shop',
  ADMIN: '/admin',
  AFTER_LOGIN: '/after-login',
  PRODUCT_DETAIL: '/product/:id',
}

export const API_ROUTES = {
  USERS: '/users',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  SHOPS: '/shops',
  CARTS: '/carts',
  ORDERS: '/orders',
  UPLOAD_IMAGE: '/images/upload',
  UPLOAD_MULTI_IMAGE: '/images/upload-multiple',
  DELETE_IMAGE: '/images',
  GET_SIGNED_URL: '/images/signed-url',
}

export const STORAGE_KEYS = {
  TOKEN: 'token',
  ROLE: 'role',
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info'
