import { Request, Response } from "express";
import * as categoryService from "../services/categoryService";
import { catchAsync } from "../utils/catchAsync";

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  res.json({
    success: true,
    data: categories,
  });
});
