const express = require('express');
const cors = require('cors')
const app = express();

const mongoose = require("mongoose")
const User = require('./models/User')
const bcrypt = require('bcrypt')

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
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const userDoc = User.create({
            username,
            password: hashedPassword
        })
    
    // res.json({requestData:{username,password}})
     res.json(userDoc)
    } catch (e) {
        console.log(e)
    res.status(400).json(e)
}
})
app.post('/login',async (req, res) => {
    const { username, password } = req.body;
    // console.log({ username, password })
    const userDoc = await User.findOne({ username })
    //console.log(userDoc.password)
    const passOk = bcrypt.compareSync(password, userDoc.password)
    console.log(passOk)
    res.json(passOk)
})
app.listen(4000)