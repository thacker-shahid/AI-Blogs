const { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } = require('./emailTemplates.js');
const { mailtrapClient, sender } = require('./mailtrap.config.js');

const sendVerificationEmail = async (email, verificationToken) => {

    try {
        const receiver = {
            from: sender,
            to: email,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        };

        mailtrapClient.sendMail(receiver, (error, emailResponse) => {
            if (error)
                throw error;
            console.log("Email Verifcation email sent successfully", emailResponse);
            response.end();
        });

    } catch (error) {
        console.error(`Error sending verification`, error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};

const sendWelcomeEmail = async (email, name) => {

    try {
        const receiver = {
            from: sender,
            to: email,
            subject: "Welcome to Technical Blogs",
            html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
            category: "Welcome",
        };

        mailtrapClient.sendMail(receiver, (error, emailResponse) => {
            if (error)
                throw error;
            console.log("Welcome email sent successfully", emailResponse);
            response.end();
        });

    } catch (error) {
        console.error(`Error sending welcome email`, error);
        throw new Error(`Error sending welcome email: ${error}`);
    }
};

const sendPasswordResetEmail = async (email, resetURL) => {

    try {
        const receiver = {
            from: sender,
            to: email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        };

        mailtrapClient.sendMail(receiver, (error, emailResponse) => {
            if (error)
                throw error;
            console.log("Password Reset email sent successfully", emailResponse);
            response.end();
        });

    } catch (error) {
        console.error(`Error sending password reset email`, error);

        throw new Error(`Error sending password reset email: ${error}`);
    }
};

const sendResetSuccessEmail = async (email) => {

    try {
        const receiver = {
            from: sender,
            to: email,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset",
        };

        mailtrapClient.sendMail(receiver, (error, emailResponse) => {
            if (error)
                throw error;
            console.log("Contact Us email sent successfully", emailResponse);
            response.end();
        });

    } catch (error) {
        console.error(`Error sending password reset success email`, error);
        throw new Error(`Error sending password reset success email: ${error}`);
    }
};

const sendContactUsEmail = async (name, email, message) => {

    try {
        const receiver = {
            from: process.env.SENDER_EMAIL,
            to: process.env.SENDER_EMAIL,
            subject: "Contact Us form",
            category: "Contact Us",
            html: `
                <!DOCTYPE html>
                    <html lang="en">
                    <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Contact Us</title>
                    </head>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">Contact Us</h1>
                    </div>
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <p>Hello,</p>
                        <p>Someone tried to contact you. Below are the details of person: </p>
                        <div style="margin: 30px 0;">
                        <div style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-bottom: 10px;">Name: ${name}
                        </div>
                        
                        <div style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-bottom: 10px;">Email: ${email}
                        </div>
                        
                        <div style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-bottom: 10px;">Message: ${message}
                        </div>
                        
                        </div>
                        <p>Best regards,<br>Your App Team</p>
                    </div>
                    <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
                        <p>This is an automated message, please do not reply to this email.</p>
                    </div>
                    </body>
                    </html>
                `,
        };

        mailtrapClient.sendMail(receiver, (error, emailResponse) => {
            if (error)
                throw error;
            console.log("Contact Us email sent successfully", emailResponse);
            response.end();
        });

    } catch (error) {
        console.error(`Error sending contact us`, error);
        throw new Error(`Error sending contact us: ${error}`);
    }
};

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail,
    sendContactUsEmail
};