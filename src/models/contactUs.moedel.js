const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactUsSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports = ContactUs;