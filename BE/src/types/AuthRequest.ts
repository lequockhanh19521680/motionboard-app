// types/AuthRequest.ts
import { Request } from "express";
export interface AuthRequest extends Request {
  user_id?: number;
}
