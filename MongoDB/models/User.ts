import mongoose, { Schema, Document } from 'mongoose';

// User interface - defines what a user looks like
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

// User schema - defines the structure of user data in MongoDB
const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the User model
// If the model already exists, use it; otherwise create a new one
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
