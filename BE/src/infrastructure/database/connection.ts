import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { UserEntity } from '../orm/entities/UserEntity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  synchronize: false,
  logging: process.env.NODE_ENV === 'local',
  entities: [UserEntity],
  migrations: [__dirname + '/migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
});

export const initializeDatabase = async (): Promise<DataSource> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
};