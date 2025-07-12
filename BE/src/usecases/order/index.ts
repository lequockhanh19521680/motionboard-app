import { Order } from "entities/Order";
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

    async createOrderForUser(orderData: Partial<Order>) {
        return this.orderRepo.createOrder(orderData);
    }

    async softDeleteOrderById(orderId: number) {
        return this.orderRepo.deleteOrder(orderId);
    }
}
