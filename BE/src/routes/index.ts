import { Router } from "express";

// Banner Controllers
import {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from "controllers/banner.controller";
// Cart Controllers
import {
  listCartItems,
  addCartItem,
  updateCartItem,
  removeCartItem,
  getCartItem,
} from "controllers/cart.controller";
// Category Controllers
import {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "controllers/category.controller";
// Order Controllers
import {
  listOrders,
  getOrderDetails,
  createOrder,
  deleteOrder,
} from "controllers/order.controller";
// Shop Controllers
import {
  getShop,
  createShop,
  updateShop,
  deleteShop,
  listShopByUserId,
} from "controllers/shop.controller";
// User Controllers
import {
  listUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  registerUser,
  updateUser,
  deleteUser,
  loginUsers,
} from "controllers/user.controller";

// Product Controllers (giả định bạn đã tạo controller cho product)
import {
  searchProducts,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImages,
  addProductVariants,
} from "controllers/product.controller";
import { getBrands } from "controllers/brand.controller";
import { upload } from "middleware/uploadS3";
import { uploadImage } from "controllers/s3.controller";
import { authenticateToken } from "middleware/auth.middleware";

const router = Router();

router.post("/images/upload", upload.single("image"), uploadImage);
router.post("/users/login", loginUsers);
router.post("/users/register", registerUser);

// --- Banner Routes ---
router.get("/banners", getAllBanners);
router.get("/banners/:id", getBannerById);
router.post("/banners", authenticateToken, createBanner);
router.put("/banners/:id", authenticateToken, updateBanner);
router.delete("/banners/:id", authenticateToken, deleteBanner);

// --- Cart Routes ---
router.get("/carts", authenticateToken, listCartItems);
router.post("/carts", authenticateToken, addCartItem);
router.get("/carts/:id", getCartItem);
router.patch("/carts", authenticateToken, updateCartItem);
router.delete("/carts/:id", authenticateToken, removeCartItem);

// --- Category Routes ---
router.get("/categories", listCategories);
router.get("/categories/:id", getCategory);
router.post("/categories", authenticateToken, createCategory);
router.put("/categories/:id", authenticateToken, updateCategory);
router.delete("/categories/:id", authenticateToken, deleteCategory);

// --- Order Routes ---
router.get("/orders", authenticateToken, listOrders);
router.get("/orders/:id", getOrderDetails);
router.post("/orders", authenticateToken, createOrder);
router.delete("/orders/:id", authenticateToken, deleteOrder);

// --- Shop Routes ---
router.get("/shops", authenticateToken, listShopByUserId);
router.get("/shops/:id", getShop);
router.post("/shops", authenticateToken, createShop);
router.put("/shops/:id", authenticateToken, updateShop);
router.delete("/shops/:id", authenticateToken, deleteShop);

// --- User Routes ---
router.get("/users", listUsers);
router.get("/users/profile", authenticateToken, getUserById);
router.get("/users/username/:username", getUserByUsername);
router.get("/users/email/:email", getUserByEmail);

router.put("/users/", authenticateToken, updateUser);
router.delete("/users/", authenticateToken, deleteUser);

// --- Product Routes ---
router.get("/products", searchProducts);
router.get("/products/:id", getProductDetail);
router.post("/products", authenticateToken, createProduct);
router.put("/products/:id", authenticateToken, updateProduct);
router.delete("/products/:id", authenticateToken, deleteProduct);
router.post("/products/:id/images", authenticateToken, addProductImages);
router.post("/products/:id/variants", authenticateToken, addProductVariants);

// Brand Routes
router.get("/brands", getBrands);

// Export router for use in your app.ts/server.ts
export default router;
