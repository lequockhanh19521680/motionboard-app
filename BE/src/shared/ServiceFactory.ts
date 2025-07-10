import { DataSource } from 'typeorm';
import { TypeORMUserRepository } from '@infrastructure/orm/repositories/TypeORMUserRepository';
import { LoginUserUseCase } from '@application/usecases/user/LoginUserUseCase';
import { RegisterUserUseCase } from '@application/usecases/user/RegisterUserUseCase';
import { GetUserDetailUseCase } from '@application/usecases/user/GetUserDetailUseCase';
import { UpdateUserUseCase } from '@application/usecases/user/UpdateUserUseCase';
import { GetAllUsersUseCase } from '@application/usecases/user/GetAllUsersUseCase';

export class ServiceFactory {
  private static instance: ServiceFactory;
  private dataSource: DataSource;

  private constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  static initialize(dataSource: DataSource): void {
    ServiceFactory.instance = new ServiceFactory(dataSource);
  }

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      throw new Error('ServiceFactory not initialized. Call initialize() first.');
    }
    return ServiceFactory.instance;
  }

  // Repositories
  getUserRepository() {
    return new TypeORMUserRepository(this.dataSource);
  }

  // Use Cases
  getLoginUserUseCase() {
    return new LoginUserUseCase(this.getUserRepository());
  }

  getRegisterUserUseCase() {
    return new RegisterUserUseCase(this.getUserRepository());
  }

  getGetUserDetailUseCase() {
    return new GetUserDetailUseCase(this.getUserRepository());
  }

  getUpdateUserUseCase() {
    return new UpdateUserUseCase(this.getUserRepository());
  }

  getGetAllUsersUseCase() {
    return new GetAllUsersUseCase(this.getUserRepository());
  }
}