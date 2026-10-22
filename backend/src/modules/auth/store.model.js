import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 4 },
  },
  { timestamps: true }
);

storeSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id,
    name: this.name,
    phone: this.phone,
    username: this.username,
    createdAt: this.createdAt,
  };
};

export const Store = mongoose.model('Store', storeSchema);
