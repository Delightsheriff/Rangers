import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from 'src/config';

export const SequelizeConfig: Partial<SequelizeModuleOptions> = {
  dialect: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  autoLoadModels: true,
  synchronize: false,
  dialectOptions: {
    connectTimeout: 60 * 1000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
};
