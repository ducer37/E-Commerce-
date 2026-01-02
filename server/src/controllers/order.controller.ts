import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import * as orderService from "../services/order.service";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/apiResponse";

const getMyOrders = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return sendResponse(res, 401, false, "Unauthorized");

  const orders = await orderService.getMyOrders(userId);
  res.json(orders);
});

const getOrderDetail = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const orderId = Number(req.params.id);

  if (!userId) return sendResponse(res, 401, false, "Unauthorized");
  if (isNaN(orderId))
    return sendResponse(res, 400, false, "Invalid Order ID");

  const order = await orderService.getOrderById(userId, orderId);
  res.json(order);
});

const createOrder = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { shippingAddressId, paymentMethod, voucherId } = req.body;

  if (!userId) return sendResponse(res, 401, false, "Unauthorized");
  if (!shippingAddressId || !paymentMethod) {
    return sendResponse(res, 400, false, "Thiếu thông tin giao hàng hoặc thanh toán");
  }

  const newOrder = await orderService.createOrder({
    userId,
    shippingAddressId,
    paymentMethod,
    voucherId,
  });

  sendResponse(res, 201, true, "Đặt hàng thành công!", newOrder);
});

export default { getMyOrders, getOrderDetail, createOrder };
