import Contact from '../db/models/contacts.js';

import mongoose from 'mongoose';

export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving contacts');
  }
};

export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
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
}) => {
  try {
    const newContact = new Contact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    });

    await newContact.save();
    return newContact;
  } catch (error) {
    console.error(error);

    throw new Error('Error creating contact');
  }
};

export const updateContact = async (contactId, updatedData) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      updatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    return updatedContact; // Повертаємо об'єкт контакту
  } catch (error) {
    console.error('Error updating contact:', error);
    throw new Error('Error updating contact');
  }
};

export const deleteContact = async (contactId) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw new Error('Invalid contact ID');
  }

  const contact = await Contact.findByIdAndDelete(contactId);

  return contact;
};
