import { User } from "entities/User";
import { UserRepository } from "repositories/user.repository";

export class UserUseCase {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepo.findByUsername(username);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

  async registerUser(userData: Partial<User>): Promise<User> {
    return this.userRepo.createUser(userData);
  }

  async updateUserById(
    userId: number,
    userData: Partial<User>
  ): Promise<User | null> {
    return this.userRepo.updateUser(userId, userData);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepo.getAllUsers();
  }

  async getUserById(userId: number): Promise<User | null> {
    return this.userRepo.getUserById(userId);
  }

  async softDeleteUserById(userId: number): Promise<User | null> {
    return this.userRepo.deleteUser(userId);
  }
}
