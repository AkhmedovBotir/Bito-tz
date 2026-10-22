import mongoose from 'mongoose';

const debtSchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    /** receivable = mijoz bizga qarzdor; payable = biz ta'minotchiga qarzdormiz */
    kind: { type: String, enum: ['receivable', 'payable'], required: true },
    partyName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    remaining: { type: Number, required: true, min: 0 },
    relatedType: { type: String, enum: ['sale', 'purchase', 'manual'], default: 'manual' },
    relatedId: { type: mongoose.Schema.Types.ObjectId },
    note: { type: String, trim: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
  },
  { timestamps: true }
);

export const Debt = mongoose.model('Debt', debtSchema);
