import { AppDataSource } from 'config/db'; // Sửa đường dẫn nếu cần
import { User } from '../entities/User';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(AppDataSource.getRepository(User));
    }
    async findByUsername(username: string): Promise<User | null> {
        return this.repo.findOne({ where: { username } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repo.findOne({ where: { email } });
    }

    async createUser(userData: Partial<User>): Promise<User> {
        const user = this.repo.create(userData);
        return this.repo.save(user);
    }

    async updateUser(userId: number, userData: Partial<User>): Promise<User | null> {
        await this.updateWithUser(userId, userData, userId);
        const user = await this.getUserById(userId);
        return user as User | null;
    }

    async getAllUsers(): Promise<User[]> {
        return this.repo.find();
    }

    async getUserById(userId: number): Promise<User | null> {
        const user = await this.repo.findOne({ where: { id: userId } });
        return user
    }

    async deleteUser(userId: number): Promise<User | null> {
        await this.repo.update(userId, { isDeleted: true });
        return this.getUserById(userId);
    }
}
