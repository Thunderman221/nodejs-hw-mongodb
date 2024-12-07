import Contact from '../db/models/contacts.js';
import { buildFilters } from '../utils/buildFilters.js';

import mongoose from 'mongoose';

export const getAllContacts = async (
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filters = {},
  userId,
) => {
  try {
    const skip = page > 0 ? (page - 1) * perPage : 0;
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
    console.error(error);
    throw new Error('Error retrieving contacts');
  }
};

export const getContactById = async (contactId, userId) => {
  try {
    const contact = await Contact.findOne({ _id: contactId, userId });
    if (!contact) {
      throw new Error('Contact not found or not owned by user');
    }
    return contact;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving contact by ID');
  }
};

export const createContact = async ({
  name,
  phoneNumber,
  email,
  isFavourite,
  contactType,
  userId,
}) => {
  try {
    const newContact = new Contact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId,
    });

    await newContact.save();
    return newContact;
  } catch (error) {
    console.error(error);
    throw new Error('Error creating contact');
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
      throw new Error('Contact not found or not owned by user');
    }

    return updatedContact;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw new Error('Error updating contact');
  }
};

export const deleteContact = async (contactId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw new Error('Invalid contact ID');
  }

  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });

  if (!contact) {
    throw new Error('Contact not found or not owned by user');
  }

  return contact;
};
