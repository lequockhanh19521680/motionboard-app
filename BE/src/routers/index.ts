import userRouters from "./user.route";
import productRouters from "./product.route";
import categoryRouters from "./category.route";
import shopRouters from "./shop.route";
import cartRouters from "./cart.route";
import orderRouters from "./order.route";
import uploadRouters from "./upload.route";
import bannerRouters from "./banner.route";

export default [
  { path: "/api/users", router: userRouters },
  { path: "/api/products", router: productRouters },
  { path: "/api/categories", router: categoryRouters },
  { path: "/api/shops", router: shopRouters },
  { path: "/api/carts", router: cartRouters },
  { path: "/api/orders", router: orderRouters },
  { path: "/api/images", router: uploadRouters },
  { path: "/api/banners", router: bannerRouters },
];
