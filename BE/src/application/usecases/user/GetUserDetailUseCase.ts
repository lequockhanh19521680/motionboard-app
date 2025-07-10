import { IUserRepository } from '@domain/repositories/IUserRepository';

export class GetUserDetailUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: number): Promise<{
    id: number;
    username: string;
    email: string;
    fullName: string;
    image?: string;
    phone?: string;
    isDeleted: boolean;
    createdAt: Date;
  }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user.toSafeUser();
  }
}