import { OrderDetail } from "../entities/OrderDetail";
import { BaseRepository } from "./base.repository";
import { AppDataSource } from "config/db";

export class OrderDetailRepository extends BaseRepository<OrderDetail> {
  constructor() {
    super(AppDataSource.getRepository(OrderDetail));
  }

  async createOrderDetailWithUser(
    orderDetailData: Partial<OrderDetail>,
    userId: number
  ) {
    const orderDetail = this.repo.create(orderDetailData);
    return this.saveWithUser(orderDetail, userId);
  }
}
