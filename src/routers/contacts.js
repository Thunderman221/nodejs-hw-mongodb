import express from 'express';

import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const router = express.Router();
const jsonParser = express.json();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post(
  '/',
  upload.single('photo'),
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  jsonParser,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
