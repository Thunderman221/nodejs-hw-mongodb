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

export const getAllContactsController = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
    } = req.query;
    const { contacts, totalItems } = await getAllContacts(
      parseInt(page, 10),
      parseInt(perPage, 10),
      sortBy,
      sortOrder,
      {},
      req.user._id,
    );

    const totalPages = Math.ceil(totalItems / perPage);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  const contact = await getContactById({
    _id: contactId,
    userId: req.user._id,
  });

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

  const newContact = await createContact({
    ...req.body,
    userId: req.user._id,
  });

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
