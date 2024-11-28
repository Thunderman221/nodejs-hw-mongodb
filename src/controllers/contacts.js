import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import mongoose from 'mongoose';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

export const getAllContactsController = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const perPage = parseInt(req.query.perPage, 10) || 10;
  const sortBy = req.query.sortBy || 'name';
  const sortOrder = req.query.sortOrder || 'asc';
  const type = req.query.type;
  const isFavourite = req.query.isFavourite;

  if (page < 1 || perPage < 1) {
    throw createHttpError(400, 'Page and perPage must be positive integers');
  }

  if (!['asc', 'desc'].includes(sortOrder)) {
    throw createHttpError(400, 'Invalid sortOrder. Use "asc" or "desc"');
  }

  const filters = {};
  if (type) {
    filters.type = type;
  }
  if (isFavourite !== undefined) {
    filters.isFavourite = isFavourite;
  }

  const { contacts, totalItems } = await getAllContacts(
    page,
    perPage,
    sortBy,
    sortOrder,
    filters,
  );
  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    },
  });
};

// Контроллер для получения контакта по ID
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `The contact with id ${contactId} is found successfully!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { error } = createContactSchema.validate(req.body);

  if (error) {
    throw createHttpError(400, error.details[0].message);
  }

  const newContact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const updatedData = req.body;

  const { error } = updateContactSchema.validate(updatedData);
  if (error) {
    throw createHttpError(400, error.details[0].message);
  }

  if (Object.keys(updatedData).length === 0) {
    throw createHttpError(400, 'No fields provided to update');
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(400, 'Invalid contact ID');
    }

    const updatedContact = await updateContact(contactId, updatedData);

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated the contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(400, 'Invalid contact ID');
    }

    const contact = await deleteContact(contactId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
