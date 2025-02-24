import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    posts: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post' 
    }],
    age: {
        type: Number,
        min: 0
    }
} );

const User = mongoose.model("User", userSchema);
export default User;