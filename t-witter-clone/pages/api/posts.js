import { initMongoose } from "@/lib/mongoose";
import Post from "../../models/Post";
import Like from "@/models/Like";
import Follower from "@/models/Follower";

export default async function handler(req, res) {
  await initMongoose();
  if (req.method === "GET") {
    const id = req.query.id;
    let userId = "";

    if (req.query.userId != "undefined") {
      userId = req.query.userId;
    }

    if (id) {
      const post = await Post.findById(id).populate("author").populate({
        path: "parent",
        populate: "author",
      });

      res.json(post);
    } else {
      const parent = req.query.parent || null;
      const author = req.query?.author?.split("AND")[0] || null;
      const userID = req.query?.author?.split("AND")[1] || null;

      let searchFilter;
      if (!author && !parent) {
        const myFollows = await Follower.find({ source: userId }).exec();
        const idsOfPeopleIFollow = myFollows.map((f) => f.destination);
        searchFilter = { author: [...idsOfPeopleIFollow, userId] };
      }
      if (author) {
        searchFilter = { author };
      }
      if (parent) {
        searchFilter = { parent };
      }
      const posts = await Post.find(searchFilter)
        .populate("author")
        .populate({
          path: "parent",
          populate: "author",
        })
        .sort({ createdAt: -1 })
        .limit(20)
        .exec();

      const ID = userID ? userID : userId;
      const postIds = posts.map((p) => p._id);
      const postLikedByMe = await Like.find({
        author: ID,
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
