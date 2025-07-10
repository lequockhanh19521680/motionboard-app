import { User } from '../entities/User';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsernameOrEmail(username: string, email: string): Promise<User | null>;
  isEmailUnique(email: string, excludeUserId?: number): Promise<boolean>;
  isUsernameUnique(username: string, excludeUserId?: number): Promise<boolean>;
  create(user: Omit<User, 'id'>): Promise<User>;
  update(id: number, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}