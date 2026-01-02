import { Request, Response } from "express";
import authService from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/apiResponse";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  sendResponse(res, 201, true, "Đăng ký thành công!", result);
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  sendResponse(res, 200, true, "Đăng nhập thành công!", result);
});

export default { register, login };
