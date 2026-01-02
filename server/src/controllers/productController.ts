import { Request, Response } from "express";
import * as productService from "../services/productService";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/apiResponse";

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const { search, category, sort, page, limit } = req.query;

  const filters = {
    search: search as string,
    category: category as string,
    sort: sort as string,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 12,
  };

  const result = await productService.getAllProducts(filters);

  res.json({
    success: true,
    data: result.data,
    pagination: result.meta,
  });
});

export const getProductDetail = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    return sendResponse(res, 400, false, "ID sản phẩm không hợp lệ");
  }

  const product = await productService.getProductById(id);

  if (!product) {
    return sendResponse(res, 404, false, "Không tìm thấy sản phẩm");
  }

  sendResponse(res, 200, true, "Lấy thông tin thành công", product);
});
