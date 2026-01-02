import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares"; // Import interface AuthRequest bạn đã có
import userService from "../services/user.service";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/apiResponse";

const getProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return sendResponse(res, 401, false, "Unauthorized");
  }

  const user = await userService.getUserProfile(userId);
  res.json(user);
});

const updateProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { name, avatar } = req.body;

  if (!userId) return sendResponse(res, 401, false, "Unauthorized");

  const updatedUser = await userService.updateUser(userId, { name, avatar });
  res.json(updatedUser);
});

export default { getProfile, updateProfile };
