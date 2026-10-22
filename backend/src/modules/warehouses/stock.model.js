import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    subWarehouse: { type: mongoose.Schema.Types.ObjectId, required: true },
    qtyPieces: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

stockSchema.index(
  { store: 1, product: 1, warehouse: 1, subWarehouse: 1 },
  { unique: true }
);

export const Stock = mongoose.model('Stock', stockSchema);
