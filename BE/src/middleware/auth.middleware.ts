import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Định nghĩa type AuthRequest kế thừa Request, thêm thuộc tính user
export interface AuthRequest extends Request {
  user?: {
    id: number;
    [key: string]: any;
  };
}

/**
 * Middleware xác thực JWT, gán user vào req.user.
 */
export const authenticateToken = (
  req: AuthRequest,   // Sử dụng AuthRequest thay vì Request
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number;[key: string]: any };
    req.user = { id: decoded.userId, ...decoded };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalid!" });
  }
};
