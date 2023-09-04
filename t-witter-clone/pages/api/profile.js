import { initMongoose } from "@/lib/mongoose";
import User from "@/models/users";

export default async function handler(req, res) {
  await initMongoose();
  const { bio, name, username, userId } = req.body;
  await User.findByIdAndUpdate(userId, { bio, name, username });

  res.json("ok");
}
