const { MailtrapClient } = require("mailtrap");
require('dotenv').config();

const mailtrapClient = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN,
});

const sender = {
    email: "hello@demomailtrap.com",
    name: "Mailtrap Test",
};

module.exports = {
    mailtrapClient,
    sender,
};