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

  async findByUserId(userId: number) {
    return await this.repo.find({
      where: { userId, isDeleted: false },
      order: { createdAt: "DESC" },
      relations: ["orderDetails"],
    });
  }

  async findOrderDetails(orderId: number) {
    return await this.repo.findOne({
      where: { id: orderId, isDeleted: false },
      relations: ["orderDetails"],
    });
  }

  async createOrder(orderRequests: any[], userId: number) {
    const allResults = [];
    for (const shopOrder of orderRequests) {
      const orderData: Partial<Order> = {
        userId,
        shopId: shopOrder.shopId,
        shippingAddress: shopOrder.address,
        note: shopOrder.shopNote,
        status: "pending",
        orderDate: new Date(),
      };
      const savedOrder = await this.saveWithUser(orderData, userId);
      for (const item of shopOrder.items) {
        const { variantPrice, ...rest } = item;
        const detail: Partial<OrderDetail> = {
          ...rest,
          priceAtOrder: variantPrice,
          orderId: savedOrder.id,
        };
        console.log("detail", detail);
        await this.detailRepo.createOrderDetailWithUser(detail, userId);
      }

      const orderWithDetails = await this.findOrderDetails(savedOrder.id);
      allResults.push(orderWithDetails);
    }

    return allResults;
  }

  async deleteOrder(orderId: number) {
    await this.repo.update(orderId, { isDeleted: true });
    return await this.repo.findOne({ where: { id: orderId } });
  }
}
