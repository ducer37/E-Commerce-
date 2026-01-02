import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import cartService from "../services/cart.service";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/apiResponse";

// GET /api/cart
const getCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const cartItems = await cartService.getCart(userId);
  res.json(cartItems);
});

// POST /api/cart/add
const addToCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { variantId, quantity } = req.body;

  if (!variantId || !quantity) {
    return sendResponse(res, 400, false, "Thiếu thông tin sản phẩm");
  }

  await cartService.addToCart(userId, Number(variantId), Number(quantity));
  sendResponse(res, 200, true, "Đã thêm vào giỏ hàng");
});

// PUT /api/cart/:id (Update Quantity)
const updateItem = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;
  const { quantity } = req.body;

  await cartService.updateQuantity(
    userId,
    Number(cartItemId),
    Number(quantity)
  );

  sendResponse(res, 200, true, "Cập nhật thành công");
});

// DELETE /api/cart/:id
const removeItem = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;

  await cartService.removeItem(userId, Number(cartItemId));

  sendResponse(res, 200, true, "Đã xóa sản phẩm");
});

export default { getCart, addToCart, updateItem, removeItem };
