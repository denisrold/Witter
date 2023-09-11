import { initMongoose } from "@/lib/mongoose";
import Post from "../../models/Post";
import Like from "@/models/Like";

export default async function handler(req, res) {
  await initMongoose();

  if (req.method === "GET") {
    let userId = "";
    if (req.query.userId != "undefined") {
      userId = req.query.userId;
    }
    const postId = req?.query?.postId;

    const post = await Post.findById(postId)
      .populate("author")
      .populate({
        path: "parent",
        populate: "author",
      })
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();

    const postLikedByMe = await Like.find({
      author: userId,
    });

    const idsLikedByMe = postLikedByMe.map((like) => like.post);
    console.log(idsLikedByMe);
    res.json({ post, idsLikedByMe });
  }
}
