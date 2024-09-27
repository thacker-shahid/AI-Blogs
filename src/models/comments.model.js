const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({

    comment:{
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId:{
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;