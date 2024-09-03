// ClerkId, email, username, photo, firstname, lastname, planId, creditt
import { Schema, model, models, Document } from 'mongoose';

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  photo: { type: String, required: true },
  firstname: { type: String },
  lastname: { type: String },
  planId: { type: String, default: 1 },
  creditBlance: { type: Number, default: 10 },
});

const User = models.User || model('User', UserSchema);

export default User;