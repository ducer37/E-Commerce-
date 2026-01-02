import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import addressService from "../services/address.service";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/apiResponse";

const getList = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return sendResponse(res, 401, false, "Unauthorized");
  const list = await addressService.getAddresses(userId);
  res.json(list);
});

const create = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return sendResponse(res, 401, false, "Unauthorized");
  const item = await addressService.createAddress(userId, req.body);
  res.json(item);
});

const update = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) return sendResponse(res, 401, false, "Unauthorized");
  const item = await addressService.updateAddress(userId, Number(id), req.body);
  res.json(item);
});

const remove = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) return sendResponse(res, 401, false, "Unauthorized");
  await addressService.deleteAddress(userId, Number(id));
  sendResponse(res, 200, true, "Deleted");
});

export default { getList, create, update, remove };
