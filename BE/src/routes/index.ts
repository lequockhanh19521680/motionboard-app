import { Router } from "express";

// Banner Controllers
import { getAllBanners, getBannerById, createBanner, updateBanner, deleteBanner } from "controllers/banner.controller";
// Cart Controllers
import { listCartItems, addCartItem, updateCartItem, removeCartItem, getCartItem } from "controllers/cart.controller";
// Category Controllers
import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from "controllers/category.controller";
// Order Controllers
import { listOrders, getOrderDetails, createOrder, deleteOrder } from "controllers/order.controller";
// Shop Controllers
import { listShops, getShop, createShop, updateShop, deleteShop } from "controllers/shop.controller";
// User Controllers
import { listUsers, getUserById, getUserByUsername, getUserByEmail, registerUser, updateUser, deleteUser } from "controllers/user.controller";

// Product Controllers (giả định bạn đã tạo controller cho product)
import {
    searchProducts, getProductDetail, createProduct, updateProduct, deleteProduct,
    addProductImages, addProductVariants
} from "controllers/product.controller";

const router = Router();

// --- Banner Routes ---
router.get('/banners', getAllBanners);
router.get('/banners/:id', getBannerById);
router.post('/banners', createBanner);
router.put('/banners/:id', updateBanner);
router.delete('/banners/:id', deleteBanner);

// --- Cart Routes ---
router.get('/cart', listCartItems);
router.post('/cart', addCartItem);
router.get('/cart/:id', getCartItem);
router.put('/cart/:id', updateCartItem);
router.delete('/cart/:id', removeCartItem);

// --- Category Routes ---
router.get('/categories', listCategories);
router.get('/categories/:id', getCategory);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// --- Order Routes ---
router.get('/orders', listOrders);
router.get('/orders/:id', getOrderDetails);
router.post('/orders', createOrder);
router.delete('/orders/:id', deleteOrder);

// --- Shop Routes ---
router.get('/shops', listShops);
router.get('/shops/:id', getShop);
router.post('/shops', createShop);
router.put('/shops/:id', updateShop);
router.delete('/shops/:id', deleteShop);

// --- User Routes ---
router.get('/users', listUsers);
router.get('/users/:id', getUserById);
router.get('/users/username/:username', getUserByUsername);
router.get('/users/email/:email', getUserByEmail);
router.post('/users', registerUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// --- Product Routes ---
router.get('/products', searchProducts);
router.get('/products/:id', getProductDetail);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/:id/images', addProductImages);
router.post('/products/:id/variants', addProductVariants);

// Export router for use in your app.ts/server.ts
export default router;
