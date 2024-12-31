import createHttpError from 'http-errors';
import Contact from '../db/models/contacts.js';
import { buildFilters } from '../utils/buildFilters.js';

export const getAllContacts = async (
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filters = {},
  userId,
) => {
  try {
    const skip = (page - 1) * perPage;
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    const filterConditions = buildFilters(filters);
    filterConditions.userId = userId;

    const [contacts, totalItems] = await Promise.all([
      Contact.find(filterConditions)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(perPage),
      Contact.countDocuments(filterConditions),
    ]);

    return { contacts, totalItems };
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    throw createHttpError(500, 'Error retrieving contacts');
  }
};

export const getContactById = async (contactId, userId) => {
  try {
    const contact = await Contact.findOne({ _id: contactId, userId });
    if (!contact) {
      throw createHttpError(404, 'Contact not found or not owned by user');
    }
    return contact;
  } catch (error) {
    console.error('Error retrieving contact by ID:', error);
    if (error.name === 'CastError') {
      throw createHttpError(400, 'Invalid contact ID format');
    }
    throw createHttpError(500, 'Error retrieving contact by ID');
  }
};

export const createContact = async ({
  name,
  phoneNumber,
  email,
  isFavourite,
  contactType,
  userId,
  photo,
}) => {
  try {
    const newContact = new Contact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId,
      photo,
    });

    await newContact.save();
    return newContact;
  } catch (error) {
    console.error('Error creating contact:', error);
    if (error.name === 'ValidationError') {
      throw createHttpError(400, 'Validation error during contact creation');
    }
    throw createHttpError(500, 'Error creating contact');
  }
};

export const updateContact = async (contactId, updatedData, userId) => {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, userId },
      updatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found or not owned by user');
    }

    return updatedContact;
  } catch (error) {
    console.error('Error updating contact:', error);
    if (error.name === 'ValidationError') {
      throw createHttpError(400, 'Validation error during contact update');
    }
    if (error.name === 'CastError') {
      throw createHttpError(400, 'Invalid contact ID format');
    }
    throw createHttpError(500, 'Error updating contact');
  }
};

export const deleteContact = async (contactId, userId) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: contactId, userId });

    if (!contact) {
      throw createHttpError(404, 'Contact not found or not owned by user');
    }

    return contact;
  } catch (error) {
    console.error('Error deleting contact:', error);
    if (error.name === 'CastError') {
      throw createHttpError(400, 'Invalid contact ID format');
    }
    throw createHttpError(500, 'Error deleting contact');
  }
};
