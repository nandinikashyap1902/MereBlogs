const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PostSchema = new Schema({
    title: { type: String, required: true, trim: true, maxlength: 200 },
    summary: { type: String, required: true, trim: true, maxlength: 500 },
    content: { type: String, required: true },
    cover: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // ─── Engagement fields ────────────────────────────────────────────────
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],       // array of user IDs who liked
    views: { type: Number, default: 0, min: 0 },                 // total view count
});

PostSchema.set('timestamps', true);

// Text index for search — indexes title and summary fields
PostSchema.index({ title: 'text', summary: 'text' });

// Virtual field: like count
PostSchema.virtual('likeCount').get(function () {
    return this.likes ? this.likes.length : 0;
});

// Ensure virtuals show in JSON and Object output
PostSchema.set('toJSON', { virtuals: true });
PostSchema.set('toObject', { virtuals: true });

const PostModel = model('Post', PostSchema);
module.exports = PostModel;