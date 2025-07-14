import { AppDataSource } from 'config/db';
import { Order } from '../entities/Order';
import { BaseRepository } from './base.repository';
import { OrderDetailRepository } from './order-detail.repository';
import { ShopRepository } from './shop.repository';

export class OrderRepository extends BaseRepository<Order> {
    private detailRepo: OrderDetailRepository;

    constructor() {
        super(AppDataSource.getRepository(Order));
        this.detailRepo = new OrderDetailRepository();
    }



    // Lấy danh sách order của user (bao gồm cả details)
    async findByUserId(userId: number) {
        return await this.repo.find({
            where: { userId, isDeleted: false },
            order: { createdAt: 'DESC' },
            relations: ['orderDetails'],
        });
    }

    // Lấy chi tiết 1 order (bao gồm details và product)
    async findOrderDetails(orderId: number) {
        return await this.repo.findOne({
            where: { id: orderId, isDeleted: false },
            relations: ['orderDetails'],
        });
    }
    // Tạo order mới (và details)
    async createOrder(orderData: Partial<Order>, details: Partial<any>[], userId: number) {
        const savedOrder = await this.saveWithUser(orderData, userId);

        // Lưu từng order detail với thông tin user
        for (const d of details) {
            d.orderId = savedOrder.id;
            await this.detailRepo.createOrderDetailWithUser(d, userId);
        }

        // Trả về order kèm details
        return this.findOrderDetails(savedOrder.id);
    }

    // Xóa mềm order
    async deleteOrder(orderId: number) {
        await this.repo.update(orderId, { isDeleted: true });
        return await this.repo.findOne({ where: { id: orderId } });
    }
}