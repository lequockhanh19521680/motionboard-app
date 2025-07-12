import { Response } from "express";
import { AuthRequest } from "middleware/auth.middleware"; // Nếu dùng xác thực user
import { OrderUseCase } from "usecases/order";

const orderUseCase = new OrderUseCase();

// [GET] /orders
export const listOrders = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id || 0;
        const orders = await orderUseCase.listOrdersByUser(userId);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [GET] /orders/:id
export const getOrderDetails = async (req: AuthRequest, res: Response) => {
    try {
        const orderId = Number(req.params.id);
        const order = await orderUseCase.getOrderDetailsById(orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [POST] /orders
export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id || 0;
        const order = await orderUseCase.createOrderForUser({ ...req.body, userId });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [DELETE] /orders/:id
export const deleteOrder = async (req: AuthRequest, res: Response) => {
    try {
        const orderId = Number(req.params.id);
        const deleted = await orderUseCase.softDeleteOrderById(orderId);
        if (!deleted) return res.status(404).json({ error: "Order not found" });
        res.json({ message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
