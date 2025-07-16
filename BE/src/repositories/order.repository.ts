import { AppDataSource } from "config/db";
import { Order } from "../entities/Order";
import { BaseRepository } from "./base.repository";
import { OrderDetailRepository } from "./order-detail.repository";
import { CartRepository } from "./cart.repository";
import { OrderDetail } from "entities/OrderDetail";

export class OrderRepository extends BaseRepository<Order> {
  private detailRepo: OrderDetailRepository;
  private cartRepo: CartRepository;

  constructor() {
    super(AppDataSource.getRepository(Order));
    this.detailRepo = new OrderDetailRepository();
    this.cartRepo = new CartRepository();
  }

  // Lấy danh sách order của user (bao gồm cả details)
  async findByUserId(userId: number) {
    return await this.repo.find({
      where: { userId, isDeleted: false },
      order: { createdAt: "DESC" },
      relations: ["orderDetails"],
    });
  }

  // Lấy chi tiết 1 order (bao gồm details và product)
  async findOrderDetails(orderId: number) {
    return await this.repo.findOne({
      where: { id: orderId, isDeleted: false },
      relations: ["orderDetails"],
    });
  }
  // Tạo order mới (và details)
  async createOrder(orderRequests: any[], userId: number) {
    const allResults = [];
    for (const shopOrder of orderRequests) {
      // Tạo order cho từng shop
      const orderData: Partial<Order> = {
        userId,
        shopId: shopOrder.shopId,
        shippingAddress: shopOrder.address,
        note: shopOrder.shopNote,
        orderDate: new Date(),
      };
      // Lưu order; hàm saveWithUser trả về order vừa lưu (có id)
      const savedOrder = await this.saveWithUser(orderData, userId);
      // Lưu các OrderDetail cho từng item trong shop
      for (const item of shopOrder.items) {
        // Tùy schema OrderDetail, bạn map các trường phù hợp
        const detail: Partial<OrderDetail> = {
          ...item,
          orderId: savedOrder.id,
        };
        await this.detailRepo.createOrderDetailWithUser(detail, userId);
      }

      // Lấy lại order có details và push vào mảng kết quả
      const orderWithDetails = await this.findOrderDetails(savedOrder.id);
      allResults.push(orderWithDetails);
    }

    // Trả về mảng order (tương ứng từng shop)
    return allResults;
  }

  // Xóa mềm order
  async deleteOrder(orderId: number) {
    await this.repo.update(orderId, { isDeleted: true });
    return await this.repo.findOne({ where: { id: orderId } });
  }
}
