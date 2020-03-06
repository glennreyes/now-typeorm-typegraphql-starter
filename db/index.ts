import 'reflect-metadata';
import { ConnectionOptions, getConnectionManager } from 'typeorm';

const connectionOptions: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  name: 'graphql',
  synchronize: true,
  // Needs to be .js, not sure why
  entities: ['./db/entity/**/*.js'],
  migrations: ['./db/migration/**/*.js'],
  subscribers: ['./db/subscriber/**/*.js'],
};

// Create a connection manager instance
const connectionManager = getConnectionManager();

export const connect = async () => {
  const connection = connectionManager.has(connectionOptions.name!)
    ? await connectionManager.get(connectionOptions.name)
    : await connectionManager.create(connectionOptions);

  if (!connection.isConnected) {
    await connection.connect();
  }

  return connection;
};
