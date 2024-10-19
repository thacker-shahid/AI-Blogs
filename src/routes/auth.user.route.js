const express = require('express');
const router = express.Router();
const User = require('../models/user.model')
const generateToken = require('../middleware/generateToken');
// const session = require('express-session');

// Register a new user
router.post('/register', async(req, res)=>{
    try{
        const {username, password, email} = req.body;
        const user = new User({username, password, email});

        if(user){
                await user.save();
                res.status(201).send({ message: 'User registered successfully!', user: user });
        } else{
            res.status(400).send({ message: 'Invalid user data!' });
        }
    } catch(error){
        console.error('Error registering new user', error);
        res.status(500).send({ message: 'Cannot register new user due to some errors!' });
    }
});


// Login a user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        
        if(!user) 
            return res.status(404).send({ message: 'User not found!'});

        const isMatch = await user.comparePassword(password);
        
        if(!isMatch) 
            return res.status(401).send({ message: 'Invalid username or password!' });
        

        // Generate and send JWT token
        const token = await generateToken(user._id);
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        })
        // req.session.token = token;
        // console.log('Cookie set: ', token);
        // localStorage.setItem('token', token)

        res.send({ message: 'Logged in successfully!', token, user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        }});

    } catch(error){
        console.error('Error logging in user', error);
        res.status(500).send({ message: 'Cannot login user due to some errors!' });
    }
});

// Logout a user
router.post('/logout', async (req, res)=> {
    try {
        res.clearCookie('token');
        res.status(200).send({ message: 'Logged out successfully!' });
    } catch(error){
        console.error('Error logging out user', error);
        res.status(500).send({ message: 'Cannot logout user due to some errors!' });
    }
});

// Get all users
router.get('/users', async (req, res)=> {  
    try {
    
        const users = await User.find({}, 'id email role');
        res.status(200).send({message: "Users found successfully!", users });

    } catch(error){
        console.error('Error getting users', error);
        res.status(500).send({ message: 'Cannot get users due to some errors!' });
    }
});

// Delete a user
router.delete('/users/:id', async (req, res)=> {
    try{
        const id = req.params.id;
        const userToDelete = await User.findByIdAndDelete(id);
        if(!userToDelete){
            res.status(404).send({ message: "No user found with given Id"})
        }
        res.status(200).send({ message: "User with given Id deleted successfully!"})

    } catch(error){
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
        if(!user){
            res.status(404).send({ message: "No user found with given Id"})
        }
        res.status(200).send({ message: "User role updated successfully!", user });

    } catch(error) {
        console.error('Error updating user role', error);
        res.status(500).send({ message: 'Cannot update user role due to some errors!' });
    }
});

module.exports = router;