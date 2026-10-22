import mongoose from 'mongoose';

const subWarehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
  },
  { _id: true }
);

const warehouseSchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    subWarehouses: { type: [subWarehouseSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Warehouse = mongoose.model('Warehouse', warehouseSchema);
