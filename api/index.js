const express = require('express');
const cors = require('cors')
 const app = express(); 
const mongoURI="mongodb://nandinikashyap:Nkashyap123@cluster0.mxgfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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
app.use(cors({credentials:true,origin:['http://localhost:3000','https://mereblogs1.netlify.app/']}))
app.use(express.json())
const Post = require('./models/Post')
mongoose.connect(mongoURI, {
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
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Basic input validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        // Find user by username
        const userDoc = await User.findOne({ username });
        if (!userDoc) {
            // Don't reveal whether it's the username or password that was incorrect
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Compare password asynchronously to avoid blocking the event loop
        const passOk = await bcrypt.compare(password, userDoc.password);
        if (!passOk) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token securely
        jwt.sign(
            { username, id: userDoc._id },
            secret,// Ensure secret is stored securely in environment variables
            { expiresIn: '1h' }, // Optional expiration time for the token
            (err, token) => {
                if (err) {
                    console.error('JWT signing error:', err);
                    return res.status(500).json({ message: 'Authentication failed. Please try again.' });
                }
                
                // Send token as a cookie and response with user info
                res.cookie('token', token, { httpOnly: true, })
                   .json({ id: userDoc._id, username });
            }
        );
    } catch (err) {
        // Log the error and respond with a generic error message
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
});

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

 // Ensure your secret is securely stored

function authMiddleware(req, res, next) {
  const token = req.cookies.token;  // Retrieve the token from the cookies

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access. No token provided.' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, secret); // Ensure you're using the same `secret`

    // Attach user info to the request object (e.g., user ID)
    req.user = decoded;
    next(); // Continue to the next middleware/route handler
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Token is invalid or expired.' });
  }
}


    app.get('/post',authMiddleware, async (req, res) => {
        
        const posts = await Post.find({ author: req.user.id })
            .populate('author', ['username'])
            .sort({ createdAt: -1 }).limit(20);
       
            res.json(posts);
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
// function authenticateToken(req, res, next) {
//     const  token  = req.cookies.token;
// console.log(token)
//     if (!token) return res.status(401).json({ message: 'Token is required' });
    
//     jwt.verify(token, secret, (err, user) => {
//         if (err) return res.status(403).json({ message: 'Invalid token' });
//         req.user = user;
//         next();
//     });
// }
app.delete('/post/:id', authMiddleware,async (req, res) => { 
    try {
        const { id } = req.params; // Get post ID from URL params
console.log('id:',id)
        // Find the post by ID
        const postDoc = await Post.findById(id);

        if (!postDoc) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Check if the authenticated user is the author of the post
        if (postDoc.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You are not allowed to delete this post.' });
        }

        // If everything is good, delete the post
        await Post.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
})
app.listen(4000)