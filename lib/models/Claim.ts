import mongoose, { Schema, Document } from 'mongoose';

export interface IClaim extends Document {
  itemId: mongoose.Types.ObjectId;
  claimedBy: mongoose.Types.ObjectId;
  claimDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  description: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const claimSchema = new Schema<IClaim>(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    claimedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    claimDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    description: {
      type: String,
      required: true,
    },
    contactInfo: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.Claim || mongoose.model<IClaim>('Claim', claimSchema);
