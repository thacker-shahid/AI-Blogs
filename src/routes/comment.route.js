const express = require('express');
const { CURSOR_FLAGS } = require('mongodb');
const router = express.Router();
const Comment = require('../models/comments.model')

//  Create new comment
router.post('/post-comment', async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        if(newComment){
            await newComment.save();
            res.status(200).send({ 
                message: "New Comment added successfully!", 
                comment: newComment 
            });
        }

    } catch (error) {
        console.error("Some error in creating comment", error);
        res.status(500).send({Message: "Cannot create comment due to some error!"})
    }
})

//  Get all comments count
router.get('/total-comments', async (req, res)=> {
    try {
        const totalComments = await Comment.countDocuments({});
        if(totalComments){
            res.status(200).send({ commentsCount: totalComments });
        } else{
            res.status(404).send({message: "No comments found!"})
        }
    } catch(error){
        console.error("Some error in getting total comments", error);
        res.status(500).send({Message: "Cannot get total comments due to some error!"})
    }
})

module.exports = router;