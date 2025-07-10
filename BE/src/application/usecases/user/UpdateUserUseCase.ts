import { injectable, inject } from 'inversify';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export interface UpdateUserRequest {
  userId: number;
  username?: string;
  email?: string;
  fullName?: string;
  image?: string;
  phone?: string;
}

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  async execute(request: UpdateUserRequest): Promise<{
    id: number;
    username: string;
    email: string;
    fullName: string;
    image?: string;
    phone?: string;
    isDeleted: boolean;
    createdAt: Date;
  }> {
    const { userId, ...updates } = request;

    // Check if user exists
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Check email uniqueness if email is being updated
    if (updates.email && updates.email !== existingUser.email) {
      const isEmailUnique = await this.userRepository.isEmailUnique(updates.email, userId);
      if (!isEmailUnique) {
        throw new Error('Email already in use by another user');
      }
    }

    // Check username uniqueness if username is being updated
    if (updates.username && updates.username !== existingUser.username) {
      const isUsernameUnique = await this.userRepository.isUsernameUnique(updates.username, userId);
      if (!isUsernameUnique) {
        throw new Error('Username already in use by another user');
      }
    }

    // Update user
    const updatedUser = await this.userRepository.update(userId, updates);
    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    return updatedUser.toSafeUser();
  }
}