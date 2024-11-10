require('dotenv').config();
const nodemailer = require('nodemailer');

const mailtrapClient = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

const sender = process.env.SENDER_EMAIL;

module.exports = {
    mailtrapClient,
    sender,
};