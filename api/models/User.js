const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Array of post IDs the user has bookmarked — default [] handles existing users
    savedPosts: { type: [{ type: Schema.Types.ObjectId, ref: 'Post' }], default: [] },
});

const UserModel = model('User', userSchema);
module.exports = UserModel;