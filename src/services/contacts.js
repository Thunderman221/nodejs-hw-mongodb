import Contact from '../db/models/contacts.js';

export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to retrieve contacts');
  }
};

export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to retrieve contact');
  }
};
