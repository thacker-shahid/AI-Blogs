const express = require('express');
const router = express.Router();
const User = require('../models/user.model')
const generateTokenAndSetCookie = require('../middleware/generateTokenAndSetCookie');
const { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require('../mailtrap/emails');
// const session = require('express-session');
require('dotenv').config();
const crypto = require("crypto");
const bcryptjs = require("bcryptjs");

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        if (!email || !password || !username) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({ email });

        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            username,
            password,
            email,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });

        // if (user) {
        await user.save();
        generateTokenAndSetCookie(res, user._id);
        await sendVerificationEmail(user.email, verificationToken);
        res.status(201).send({ message: 'User registered successfully!', user: user });
        // } else {
        //     return res.status(400).send({ message: 'Invalid user data!' });
        // }
    } catch (error) {
        console.error('Error registering new user', error);
        return res.status(500).send({ message: 'Cannot register new user due to some errors!' });
    }
});

// Verify Email.
router.post('/verify-email', async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.username);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: user
        });
    } catch (error) {
        console.log("error in verifyEmail ", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(404).send({ message: 'User not found!' });

        const isMatch = await user.comparePassword(password, user.password);

        if (!isMatch)
            return res.status(401).send({ message: 'Invalid username or password!' });


        // Generate and send JWT token
        // const token = await generateTokenAndSetCookie(res, user._id);
        const token = await generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'None'
        // })
        // req.session.token = token;
        // console.log('Cookie set: ', token);
        // localStorage.setItem('token', token)

        res.send({
            message: 'Logged in successfully!', token, user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.error('Error logging in user', error);
        res.status(500).send({ message: 'Cannot login user due to some errors!' });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        console.log("Error in forgotPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        // update password
        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Logout a user
router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).send({ message: 'Logged out successfully!' });
    } catch (error) {
        console.error('Error logging out user', error);
        res.status(500).send({ message: 'Cannot logout user due to some errors!' });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {

        const users = await User.find({}, 'id email role');
        res.status(200).send({ message: "Users found successfully!", users });

    } catch (error) {
        console.error('Error getting users', error);
        res.status(500).send({ message: 'Cannot get users due to some errors!' });
    }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userToDelete = await User.findByIdAndDelete(id);
        if (!userToDelete) {
            res.status(404).send({ message: "No user found with given Id" })
        }
        res.status(200).send({ message: "User with given Id deleted successfully!" })

    } catch (error) {
        console.error('Error deleting user', error);
        res.status(500).send({ message: 'Cannot delete user due to some errors!' });
    }
})

// Update users role
router.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedRole = req.body.role;
        const user = await User.findByIdAndUpdate(userId, { role: updatedRole }, { new: true });
        if (!user) {
            res.status(404).send({ message: "No user found with given Id" })
        }
        res.status(200).send({ message: "User role updated successfully!", user });

    } catch (error) {
        console.error('Error updating user role', error);
        res.status(500).send({ message: 'Cannot update user role due to some errors!' });
    }
});

module.exports = router;