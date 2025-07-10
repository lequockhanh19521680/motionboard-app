import { Repository, DataSource } from 'typeorm';
import { injectable } from 'inversify';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserEntity } from '../entities/UserEntity';

@injectable()
export class TypeORMUserRepository implements IUserRepository {
  private repository: Repository<UserEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserEntity);
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find({
      where: { isDeleted: false }
    });
    return entities.map(this.toDomain);
  }

  async findById(id: number): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { userId: id, isDeleted: false }
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { username, isDeleted: false }
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { email, isDeleted: false }
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByUsernameOrEmail(username: string, email: string): Promise<User | null> {
    const entity = await this.repository
      .createQueryBuilder('user')
      .where('(user.username = :username OR user.email = :email) AND user.isDeleted = false')
      .setParameters({ username, email })
      .getOne();
    return entity ? this.toDomain(entity) : null;
  }

  async isEmailUnique(email: string, excludeUserId?: number): Promise<boolean> {
    const query = this.repository
      .createQueryBuilder('user')
      .where('user.email = :email AND user.isDeleted = false')
      .setParameters({ email });

    if (excludeUserId) {
      query.andWhere('user.userId != :excludeUserId', { excludeUserId });
    }

    const count = await query.getCount();
    return count === 0;
  }

  async isUsernameUnique(username: string, excludeUserId?: number): Promise<boolean> {
    const query = this.repository
      .createQueryBuilder('user')
      .where('user.username = :username AND user.isDeleted = false')
      .setParameters({ username });

    if (excludeUserId) {
      query.andWhere('user.userId != :excludeUserId', { excludeUserId });
    }

    const count = await query.getCount();
    return count === 0;
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const entity = this.toEntity(user);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async update(id: number, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { userId: id, isDeleted: false }
    });

    if (!entity) {
      return null;
    }

    Object.assign(entity, {
      username: updates.username ?? entity.username,
      email: updates.email ?? entity.email,
      fullName: updates.fullName ?? entity.fullName,
      password: updates.password ?? entity.password,
      image: updates.image ?? entity.image,
      phone: updates.phone ?? entity.phone,
      isDeleted: updates.isDeleted ?? entity.isDeleted
    });

    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.update(
      { userId: id },
      { isDeleted: true }
    );
    return result.affected !== undefined && result.affected > 0;
  }

  private toDomain(entity: UserEntity): User {
    return new User(
      entity.userId,
      entity.username,
      entity.email,
      entity.fullName,
      entity.password,
      entity.image,
      entity.phone,
      entity.isDeleted,
      entity.createdAt
    );
  }

  private toEntity(user: Omit<User, 'id'>): Omit<UserEntity, 'userId'> {
    const entity = new UserEntity();
    entity.username = user.username;
    entity.email = user.email;
    entity.fullName = user.fullName;
    entity.password = user.password;
    entity.image = user.image;
    entity.phone = user.phone;
    entity.isDeleted = user.isDeleted;
    entity.createdAt = user.createdAt;
    return entity;
  }
}