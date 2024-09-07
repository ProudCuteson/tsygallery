// ClerkId, email, username, photo, firstname, lastname, planId, credits
import { Schema, model, models} from 'mongoose';

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true},
  username: { type: String, required: true },
  photo: { type: String, required: true },
  firstname: { type: String },
  lastname: { type: String },
  /* planId: { type: String, default: 1 },
  creditBlance: { type: Number, default: 10 }, */
});

const User = models?.User || model('User', UserSchema);

export default User;