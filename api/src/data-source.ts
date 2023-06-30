import { DataSource } from 'typeorm';
import 'dotenv/config';
import { join } from 'path';

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
  enableWAL: true,
  synchronize: false,
  entities: [join(__dirname, '**/*.entity.{ts,js}')],
  subscribers: [],
  maxQueryExecutionTime: 1000, // 1초 이상되는 모든 쿼리 등록
  extra: {
    synchronous: 'normal',
    temp_store: 'memory',
    mmap_size: 30000000000,
    page_size: 32768,
  },
});
