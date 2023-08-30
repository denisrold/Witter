import { initMongoose } from "@/lib/mongoose";
import Like from "@/models/Like";

export default async function handle(req, res) {
  initMongoose();
  const postId = req.body.id;
  const userId = req.body.userId;
  const existingLike = await Like.findOne({ author: userId, post: postId });
  if (existingLike) {
    await existingLike.remove();
    res.json(null);
  } else {
    const like = await Like.create({ author: userId, post: postId });
    res.json({ like });
  }
  res.json({ postId, userId });
}
