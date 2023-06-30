import { DataSource } from 'typeorm';
import 'dotenv/config';

const SnakeNamingStrategy =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('./core/snake-naming.strategy').SnakeNamingStrategy;

export const AppDataSource = new DataSource({
  type: 'sqlite',
  namingStrategy: new SnakeNamingStrategy(),
  //   host: process.env.DB_HOST,
  //   port: +process.env.DB_PORT,
  //   username: process.env.DB_USERNAME,
  //   password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  synchronize: false,
  migrations: ['./src/migration/*.ts'],
  subscribers: [],
  maxQueryExecutionTime: 1000, // 1초 이상되는 모든 쿼리 등록
});
