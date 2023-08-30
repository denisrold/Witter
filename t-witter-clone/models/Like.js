import mongoose, { model, models, Schema } from "mongoose";
import User from "./users";
import Post from "./Post";

const LikeSchema = new Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: User },
    post: { type: mongoose.Types.ObjectId, ref: Post },
  },
  { timestamp: true }
);

const Like = models?.Like || model("Like", LikeSchema);

export default Like;
