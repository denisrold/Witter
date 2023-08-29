import User from "../../models/users";
import { initMongoose } from "../../lib/mongoose";

export default async function handle(req, res) {
  await initMongoose();
  if (req.method === "GET") {
    const id = req.query.id;
    const user = await User.findById(id);
    res.json({ user });
  }

  if (req.method === "PUT") {
    const { username, user } = req.body;
    const userId = user.id;
    await User.findByIdAndUpdate(userId, { username });
    res.json("ok");
  }
}
