import { initMongoose } from "@/lib/mongoose";
import Follower from "@/models/Follower";

export default async function handler(req, res) {
  await initMongoose();

  const { destination, userId } = req.body;

  const existingFollow = await Follower.findOne({
    destination,
    source: userId,
  });
  if (existingFollow) {
    await existingFollow.remove();
    res.json(null);
  } else {
    const f = await Follower.create({ destination, source: userId });
    res.json(f);
  }
}
