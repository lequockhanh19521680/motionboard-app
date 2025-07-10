import { IUserRepository } from '@domain/repositories/IUserRepository';

export class GetAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<{
    id: number;
    username: string;
    email: string;
    fullName: string;
    image?: string;
    phone?: string;
    isDeleted: boolean;
    createdAt: Date;
  }[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => user.toSafeUser());
  }
}