import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { sendOrderConfirmation } from "./email.service";

const prisma = new PrismaClient();



export const getMyOrders = async (userId: number) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          variant: {
            include: {
              product: {
                select: { name: true, thumbnail: true }, // Lấy tên và ảnh sản phẩm gốc
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" }, // Mới nhất lên đầu
  });
};

export const getOrderById = async (userId: number, orderId: number) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: userId, // Quan trọng: Chỉ lấy nếu đúng là của user này
    },
    include: {
      orderItems: {
        include: {
          variant: {
            include: {
              product: {
                select: { name: true, thumbnail: true },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new AppError("Order not found or access denied", 404);
  }

  return order;
};

// CREATE ORDER
interface CreateOrderInput {
  userId: number;
  shippingAddressId: number;
  paymentMethod: string; // "COD" | "BANK_TRANSFER"
  voucherId?: number; // Optional
}

export const createOrder = async (data: CreateOrderInput) => {
  const { userId, shippingAddressId, paymentMethod, voucherId } = data;

  // 1. Lấy giỏ hàng
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      user: { select: { email: true } }, // Fetch email
      cartItems: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  });

  if (!cart || cart.cartItems.length === 0) {
    throw new AppError("Giỏ hàng trống, không thể thanh toán!", 400);
  }

  // 2. Validate Address (Check ownership)
  const address = await prisma.address.findUnique({
    where: { id: shippingAddressId },
  });

  if (!address || address.userId !== userId) {
    throw new AppError("Địa chỉ giao hàng không hợp lệ!", 400);
  }

  // Format address string for storage
  const shippingAddressString = `${address.recipientName}, ${address.phone}, ${address.detail}, ${address.ward}, ${address.district}, ${address.city}`;

  // 3. Tính toán tiền
  let totalAmount = 0;
  const orderItemsData: { variantId: number; quantity: number; price: number }[] =
    [];

  for (const item of cart.cartItems) {
    // Check stock
    if (item.quantity > item.variant.stock) {
      throw new AppError(
        `Sản phẩm "${item.variant.product.name}" (Màu: ${item.variant.color}, Size: ${item.variant.size}) không đủ hàng!`,
        400
      );
    }

    const price = Number(item.variant.product.price);
    const itemTotal = price * item.quantity;
    totalAmount += itemTotal;

    orderItemsData.push({
      variantId: item.variantId,
      quantity: item.quantity,
      price: price,
    });
  }

  // Logic mã giảm giá (Mock logic for now, or fetch from DB if needed)
  let discountAmount = 0;
  // if (voucherId) { ... }

  let shippingFee = 30000; // Mock shipping fee
  if (totalAmount > 500000) shippingFee = 0; // Free shipping over 500k

  const finalAmount = totalAmount + shippingFee - discountAmount;

  // 4. TRANSACTION: Tạo Order -> Tạo OrderItems -> Trừ Stock -> Xóa CartItems
  const result = await prisma.$transaction(async (tx) => {
    // A. Tạo Order
    const newOrder = await tx.order.create({
      data: {
        userId,
        shippingAddress: shippingAddressString,
        paymentMethod,
        totalAmount,
        shippingFee,
        discountAmount,
        finalAmount,
        status: "PENDING",
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "UNPAID",
        orderItems: {
          create: orderItemsData,
        },
      },
      include: { orderItems: true },
    });

    // B. Trừ tồn kho (Stock)
    for (const item of cart.cartItems) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: {
          stock: { decrement: item.quantity },
        },
      });
    }

    // C. Xóa CartItems (Giữ lại Cart wrapper cho lần sau)
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return newOrder;
  });



  // 5. Send Email (Fire and forget, or await but catch error)
  if (cart.user && cart.user.email) {
    try {
        const fullOrder = await prisma.order.findUnique({
            where: { id: result.id },
            include: {
                orderItems: {
                    include: {
                        variant: {
                            include: { product: true }
                        }
                    }
                }
            }
        });
        
        if (fullOrder) {
             await sendOrderConfirmation(cart.user.email, fullOrder);
        }
    } catch(err) {
        console.error("⚠️ Failed to send email:", err);
        // Do not throw, order is already created
    }
  }

  return result;
};
