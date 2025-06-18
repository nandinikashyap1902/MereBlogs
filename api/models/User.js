const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: function() {
        // Password only required for regular accounts, not Google accounts
        return !this.googleId;
    }},
    googleId: { type: String, unique: true, sparse: true },
    profilePicture: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
})

const UserModel = model('User', userSchema)
module.exports = UserModel