const express = require('express');
const router = express.Router();
const ContactUs = require('../models/contactUs.moedel');
const { sendContactUsEmail } = require('../mailtrap/emails');

// Function to post a contact 
router.post('/', async (req, res) => {

    const { name, email, message } = req.body;
    try {
        if (!name || !email || !message) {
            throw new Error('All fields are required');
        }
        const newContactUs = new ContactUs({ name, email, message });
        await newContactUs.save();
        await sendContactUsEmail(name, email, message);
        res.status(201).json({ message: 'Contact request submitted successfully' });
        // return;
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }

});

module.exports = router;