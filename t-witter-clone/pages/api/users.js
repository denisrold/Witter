import mongoose from "mongoose";

export default function handle(req, res) {
  //DB CONNECT
  mongoose.connect(procces.env.MONGODB_URI);
  res.json("ok");
}
