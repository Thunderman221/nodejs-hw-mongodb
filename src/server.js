import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import {
  getContacts,
  getContactById,
} from './controllers/contactsController.js';

const setupServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', getContacts);
  app.get('/contacts/:contactId', getContactById);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server', error);
    process.exit(1);
  }
};

export { setupServer };
