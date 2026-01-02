import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

// GET
const getAddresses = async (userId: number) => {
  return await prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: "desc" },
  });
};

// CREATE
const createAddress = async (userId: number, data: any) => {
  console.log("👉 [Service] Data received for create:", data);

  if (!data.recipientName || !data.phone || !data.city || !data.detail) {
    throw new AppError(
      `Thiếu thông tin bắt buộc! Nhận được: recipientName=${data.recipientName}, detail=${data.detail}`,
      400
    );
  }

  if (data.isDefault === true) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const count = await prisma.address.count({ where: { userId } });

  const finalIsDefault = count === 0 ? true : data.isDefault || false;

  // 4. Gọi Prisma Create
  return await prisma.address.create({
    data: {
      userId: userId,
      recipientName: data.recipientName,
      phone: data.phone,
      city: data.city,

      district: data.district || null,
      ward: data.ward || null,

      detail: data.detail,
      isDefault: finalIsDefault,
    },
  });
};

// UPDATE
const updateAddress = async (userId: number, addressId: number, data: any) => {
  // 1. Reset Default nếu cần
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  // 2. Update
  return await prisma.address.update({
    where: { id: addressId },
    data: {
      recipientName: data.recipientName,
      phone: data.phone,
      city: data.city,
      district: data.district,
      ward: data.ward,
      detail: data.detail,
      isDefault: data.isDefault,
    },
  });
};

// DELETE
const deleteAddress = async (userId: number, addressId: number) => {
  // Check quyền sở hữu
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) throw new AppError("Address not found or unauthorized", 404);

  return await prisma.address.delete({
    where: { id: addressId },
  });
};

export default { getAddresses, createAddress, updateAddress, deleteAddress };
