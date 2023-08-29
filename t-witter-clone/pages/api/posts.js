import { initMongoose } from "@/lib/mongoose";
import Post from "@/models/Post";

export default async function handler(req, res) {
  await initMongoose();
  if (req.method === "GET") {
    res.json(await Post.find().sort({ createdAt: -1 }).exec());
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
