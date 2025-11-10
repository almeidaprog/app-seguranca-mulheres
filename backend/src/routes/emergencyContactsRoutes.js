import express from 'express';
import {searchAppUsers, addContact, getMyContacts, updateContact, deleteContact}from '../controllers/emergencyContactController.js';
import {requireAuth} from '../middlewares/authMiddleware.js';

const contactRoute = express.Router();

contactRoute.get('/search',requireAuth,searchAppUsers);
contactRoute.post('',requireAuth,addContact);
contactRoute.get('',requireAuth,getMyContacts);
contactRoute.put('', requireAuth, updateContact);
contactRoute.delete('', requireAuth, deleteContact);

export default contactRoute;