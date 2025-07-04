import userRoutes from './user.route';
import productRoutes from './product.route';
import categoryRoutes from './category.route';
import shopRoutes from './shop.route';
import cartRoutes from './cart.route';
import orderRoutes from './order.route';

export default [
    { path: '/api/users', router: userRoutes },
    { path: '/api/products', router: productRoutes },
    { path: '/api/categories', router: categoryRoutes },
    { path: '/api/shops', router: shopRoutes },
    { path: '/api/carts', router: cartRoutes },
    { path: '/api/orders', router: orderRoutes }


];