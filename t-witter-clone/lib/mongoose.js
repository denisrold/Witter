import mongoose from "mongoose";

export function initMongoose() {
  //DB CONNECT
  mongoose.connect(procces.env.MONGODB_URI);
}
