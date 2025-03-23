import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    profile_pic: { type: String, default: "" }, // pic url
    comments: { type: Array, default: [] },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
