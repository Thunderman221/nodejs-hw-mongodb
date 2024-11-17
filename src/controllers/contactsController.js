import { getAllContacts, getContactByIdService } from '../services/contacts.js';

export const getContacts = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to retrieve contacts',
      error: error.message,
    });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const contact = await getContactByIdService(contactId);
    if (contact) {
      res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } else {
      res.status(404).json({
        message: 'Contact not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to retrieve contact',
      error: error.message,
    });
  }
};
