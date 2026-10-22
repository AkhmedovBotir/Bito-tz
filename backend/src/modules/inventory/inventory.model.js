import mongoose from 'mongoose';

const inventoryLineSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    subWarehouse: { type: mongoose.Schema.Types.ObjectId, required: true },
    systemQty: { type: Number, default: 0 },
    countedQty: { type: Number, required: true, min: 0 },
    difference: { type: Number, default: 0 },
  },
  { _id: false }
);

const inventorySchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    status: { type: String, enum: ['draft', 'posted'], default: 'draft' },
    lines: { type: [inventoryLineSchema], default: [] },
    postedAt: { type: Date },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

export const InventoryCount = mongoose.model('InventoryCount', inventorySchema);
