import { initMongoose } from "@/lib/mongoose";
import Post from "../../models/Post";

export default async function handler(req, res) {
  await initMongoose();
  if (req.method === "GET") {
    const { id } = req.query;
    if (id) {
      const post = await Post.findById(id).populate("author");
      res.json(post);
      //   const post = await Post.findById(id).populate("author");
      //   res.json({ post });
    } else {
      const posts = await Post.find()
        .populate("author")
        .sort({ createdAt: -1 })
        .exec();
      res.json(posts);
    }
  }

  if (req.method === "POST") {
    const { text } = req.body;
    const { userId } = req.body;

    const post = await Post.create({
      author: userId,
      text,
    });
    res.json(post);
  }
}
