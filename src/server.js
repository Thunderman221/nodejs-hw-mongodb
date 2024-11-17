import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { getContactById, getAllContacts } from './services/contacts.js';

const setupServer = async () => {
  try {
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

    app.get('/contacts', async (req, res, next) => {
      try {
        const contacts = await getAllContacts();
        res.status(200).json({
          status: 200,
          message: 'Successfully found contacts!',
          data: contacts,
        });
      } catch (error) {
        next(error);
      }
    });

    app.get('/contacts/:contactId', async (req, res, next) => {
      try {
        const { contactId } = req.params;
        const contact = await getContactById(contactId);

        if (!contact) {
          return res.status(404).json({
            message: 'Contact not found',
          });
        }

        res.status(200).json({
          status: 200,
          message: `The contact with id ${contactId} is found successfully!`,
          data: contact,
        });
      } catch (error) {
        next(error);
      }
    });

    app.use('*', (req, res) => {
      res.status(404).json({ message: 'Not found' });
    });

    app.use((error, req, res, next) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error.message,
      });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server', error);
    process.exit(1);
  }
};

export { setupServer };
