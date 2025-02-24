import express from 'express';
import userModel from './models/user.js';
import postModel from './models/post.js';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import post from './models/post.js';
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});
app.get('/', (req, res) => {
 res.render('index');
}); 
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/profile', isloggedin, async (req, res) => {
    try {
       
        
        let user = await userModel.findOne({email: req.user.email}).populate('posts');
       
        console.log('User from database:', user); // Debug database result
        
        if (!user) {
            return res.redirect('/login');
        }
        
        res.render('profile', { user });
    } catch (error) {
        console.error('Profile error:', error);
        res.redirect('/login');
    }
});

app.get('/like/:id', isloggedin, async (req, res) => {
    try {
        let post = await postModel.findById(req.params.id);
        
        const index = post.likes.indexOf(req.user.userid);
        if (index === -1) {
            // User hasn't liked - add like
            post.likes.push(req.user.userid);
        } else {
            // User already liked - remove like
            post.likes.splice(index, 1);
        }
        
        await post.save();
        res.redirect('/profile');
    } catch (error) {
        console.error('Like error:', error);
        res.redirect('/profile');
    }
});


app.get('/edit/:id', isloggedin, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        
        if (!post) {
            return res.redirect('/profile');
        }

        res.render('edit', { post });
    } catch (error) {
        console.error('Edit error:', error);
        res.redirect('/profile');
    }
});

app.post('/post/edit/:id', isloggedin, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        
        if (!post) {
            return res.redirect('/profile');
        }

        post.content = req.body.content;
        await post.save();
        
        res.redirect('/profile');
    } catch (error) {
        console.error('Update error:', error);
        res.redirect('/profile');
    }
});

app.post('/update/:id', isloggedin, async (req, res) => {
    try {
        const post = await postModel.findByIdAndUpdate(
            req.params.id,
            { 
                content: req.body.content,
                date: new Date()  // Update timestamp
            },
            { 
                new: true,  // Return updated document
                runValidators: true // Run schema validations
            }
        );

        if (!post) {
            return res.redirect('/profile');
        }

        res.redirect('/profile');
    } catch (error) {
        console.error('Update error:', error);
        res.redirect('/profile');
    }
});


app.post('/register', async (req, res) => {
    try {
        const {username, name, email, password, age} = req.body;
        
        // Check if user exists
        const existingUser = await userModel.findOne({email});
        if(existingUser) {
            return res.render('login');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user
        const user = await userModel.create({
            username,
            name,
            email,
            password: hashedPassword,
            age
        });

        // Generate token and set cookie
        const token = jwt.sign(
            { email: user.email, userid: user._id }, 
            "hehehe",
            { expiresIn: '24h' }
        );
        
        res.cookie('token', token);
        return res.redirect('/profile');

    } catch (error) {
        console.error('Registration error:', error);
        return res.redirect('/');
    }
});
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).populate('posts');
        
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            return res.status(401).send("Invalid Password");
        }

        const token = jwt.sign(
            { email: user.email, userid: user._id },
            "hehehe",
            { expiresIn: '24h' }
        );

        res.cookie('token', token);
        res.render('profile', { user });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send("Login failed");
    }
});

app.post('/post', isloggedin, async (req, res) => {
  let user =await userModel.findOne({email:req.user.email});
 let post = await postModel.create({
    user : user._id,
    content : req.body.content,
  
  });
 user.posts.push(post._id);
 await user.save();
 res.redirect('profile')
}); 
app.get('/delete/:id', isloggedin, async (req, res) => {
    try {
        const post = await postModel.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.redirect('/profile');
        }
        res.redirect('/profile');
    } catch (error) {
        console.error('Delete error:', error);
        res.redirect('/profile');
    }
});
 

function isloggedin(req, res, next) {
    let token = req.cookies.token;
    if (!token) {
        return res.render('login');
    }
    try {
        let data = jwt.verify(token, "hehehe");
        req.user = data;
        next();
    } catch (err) {
        return res.status(401).send("Invalid token");
    }
}




export default isloggedin;

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
module.exports = app;

//