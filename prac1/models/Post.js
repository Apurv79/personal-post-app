import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    postdata: {
        type: String,
        required: true,
        trim: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,   
        ref: "User",
        required: true
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
   
});

const Post = mongoose.model("Post", postSchema);
export default Post;