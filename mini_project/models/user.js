import mongoose from "mongoose";
mongoose.connect('mongodb+srv://sriapurv789:WjeyGYHalgSmux7R@cluster0.mdyjx.mongodb.net/chuche?retryWrites=true&w=majority&appName=Cluster0');
const userSchema = new mongoose.Schema({
    username:String,
    name:String,
    email:String,
    password:String,
    age:Number,
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }]
});
export default mongoose.model('user',userSchema);
