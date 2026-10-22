import { Product } from './products.model.js';
import { AppError } from '../../shared/utils/AppError.js';
import { fromPieces, toPieces } from '../../shared/utils/units.js';

export async function listProducts(storeId) {
  const items = await Product.find({ store: storeId }).sort({ createdAt: -1 });
  return items.map((p) => ({
    ...p.toObject(),
    conversionExample: {
      oneBlockPieces: p.unitsPerBlock,
      sample: fromPieces(p.unitsPerBlock * 2 + 3, p.unitsPerBlock),
    },
  }));
}

export async function createProduct(storeId, payload) {
  if (!payload.name) throw new AppError('Mahsulot nomi majburiy');
  const unitsPerBlock = Math.max(1, Number(payload.unitsPerBlock) || 24);
  return Product.create({
    store: storeId,
    name: payload.name.trim(),
    salePrice: Number(payload.salePrice) || 0,
    costPrice: Number(payload.costPrice ?? payload.purchasePrice) || 0,
    unitsPerBlock,
  });
}

export async function getProductById(storeId, id) {
  const product = await Product.findOne({ _id: id, store: storeId });
  if (!product) throw new AppError('Mahsulot topilmadi', 404);
  return product;
}

export async function updateProduct(storeId, id, payload) {
  const product = await getProductById(storeId, id);
  if (payload.name != null) product.name = payload.name.trim();
  if (payload.salePrice != null) product.salePrice = Number(payload.salePrice);
  if (payload.costPrice != null || payload.purchasePrice != null) {
    product.costPrice = Number(payload.costPrice ?? payload.purchasePrice);
  }
  if (payload.unitsPerBlock != null) {
    product.unitsPerBlock = Math.max(1, Number(payload.unitsPerBlock));
  }
  await product.save();
  return product;
}

export async function deleteProduct(storeId, id) {
  const product = await Product.findOneAndDelete({ _id: id, store: storeId });
  if (!product) throw new AppError('Mahsulot topilmadi', 404);
  return product;
}

export function convertUnits(unitsPerBlock, { pieces, blocks }) {
  const qtyPieces = toPieces({ pieces, blocks }, unitsPerBlock);
  return fromPieces(qtyPieces, unitsPerBlock);
}
