import * as productsService from './products.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const items = await productsService.listProducts(req.storeId);
  res.json({ success: true, data: items });
});

export const create = asyncHandler(async (req, res) => {
  const item = await productsService.createProduct(req.storeId, req.body);
  res.status(201).json({ success: true, data: item });
});

export const getById = asyncHandler(async (req, res) => {
  const item = await productsService.getProductById(req.storeId, req.params.id);
  res.json({ success: true, data: item });
});

export const update = asyncHandler(async (req, res) => {
  const item = await productsService.updateProduct(req.storeId, req.params.id, req.body);
  res.json({ success: true, data: item });
});

export const remove = asyncHandler(async (req, res) => {
  const item = await productsService.deleteProduct(req.storeId, req.params.id);
  res.json({ success: true, data: item });
});

export const convert = asyncHandler(async (req, res) => {
  const unitsPerBlock = Number(req.body.unitsPerBlock) || 24;
  const data = productsService.convertUnits(unitsPerBlock, req.body);
  res.json({ success: true, data });
});
