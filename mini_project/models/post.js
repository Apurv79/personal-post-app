import mongoose from "mongoose";

;
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    date: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: []
    }],
});
export default mongoose.model('post',postSchema);
