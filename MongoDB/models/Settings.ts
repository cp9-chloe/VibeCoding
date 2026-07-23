import mongoose, { Schema, Document } from 'mongoose';

// Settings interface - defines what user settings look like
export interface ISettings extends Document {
  userId: mongoose.Types.ObjectId;
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  notifications: boolean;
  language: string;
}

// Settings schema - defines the structure of settings data in MongoDB
const SettingsSchema = new Schema<ISettings>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One settings document per user
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light',
  },
  fontSize: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium',
  },
  notifications: {
    type: Boolean,
    default: true,
  },
  language: {
    type: String,
    default: 'en',
  },
});

// Create and export the Settings model
export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
