const express = require('express');
const cors = require('cors')
const app = express();
const mongoose = require("mongoose")
const User = require('./models/User')
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb://localhost:27017/User",{
}).then(() => {
    console.log('MongoDB connection established successfully.');
})
.catch((error) => {
    console.error('MongoDB connection failed:', error);
});

app.post('/register', (req, res) => {
    const { username, password } = req.body
    const userDoc = User.create({username,password})
    // res.json({requestData:{username,password}})
     res.json(userDoc)
})

app.listen(4000)