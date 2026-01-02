import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

const getUserProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError("Người dùng không tồn tại", 404);
  }

  return user;
};

const updateUser = async (
  userId: number,
  data: { name?: string; avatar?: string }
) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      avatar: data.avatar,
    },
    select: { id: true, name: true, email: true, createdAt: true }, // Trả về data mới
  });
};

export default { getUserProfile, updateUser };
