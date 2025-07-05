export const USER_ROLE = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SHOP: 'shop',
}

export const ROUTES = {
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
}

export const STORAGE_KEYS = {
  TOKEN: 'token',
  ROLE: 'role',
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info'
