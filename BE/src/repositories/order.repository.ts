import { AppDataSource } from 'config/db'; // hoặc đường dẫn tới file data-source của bạn
import { Order } from '../entities/Order';

export class OrderRepository {
    private repo = AppDataSource.getRepository(Order);

    async findByUserId(userId: number) {
        return await this.repo.find({
            where: { userId, isDeleted: false },
            order: { createdAt: 'DESC' }
        });
    }

    async findOrderDetails(orderId: number) {
        return await this.repo.createQueryBuilder('order')
            .leftJoinAndSelect('order.orderDetails', 'orderDetail')
            .leftJoinAndSelect('orderDetail.product', 'product')
            .where('order.id = :orderId', { orderId })
            .andWhere('order.isDeleted = false')
            .getOne();
    }

    async createOrder(orderData: Partial<Order>) {
        const order = this.repo.create(orderData);
        return await this.repo.save(order);
    }

    async deleteOrder(orderId: number) {
        await this.repo.update(orderId, { isDeleted: true });
        return await this.repo.findOne({ where: { id: orderId } });
    }
}
