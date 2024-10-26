const express = require('express');
// const { CURSOR_FLAGS } = require('mongodb');
const router = express.Router();
const Comment = require('../models/comments.model')

//  Create new comment
router.post('/post-comment', async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        if (newComment) {
            await newComment.save();
            res.status(200).send({
                message: "New Comment added successfully!",
                comment: newComment
            });
        }

    } catch (error) {
        console.error("Some error in creating comment", error);
        res.status(500).send({ Message: "Cannot create comment due to some error!" })
    }
})

//  Get all comments count
router.get('/total-comments', async (req, res) => {
    try {
        const totalComments = await Comment.countDocuments({});
        if (totalComments) {
            res.status(200).send({ commentsCount: totalComments });
        } else {
            res.status(404).send({ message: "No comments found!" })
        }
    } catch (error) {
        console.error("Some error in getting total comments", error);
        res.status(500).send({ Message: "Cannot get total comments due to some error!" })
    }
})

// Get all comments 
router.get('/all-comments', async (req, res) => {
    try {
        const allComments = await Comment.find();
        if (allComments) {
            res.status(200).send({ allComments: allComments });
        } else {
            res.status(404).send({ message: "No comments found!" })
        }
    } catch (error) {
        console.error("Some error in getting comments", error);
        res.status(500).send({ Message: "Cannot get comments due to some error!" })
    }
})

// Delete a comment
router.delete('/delete-comment/:id', async (req, res) => {
    try {
        const commentId = req.params.id;
        const commentToDelete = await Comment.findByIdAndDelete(commentId);

        if (!commentToDelete) {
            res.status(404).send({ message: "No comment found with given Id" })
        } else {
            res.status(200).send({
                message: "Comment with given Id deleted successfully!",
                comment: commentToDelete
            })
        }
    } catch (error) {
        console.error("Some error in deleting a comment", error);
        res.status(500).send({ Message: "Cannot delete a comment due to some error!" })
    }
})

module.exports = router;