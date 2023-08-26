import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: String,
  image: String,
  username: String,
});

const User = models?.User || model("User", UserSchema);

export default User;
