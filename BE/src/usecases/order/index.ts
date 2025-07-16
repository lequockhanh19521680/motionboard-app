import { Order } from "entities/Order";
import { OrderDetail } from "entities/OrderDetail";
import { OrderRepository } from "repositories/order.repository";

export class OrderUseCase {
  private orderRepo: OrderRepository;

  constructor() {
    this.orderRepo = new OrderRepository();
  }

  async listOrdersByUser(userId: number) {
    return this.orderRepo.findByUserId(userId);
  }

  async getOrderDetailsById(orderId: number) {
    return this.orderRepo.findOrderDetails(orderId);
  }

  async createOrderForUser(details: Partial<OrderDetail>[], userId: number) {
    return this.orderRepo.createOrder(details, userId);
  }

  async softDeleteOrderById(orderId: number) {
    return this.orderRepo.deleteOrder(orderId);
  }
}
