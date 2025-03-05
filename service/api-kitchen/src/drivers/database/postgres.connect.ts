import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { databaseConfig } from '../../common/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: databaseConfig.postgres.host,
  port: databaseConfig.postgres.port,
  username: databaseConfig.postgres.user,
  password: databaseConfig.postgres.password,
  database: databaseConfig.postgres.database,
  synchronize: false, // Usar solo en desarrollo
  logging: false,
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'], // Ruta a las entidades
});
