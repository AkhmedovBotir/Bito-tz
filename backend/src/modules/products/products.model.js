import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    name: { type: String, required: true, trim: true },
    /** Sotuv narxi (1 dona uchun) */
    salePrice: { type: Number, required: true, min: 0, default: 0 },
    /** Tannarx / xarid narxi (1 dona uchun) */
    costPrice: { type: Number, required: true, min: 0, default: 0 },
    /** 1 blok = N dona */
    unitsPerBlock: { type: Number, required: true, min: 1, default: 24 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
