import { initMongoose } from "@/lib/mongoose";
import Post from "@/models/Post";

export default async function handler(req, res) {
  await initMongoose();

  //   if (req.method === "POST") {
  //     const { text } = req.body;
  //     Post.create({
  //       author: 1,
  //       text,
  //     });
  //   }
}
