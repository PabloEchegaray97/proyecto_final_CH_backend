import { Router } from 'express';
import messageModel from '../DAO/mongo/models/chat.model.js';
import { generateToken, authToken, passportCall, authorization, isValidPassword } from "../utils.js";
const router = Router();

router.get('/', passportCall('jwt'), authorization('user'), async (req, res) => {
    try {
        const chats = await messageModel.find().lean().exec();
        res.render('chat', { chats });
    } catch (error) {
        console.error('Error fetching messages from the database:', error);
        res.status(500).send('Error fetching messages from the database');
    }
});

router.post('/', passportCall('jwt'), authorization('user'),async (req, res) => {
    const newMessage = req.body;
    newMessage.user = req.user.user.email
    console.log(newMessage);
    try {
        const messageGenerated = new messageModel(newMessage);
        await messageGenerated.save();
        req.app.io.emit('newMessage', newMessage);

        const previousChats = await messageModel.find().lean().exec();
        req.app.io.emit('logs', previousChats);

        res.status(200).send('Message sent successfully');
    } catch (error) {
        console.error('Error saving the message in the database:', error);
        res.status(500).send('Error saving the message');
    }
});

export default router;
