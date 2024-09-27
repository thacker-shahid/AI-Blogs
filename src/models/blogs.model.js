const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    content: {
        type: Object,
        required: true
    },
    coverImg: String,
    category: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Blog = mongoose.model("Blog", blogSchema)

module.exports = Blog