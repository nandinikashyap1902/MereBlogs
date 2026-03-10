const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema(
    {
        post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
    },
    { timestamps: true }
);

// Index for fast lookup of all comments belonging to a post
commentSchema.index({ post: 1, createdAt: -1 });

module.exports = model('Comment', commentSchema);
