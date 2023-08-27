import User from "../../models/users";
import { initMongoose } from "../../lib/mongoose";

export default async function handle(req, res) {
  await initMongoose();
  const id = req.query.id;

  const user = await User.findById(id);
  res.json({ user });
}
//MINUTO 38:38