import mongoose from 'mongoose';

const cashEntrySchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    type: { type: String, enum: ['in', 'out'], required: true },
    category: {
      type: String,
      enum: [
        'sale',
        'purchase',
        'debt_collect',
        'debt_pay',
        'transport',
        'expense',
        'other',
      ],
      default: 'other',
    },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    relatedType: { type: String, enum: ['sale', 'purchase', 'debt'], required: false },
    relatedId: { type: mongoose.Schema.Types.ObjectId, required: false },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const CashEntry = mongoose.model('CashEntry', cashEntrySchema);
