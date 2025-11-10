import EmergencyContact from '../models/emergencyContactModel.js';
import User from '../models/userModel.js';

export const searchAppUsers = async (req, res, next) => {
  try {
    const { search } = req.query;

     if (!search || typeof search !== 'string') {
      return res.json({
        success: true,
        users: []
      });
    }

    const users = await User.find({
      _id: { $ne: req.session.userId },
      $or: [
        { email: { $regex: search, $options: 'i' } }
      ]
    }).select('name email phoneNumber'); 


    res.json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber
      }))
    });

  } catch (error) {
    next(error);
  }
};
export const addContact = async (req, res, next) => {
  try{

    const {contactType, appUserId, externalContact} = req.body;


    if (contactType === 'app_user' && appUserId){

      const userExists = await User.findById(appUserId);
      if (!userExists) {
        throw new Error('User not found');
      }

      const contact = await EmergencyContact.findOne({
        user: req.session.userId,
        appUser: appUserId
      });

      if (contact) {
        throw new Error('This user is already in your contacts');
      }
    }

    const contact = new EmergencyContact({
      user: req.session.userId,
      contactType,
      appUser: contactType === 'app_user'? appUserId : undefined,
      externalContact: contactType === 'external' ? externalContact : undefined
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Contact added sucefully',
      contact
    });
    
  }catch(err){
    next(err);
  }
};

export const getMyContacts = async (req, res, next) => {
  try {
    const contacts = await EmergencyContact.find({
      user: req.session.userId
    })
      .populate('appUser', 'name email phoneNumber')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      contacts: contacts.map(contact => {
        const contactData = {
          id: contact._id,
          contactType: contact.contactType,
          notifications: contact.notifications,
        };

        
        if (contact.contactType === 'app_user') {
          if (!contact.appUser) {
            return {
              ...contactData,
              name: 'User not found',
              phoneNumber: 'N/A',
              email: 'N/A',
              isAppUser: true,
              isInvalid: true 
            };
          }
          
          return {
            ...contactData,
            name: contact.appUser.name,
            phoneNumber: contact.appUser.phoneNumber,
            email: contact.appUser.email,
            isAppUser: true
          };
        }


        if (contact.contactType === 'external') {
          return {
            ...contactData,
            name: contact.externalContact?.name || 'Nome não informado',
            phoneNumber: contact.externalContact?.phoneNumber || 'N/A',
            email: contact.externalContact?.email || 'N/A',
            relationship: contact.externalContact?.relationship || 'N/A',
            isAppUser: false
          };
        }

        return contactData;
      })
    });
  }catch(err){
    next(err);
  }
};
export const updateContact = async (req, res, next) => {
  try{
  const { contactId } = req.query;
console.log(contactId);

  const contact = await EmergencyContact.findById(contactId);
  
  if (!contact){
    throw new Error('Contact not found');
  }
  if (contact.user.toString() !== req.session.userId) {
    throw new Error('Not alowed');
    }

  let updateData = {};

  if(contact.contactType ==='app_user'){
    const {notifications} = req.body;
   if (notifications) {
      updateData.notifications = {
      ...contact.notifications.toObject(),
      ...notifications};
        } else {
        throw new Error('Field notifications is required');
      } 
  }else if (contact.contactType === 'external') {
      const { notifications, name, email } = req.body;
      
      if (notifications) {
        updateData.notifications = {
          ...contact.notifications.toObject(),
          ...notifications
        };
      }
      if (name || email) {
        updateData.externalContact = {
          ...contact.externalContact.toObject(),
          ...(name && { name }),
          ...(email && { email })
        };
      }
    }
  
  const updatedContact = await EmergencyContact.findByIdAndUpdate(
      contactId,
      updateData,
      { new: true, runValidators: true }
    ).populate('appUser', 'name email phoneNumber');

    res.json({
      success: true,
      message: 'Contact updated sucefully',
      contact: {
        id: updatedContact._id,
        contactType: updatedContact.contactType,
        priority: updatedContact.priority,
        notifications: updatedContact.notifications,
        ...(updatedContact.contactType === 'app_user' && updatedContact.appUser ? {
          name: updatedContact.appUser.name,
          phoneNumber: updatedContact.appUser.phoneNumber,
          email: updatedContact.appUser.email,
          isAppUser: true,
        } : {
          name: updatedContact.externalContact?.name,
          phoneNumber: updatedContact.externalContact?.phoneNumber,
          email: updatedContact.externalContact?.email,
          relationship: updatedContact.externalContact?.relationship,
          isAppUser: false
        })
      }
    });

  }catch(err){
    next(err);
  }
};
export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.query;
    console.log(contactId);

    const contact = await EmergencyContact.findById(contactId);

    if (!contact) {
      throw new Error('Contact not found');
    }

    if (contact.user.toString() !== req.session.userId) {
      throw new Error('Not allowed');
    }


    await EmergencyContact.findByIdAndDelete(contactId);

    res.json({
      success: true,
      message: 'Contact deleted sucefully',
      deletedContactId: contactId
    });

  } catch (error) {
    next(error);
  }
};