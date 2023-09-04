import User from "../../models/users";
import { initMongoose } from "../../lib/mongoose";
import Follower from "@/models/Follower";

export default async function handle(req, res) {
  await initMongoose();
  if (req.method === "GET") {
    let follow = "";
    const { id, username, userInfo } = req.query;
    console.log({ este: req.query });
    const user = id
      ? await User.findById(id)
      : await User.findOne({ username });
    if (username && userInfo) {
      follow = await Follower.findOne({
        source: userInfo,
        destination: user._id,
      });
    }
    res.json({ user, follow });
  }

  if (req.method === "PUT") {
    const { username, user } = req.body;
    const userId = user.id;
    await User.findByIdAndUpdate(userId, { username });
    res.json("ok");
  }
}
