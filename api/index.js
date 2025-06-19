const express = require('express');
const cors = require('cors')
const app = express(); 
const mongoURI="mongodb+srv://nandinikashyap:cmR4Xn6Rw9U6HcV0@cluster0.mxgfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const mongoose = require("mongoose")
const User = require('./models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = "nkuyguy76t68yihiuh8999ybyf"
const crypto = require('crypto'); // For generating reset tokens
const nodemailer = require('nodemailer'); // For sending emails

const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.set('trust proxy', 1);

const fs = require('fs')
const multer = require('multer')
const uploadMiddleware = multer({dest:'uploads/'})
app.use('/uploads', express.static(__dirname + '/uploads'))

require('dotenv').config();
const corsOptions = {
   origin: ['https://mereblogs.netlify.app','http://localhost:3000'], // Allow this origin, // Allow this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies if needed
  };
app.use(cors(corsOptions))
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.json())
const Post = require('./models/Post')

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

mongoose.connect(mongoURI, {
}).then(() => {
    console.log('MongoDB connection established successfully.');
})
.catch((error) => {
    console.error('MongoDB connection failed:', error);
});

// Regular email and password registration
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const userDoc = await User.create({
            username,
            email,
            password: hashedPassword
        })
    
        res.json(userDoc)
    } catch (e) {
        res.status(400).json(e)
    }
})

// Google authentication
app.post('/auth/google', async (req, res) => {
    const { idToken, email, name, imageUrl } = req.body;
    
    try {
        console.log('Google auth request:', { email, name });
        
        // In a real implementation, we'd verify the idToken with Google
        // For now, we'll trust the client-side verification and just use the data

        // Check if user exists by email field
        let userDoc = await User.findOne({ email });
        console.log('User lookup result by email field:', userDoc ? 'User found' : 'No user found');
        
        if (!userDoc) {
            // If not found by email field, try by username (for users who registered with email as username)
            userDoc = await User.findOne({ username: email });
            console.log('User lookup result by username field:', userDoc ? 'User found' : 'No user found');
            
            // If still not found, try case-insensitive search as fallback
            if (!userDoc) {
                userDoc = await User.findOne({ 
                    $or: [
                        { email: { $regex: new RegExp('^' + email + '$', 'i') }},
                        { username: { $regex: new RegExp('^' + email + '$', 'i') }}
                    ]
                });
                console.log('Case-insensitive lookup result:', userDoc ? 'User found' : 'No user found');
            }
            
            if (!userDoc) {
                // User doesn't exist, return error
                return res.status(401).json({ 
                    error: "account_not_found", 
                    message: "No account found with this email. Please sign up first."
                });
            }
        }
        
        // If found user doesn't have an email field, update it
        if (!userDoc.email && email) {
            userDoc.email = email;
            await userDoc.save();
            console.log('Updated user with missing email field');
        }

        // Link Google account to existing email account if not already linked
        if (!userDoc.googleId) {
            userDoc.googleId = idToken.sub || 'google-' + Date.now();
            userDoc.profilePicture = imageUrl || userDoc.profilePicture;
            await userDoc.save();
        }

        // Generate JWT
        jwt.sign(
            { username: userDoc.username, id: userDoc._id },
            secret,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error('JWT signing error:', err);
                    return res.status(500).json({ message: 'Authentication failed. Please try again.' });
                }
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    maxAge: 3600000,
                    path: '/',
                })
                .json({ 
                    id: userDoc._id, 
                    username: userDoc.username,
                    email: userDoc.email,
                    profilePicture: userDoc.profilePicture
                });
            }
        );
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ message: 'Authentication failed. Please try again.' });
    }
});

// Forgot password - request reset
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            // Don't reveal if email exists for security purposes
            return res.json({ message: 'If your email is in our system, you will receive a password reset link.' });
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour
        
        // Save token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();
        
        // Create reset URL
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
        
        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER || 'nandinikashyap1902@gmail.com',
            to: user.email,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) requested a password reset for your account.\n\n
                Please click on the following link, or paste it into your browser to complete the process:\n\n
                ${resetUrl}\n\n
                If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };
        
        await transporter.sendMail(mailOptions);
        
        res.json({ message: 'If your email is in our system, you will receive a password reset link.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'There was an error. Please try again later.' });
    }
});

// Verify reset token
app.get('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }
        
        res.json({ message: 'Token is valid', username: user.username });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ message: 'There was an error. Please try again later.' });
    }
});

// Reset password
app.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        
        const user = await User.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }
        
        // Hash new password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        
        // Update user
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        
        res.json({ message: 'Your password has been updated.' });
        
        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: user.email,
            subject: 'Your password has been changed',
            text: `This is a confirmation that the password for your account ${user.email} has just been changed.\n`
        };
        
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ message: 'There was an error. Please try again later.' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }
        const userDoc = await User.findOne({ username });
        if (!userDoc) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const passOk = await bcrypt.compare(password, userDoc.password);
        if (!passOk) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        jwt.sign(
            { username, id: userDoc._id },secret,{ expiresIn: '1h' },(err, token) => {
                if (err) {
                    console.error('JWT signing error:', err);
                    return res.status(500).json({ message: 'Authentication failed. Please try again.' });
                }
                res.cookie('token', token, {
                    httpOnly: true,  // JavaScript can't access the cookie
                    secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production (HTTPS)
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',  // Adjust SameSite attribute
                    maxAge: 3600000 , // Cookie valid for 1 hour
                    path: '/',
                })
                   .json({ id: userDoc._id, username }); });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    jwt.verify(token, secret, (err,info) => {
        if (err) {
            return res.status(403).json({ error: 'Token is invalid or expired' })
        }
        res.json(info);
        
    })
}) 

    app.post('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
              return res.status(500).json({ message: 'Could not log out' });
            }
            res.clearCookie('token' ,{
                path: '/', 
                httpOnly: true,  // JavaScript can't access the cookie
                secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production (HTTPS)
                sameSite: 'none',  // Adjust SameSite attribute
                domain:
               "mereblogs.onrender.com"
            });
            res.set('Cache-Control', 'no-store');
    
    // Send response
    res.status(200).json({ message: 'Logged out successfully' });
          });
    })

    app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
       
        const { originalname, path } = req.file
         console.log(req.file)
        const parts = originalname.split('.')
        const ext = parts[parts.length - 1];
        // const newPath = path + '.' + ext
        const newPath = `uploads/${path.split('/').pop()}.${ext}`;
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