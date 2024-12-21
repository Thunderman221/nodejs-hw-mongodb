import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

const setupServer = async () => {
  try {
    const app = express();
    const PORT = process.env.PORT || 3000;

    const swaggerDocument = YAML.load('./src/docs/openapi.yaml');

    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());

    app.use(
      pino({
        transport: {
          target: 'pino-pretty',
        },
      }),
    );

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use('/contacts', contactsRouter);
    app.use('/auth', authRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start the server', error);
    process.exit(1);
  }
};

export { setupServer };
