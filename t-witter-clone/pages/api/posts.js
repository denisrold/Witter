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
      const parent = req.query.parent || null;
      const author = req.query.author.split("AND")[0];
      const userId = req.query.author.split("AND")[1];
      console.log(userId);

      const searchFilter = author ? { author } : { parent };
      const posts = await Post.find(searchFilter)
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
    const post = await Post.create({
      author: userId,
      text,
      parent,
    });

    if (parent) {
      const parentPost = await Post.findById(parent);
      parentPost.commentsCount = await Post.countDocuments({ parent });
      await parentPost.save();
    }

    res.json(post);
  }
}
