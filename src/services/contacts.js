import Contact from '../db/models/contacts.js';

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

export const updateContact = async (contactId, updatedData, options = {}) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: contactId },
    updatedData,
    {
      new: true,
      runValidators: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
export const deleteContact = async (contactId) => {
  const contact = await Contact.findOneAndDelete({
    id: contactId,
  });
  return contact;
};
