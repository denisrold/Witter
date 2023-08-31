import { initMongoose } from "@/lib/mongoose";
import Post from "../../models/Post";
import Like from "@/models/Like";

export default async function handler(req, res) {
  await initMongoose();
  if (req.method === "GET") {
    const id = req.query.id;
    let userId = "";

    if (req.query.userId != "undefined") {
      userId = req.query.userId;
    }

    if (id) {
      const post = await Post.findById(id).populate("author");

      res.json(post);
    } else {
      const posts = await Post.find()
        .populate("author")
        .sort({ createdAt: -1 })
        .limit(20)
        .exec();

      const postIds = posts.map((p) => p._id);
      const postLikedByMe = await Like.find({
        author: userId,
        post: { $in: postIds },
      });

      const idsLikedByMe = postLikedByMe.map((like) => like.post);
      res.json({ posts, idsLikedByMe });
    }
  }

  if (req.method === "POST") {
    const { text, parent, userId } = req.body;
    console.log(parent);
    const post = await Post.create({
      author: userId,
      text,
      parent,
    });
    res.json(post);
  }
}
