const express = require('express');
const cors = require('cors')
const app = express();

const mongoose = require("mongoose")
const User = require('./models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = "nkuyguy76t68yihiuh8999ybyf"

const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(cors({credentials:true,origin:'http://localhost:3000'}))
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
    const userDoc = await User.findOne({ username })
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if (passOk) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err,token) => {
            if (err) throw err
         res.cookie('token',token).json('oK')
        })
    } else {
        res.status(400).json('wrong credentials')
    }
})

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
        if (err) throw err;
        res.json(info)
    })
    
    
})
app.listen(4000)