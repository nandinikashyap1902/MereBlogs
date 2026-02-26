const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PostSchema = new Schema({
    title: { type: String, required: true, trim: true, maxlength: 200 },
    summary: { type: String, required: true, trim: true, maxlength: 500 },
    content: { type: String, required: true },
    cover: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

PostSchema.set('timestamps', true);

// Text index for search — indexes title and summary fields
PostSchema.index({ title: 'text', summary: 'text' });

const PostModel = model('Post', PostSchema);
module.exports = PostModel;