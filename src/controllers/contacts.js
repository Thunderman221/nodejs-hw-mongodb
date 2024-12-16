import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import { uploadImage } from '../services/cloudinary.js';

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

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const contact = await getContactById(contactId, req.user._id);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `The contact with id ${contactId} is found successfully!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
export const createContactController = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.details[0].message);
    }

    let photoUrl = null;
    if (req.file) {
      const base64Image = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString('base64')}`;
      const uploadResult = await uploadImage(base64Image);
      photoUrl = uploadResult;
    }

    const newContact = await createContact({
      ...req.body,
      photo: photoUrl,
      userId: req.user._id,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.details[0].message);
    }

    let photoUrl = undefined;
    if (req.file) {
      const base64Image = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString('base64')}`;
      const uploadResult = await uploadImage(base64Image);
      photoUrl = uploadResult;
    }

    const updatedData = { ...req.body };
    if (photoUrl) {
      updatedData.photo = photoUrl;
    }

    const updatedContact = await updateContact(
      contactId,
      updatedData,
      req.user._id,
    );

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found or not owned by user');
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
    const contact = await deleteContact(contactId, req.user._id);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
