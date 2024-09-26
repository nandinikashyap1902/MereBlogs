const express = require('express');
const cors = require('cors')
const app = express();

const mongoose = require("mongoose")
const User = require('./models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = "nkuyguy76t68yihiuh8999ybyf"
const multer = require('multer')
const uploadMiddleware = multer({dest:'uploads/'})
const fs = require('fs')
const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use('/uploads',express.static(__dirname + '/uploads'))
app.use(cors({credentials:true,origin:'http://localhost:3000'}))
app.use(express.json())
const Post = require('./models/Post')
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
         res.cookie('token',token).json({id:userDoc._id,username})
        })
    } else {
        res.status(400).json('wrong credentials')
    }
})

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    
    // Check if token exists in the cookies
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
     // Verify the token
    jwt.verify(token, secret, {}, (err,info) => {
        if (err) {
            return res.status(403).json({ error: 'Token is invalid or expired' });

        }
        // Return the decoded token information (usually user profile data)
        res.json(info);
    })
}) 

    app.post('/logout', (req, res) => {
        res.cookie('token','').json('ok')
    })

    app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
       
        const { originalname, path } = req.file
         //console.log(path)
        const parts = originalname.split('.')
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext
        fs.renameSync(path, newPath)
        const coverPath = newPath.replace(/\\/g, '/');
//console.log(coverPath)
        const { token } = req.cookies;
        jwt.verify(token, secret, {}, async(err,info) => {
            if (err) throw err;
            const { title, summary, content} = req.body;
            const postDoc = await Post.create({
                title,
                summary,
                content,
                cover: coverPath,
                author:info.id
            })
            res.json(postDoc)
        })

       
    })
    app.get('/post', async (req, res) => {
        
        res.json(await Post.find()
            .populate('author', ['username'])
         .sort({createdAt:-1}).limit(20))
    })

app.get('/post/:id', async (req, res) => {
    const { id } = req.params
    postDoc = await Post.findById(id).populate('author',['username'])
    res.json(postDoc)
})
    
app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file
        const parts = originalname.split('.')
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext
        fs.renameSync(path, newPath)
    }
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id)
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if(!isAuthor){
            return res.status(400).json('you are not the author')
        }
         // Update post fields and save the document
         postDoc.title = title;
         postDoc.summary = summary;
         postDoc.content = content;
         postDoc.cover = newPath ? newPath : postDoc.cover;
         
         // Save the updated document
         await postDoc.save();
        res.json(postDoc)
    })
})
app.listen(4000)