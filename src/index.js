import dotenv from 'dotenv';
dotenv.config();

import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const bootstrap = async () => {
  try {
    await initMongoConnection();
    await setupServer();
  } catch (error) {
    console.error('Failed to initialize the application', error);
    process.exit(1);
  }
};

bootstrap();
