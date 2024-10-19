const express = require('express')
const router = express.Router();
const Blog = require('../models/blogs.model')
const Comment = require('../models/comments.model')
const verifyToken = require('../middleware/verifyToken') 
const isAdmin = require('../middleware/isAdmin') 

const { createProxyMiddleware } = require("http-proxy-middleware");

// Create a Post
// router.post('/create-post', verifyToken, isAdmin, async (req, res)=>{
router.post('/create-post', async (req, res)=>{
    try{
        // const newPost = new Blog({...req.body, author: req.userId})
        const newPost = new Blog({...req.body})
        await newPost.save();
        res.status(201).send({
            message: "Post created successfully",
            post: newPost
        })
    } catch (error){
        console.error("Some error in creating post", error);
        res.status(500).send({Message: "Cannot create post due to some error!"})
    }
});

// Get all blogs
router.get('/', async (req, res) => {
    try{
        let query = {};
        const {search, category, location} = req.query;

        if(search){
            query = {
                ...query,
                $or: [
                    {title: {$regex: search, $options: "i"}},
                    {content: {$regex: search, $options: "i"}}
                ]
            }
        }

        if(category){
            query = {
                ...query,
                category
            }
        }

        if(location){
            query = {
                ...query,
                location
            }
        }

        const posts = await Blog.find(query).populate('author', 'email').sort({createdAt: -1});
        res.status(200).send(posts) 
    } catch(error){
        console.error("Some error in fetching posts", error);
        res.status(500).send({Message: "Cannot fetch posts due to some errors!"})
    }
})

// Get a single post by id
router.get('/:id', async (req, res)=>{
    
    try{
        const postId = req.params.id;
        const postwithId = await Blog.findById(postId);

        
        const comments = await Comment.find({postId}).populate('user', 'username email');
        if(!postwithId){
            res.status(404).send({message: "No post found with given Id"})
        } else {
            res.status(200).send({
                // postwithId, comments
                message: "Post with given Id found successfully!",
                post: postwithId,
                comments: comments
            })
            return
        }
    } catch(error){
        console.error("Some error in fetching single post by id", error);
        res.status(500).send({Message: "Cannot fetch single post by id due to some errors!"})
    }
})

// Update the post with id
// router.patch('/update-post/:id',verifyToken, async (req, res) => {
router.patch('/update-post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const updatedPost = req.body;
 
        const postToUpdate = await Blog.findByIdAndUpdate(postId, updatedPost, { new: true }); 
 
        if (!postToUpdate) { 
            res.status(404).send({ message: "No post found with given Id" }); 
        } else { 
            res.status(200).send({ 
                message: "Post updated successfully!", 
                post: postToUpdate 
            }); 
        } 
    } catch (error) {
        console.error("Some error in updating single post by id", error); 
        res.status(500).send({ Message: "Cannot update single post by id due to some errors!" });
    }
})

// Delete a single post
// router.delete('/:id',verifyToken, async (req, res)=>{
router.delete('/:id', async (req, res)=>{
    try{
        const postId = req.params.id;
        const postToDelete = await Blog.findByIdAndDelete(postId);
        
        if(!postToDelete){
            res.status(404).send({message: "No post found with given Id"})
        } else {
            res.status(200).send({
                message: "Post with given Id deleted successfully!",
                post: postToDelete
            })
        }
        // Delete related Comments
        await  Comment.deleteMany({postId: postId});

    } catch(error){
        console.error("Some error in deleting single post by id", error);
        res.status(500).send({Message: "Cannot delete single post by id due to some errors!"})
    }
});

// Related Posts
router.get('/related/:id', async(req, res) => {
    try {
        const id = req.params.id;

        if(!id) {
            return res.status(404).send({Message: "Post id is required"});
        }

        const currentPost = await Blog.findById(id);

        if(!currentPost){
            res.status(404).send({message: "No post found with given Id"})
        }

        const titleRegex = new RegExp(currentPost.title.split(" ").join("|"), "i");
        // const contentRegex = new RegExp(currentPost.content.split(" ").join("|"), "i");

        const relatedPosts = await Blog.find({ 
            _id: {$ne: id}, //Exclude the currentPost
            title: {$regex: titleRegex},
            // content: {$regex: contentRegex}
        })

        if(relatedPosts){
            res.status(200).send(relatedPosts)
            return;
        } else {
            res.status(404).send({message: "No related posts found!"})
        }

    } catch(error){
        console.error("Some error in fetching related posts", error);
        res.status(500).send({Message: "Cannot fetch related posts due to some errors!"})
    }
})

module.exports = router;