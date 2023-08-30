import { initMongoose } from "@/lib/mongoose";
import Like from "@/models/Like";
import Post from "@/models/Post";

async function updateLikesCount(postId) {
  const post = await await Post.findByIdAndUpdate(
    postId,
    { $inc: { likesCount: 1 } },
    { new: true }
  );
  post.likesCount = await Like.countDocuments({ post: postId });
  await post.save();
}

export default async function handle(req, res) {
  initMongoose();
  const postId = req.body.id;
  const userId = req.body.userId;
  const existingLike = await Like.findOne({ author: userId, post: postId });
  if (existingLike) {
    await existingLike.remove();
    await updateLikesCount(postId);
    res.json(null);
  } else {
    const like = await Like.create({ author: userId, post: postId });
    await updateLikesCount(postId);
    res.json({ like });
  }
}
