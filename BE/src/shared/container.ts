import 'reflect-metadata';
import { Container } from 'inversify';
import { DataSource } from 'typeorm';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { TypeORMUserRepository } from '../infrastructure/orm/repositories/TypeORMUserRepository';
import { LoginUserUseCase } from '../application/usecases/user/LoginUserUseCase';
import { RegisterUserUseCase } from '../application/usecases/user/RegisterUserUseCase';
import { GetUserDetailUseCase } from '../application/usecases/user/GetUserDetailUseCase';
import { UpdateUserUseCase } from '../application/usecases/user/UpdateUserUseCase';
import { GetAllUsersUseCase } from '../application/usecases/user/GetAllUsersUseCase';

export const container = new Container();

export const configureContainer = (dataSource: DataSource) => {
  // Infrastructure
  container.bind<DataSource>('DataSource').toConstantValue(dataSource);

  // Repositories
  container.bind<IUserRepository>('IUserRepository').to(TypeORMUserRepository);

  // Use Cases
  container.bind<LoginUserUseCase>(LoginUserUseCase).toSelf();
  container.bind<RegisterUserUseCase>(RegisterUserUseCase).toSelf();
  container.bind<GetUserDetailUseCase>(GetUserDetailUseCase).toSelf();
  container.bind<UpdateUserUseCase>(UpdateUserUseCase).toSelf();
  container.bind<GetAllUsersUseCase>(GetAllUsersUseCase).toSelf();
};