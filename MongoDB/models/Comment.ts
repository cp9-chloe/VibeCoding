import mongoose, { Schema, Document } from 'mongoose';

// Comment interface - defines what a comment looks like
export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

// Comment schema - defines the structure of comment data in MongoDB
const CommentSchema = new Schema<IComment>({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Comment model
export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
