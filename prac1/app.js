import express from 'express';
import mongoose from 'mongoose';
import userModel from './models/user.js';
import postModel from './models/post.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/prac1')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.get('/create', async (req, res) => {
  try {
    const user = await userModel.create({
      username: 'John Doe',
      email: 'xyz@gmail.com',
      posts: [],
      age: 25
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/post/create', async (req, res) => {
  try {
    const post = await postModel.create({
      postdata: 'This is my first post',
      user_id: '67baf07e9a70b088de4201a5',
      date: new Date()
    });

    const user = await userModel.findById('67baf07e9a70b088de4201a5');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.posts.push(post._id);
    await user.save();
    
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;