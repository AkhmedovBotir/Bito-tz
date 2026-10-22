import mongoose from 'mongoose';

const purchaseLineSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    subWarehouse: { type: mongoose.Schema.Types.ObjectId, required: true },
    qtyPieces: { type: Number, required: true, min: 1 },
    unitCost: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, default: 0 },
  },
  { _id: false }
);

const purchaseSchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    number: { type: String, trim: true },
    status: { type: String, enum: ['draft', 'posted'], default: 'draft' },
    supplierName: { type: String, trim: true, default: 'Ta’minotchi' },
    lines: { type: [purchaseLineSchema], default: [] },
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    debtAmount: { type: Number, default: 0 },
    postedAt: { type: Date },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Purchase = mongoose.model('Purchase', purchaseSchema);
