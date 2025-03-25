import 'dotenv/config';

export const DB_PORT: number = parseInt(process.env.DB_PORT);
export const { PORT, JWT_SECRET, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } =
  process.env;
