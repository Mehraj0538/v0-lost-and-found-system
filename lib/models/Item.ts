import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  referenceCode: string;
  title: string;
  description: string;
  category: mongoose.Types.ObjectId;
  itemType: 'found' | 'lost';
  location: string;
  foundDate?: Date;
  lostDate?: Date;
  status: 'open' | 'claimed' | 'returned' | 'resolved';
  submittedBy: mongoose.Types.ObjectId;
  images?: string[];
  tags?: string[];
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItem>(
  {
    referenceCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category'],
    },
    itemType: {
      type: String,
      enum: ['found', 'lost'],
      required: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
    },
    foundDate: Date,
    lostDate: Date,
    status: {
      type: String,
      enum: ['open', 'claimed', 'returned', 'resolved'],
      default: 'open',
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    images: [String],
    tags: [String],
    contact: {
      name: {
        type: String,
        required: [true, 'Please provide contact name'],
      },
      email: {
        type: String,
        required: [true, 'Please provide contact email'],
      },
      phone: {
        type: String,
        required: [true, 'Please provide contact phone'],
      },
    },
  },
  { timestamps: true }
);

// Generate reference code before saving
itemSchema.pre('save', async function (next) {
  if (this.isNew) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    this.referenceCode = `LF-${year}-${random}`;
  }
  next();
});

export default mongoose.models.Item || mongoose.model<IItem>('Item', itemSchema);
