import { Request, Response } from "express";
import { container } from "../../shared/container";
import { LoginUserUseCase } from "../../application/usecases/user/LoginUserUseCase";
import { RegisterUserUseCase } from "../../application/usecases/user/RegisterUserUseCase";
import { GetUserDetailUseCase } from "../../application/usecases/user/GetUserDetailUseCase";
import { UpdateUserUseCase } from "../../application/usecases/user/UpdateUserUseCase";
import { GetAllUsersUseCase } from "../../application/usecases/user/GetAllUsersUseCase";
import { AuthRequest } from "../../shared/types/AuthRequest";
import { getPresignedUrl } from "../../config/s3Utils";

export class UserController {
  async getAllUsers(_req: Request, res: Response): Promise<any> {
    try {
      const getAllUsersUseCase = container.get<GetAllUsersUseCase>(GetAllUsersUseCase);
      const users = await getAllUsersUseCase.execute();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async loginUser(req: Request, res: Response): Promise<any> {
    try {
      const loginUserUseCase = container.get<LoginUserUseCase>(LoginUserUseCase);
      const result = await loginUserUseCase.execute(req.body);
      return res.json(result);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === 'User not found' || errorMessage === 'Invalid credentials') {
        return res.status(401).json({ error: errorMessage });
      }
      return res.status(500).json({ error: errorMessage });
    }
  }

  async registerUser(req: Request, res: Response): Promise<any> {
    try {
      const registerUserUseCase = container.get<RegisterUserUseCase>(RegisterUserUseCase);
      const result = await registerUserUseCase.execute(req.body);
      return res.status(201).json(result);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === 'Username or email already exists') {
        return res.status(400).json({ error: errorMessage });
      }
      return res.status(500).json({ error: errorMessage });
    }
  }

  async updateUser(req: AuthRequest, res: Response): Promise<any> {
    const userId = req.user_id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    try {
      const updateUserUseCase = container.get<UpdateUserUseCase>(UpdateUserUseCase);
      
      // Remap fullName to match domain model
      const requestBody = { ...req.body };
      if (requestBody.fullName !== undefined) {
        requestBody.fullName = requestBody.fullName;
      }
      
      const updatedUser = await updateUserUseCase.execute({
        userId,
        ...requestBody
      });

      // Add presigned URL for image if exists
      if (updatedUser.image) {
        (updatedUser as any).image = await getPresignedUrl(updatedUser.image);
      }

      return res.json({ user: updatedUser });
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('already in use')) {
        return res.status(400).json({ error: errorMessage });
      }
      if (errorMessage === 'User not found') {
        return res.status(404).json({ error: errorMessage });
      }
      return res.status(500).json({ error: errorMessage });
    }
  }

  async getUserDetail(req: AuthRequest, res: Response): Promise<any> {
    const userId = req.user_id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    try {
      const getUserDetailUseCase = container.get<GetUserDetailUseCase>(GetUserDetailUseCase);
      const user = await getUserDetailUseCase.execute(userId);
      
      // Add presigned URL for image if exists
      if (user.image) {
        (user as any).image = await getPresignedUrl(user.image);
      }

      return res.json(user);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === 'User not found') {
        return res.status(404).json({ error: errorMessage });
      }
      return res.status(500).json({ error: errorMessage });
    }
  }
}

// Export controller instance methods as functions to maintain compatibility
const userController = new UserController();

export const getAllUsers = userController.getAllUsers.bind(userController);
export const loginUser = userController.loginUser.bind(userController);
export const registerUser = userController.registerUser.bind(userController);
export const updateUser = userController.updateUser.bind(userController);
export const getUserDetail = userController.getUserDetail.bind(userController);