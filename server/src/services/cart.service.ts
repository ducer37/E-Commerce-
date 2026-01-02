import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

interface CartItemResponse {
  id: string;
  image: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  stock: number; // Bổ sung stock để frontend biết giới hạn max
  variantId: string; // Bổ sung để logic logic update chính xác hơn
}

// 1. Lấy giỏ hàng
const getCart = async (userId: number): Promise<CartItemResponse[]> => {
  // Tìm giỏ hàng của user
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        orderBy: { id: "asc" }, // Sắp xếp theo thứ tự thêm vào
        include: {
          variant: {
            include: {
              product: true, // Lấy thông tin Product cha (tên, giá gốc, thumbnail)
            },
          },
        },
      },
    },
  });

  // Nếu chưa có giỏ hàng, tạo mới và trả về mảng rỗng
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        cartItems: { include: { variant: { include: { product: true } } } },
      },
    });
    return [];
  }

  // --- QUAN TRỌNG: Map dữ liệu Prisma sang format Frontend ---
  const formattedItems: CartItemResponse[] = cart.cartItems.map((item) => {
    const variant = item.variant;
    const product = variant.product;

    return {
      id: item.id.toString(), // Convert ID giỏ hàng từ Int -> String (Frontend yêu cầu string)

      image:
        variant.image || product.thumbnail || "https://via.placeholder.com/150",

      name: product.name,
      color: variant.color,
      size: variant.size,

      price: Number(product.price),

      quantity: item.quantity,

      stock: variant.stock,
      variantId: variant.id.toString(),
    };
  });

  return formattedItems;
};

// 2. Thêm vào giỏ hàng
const addToCart = async (
  userId: number,
  variantId: number,
  quantity: number
) => {
  // Tìm hoặc tạo giỏ hàng
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // Kiểm tra xem variant này đã có trong giỏ chưa
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_variantId: {
        cartId: cart.id,
        variantId: variantId,
      },
    },
  });

  if (existingItem) {
    // Nếu có rồi -> Cộng dồn quantity
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    // Nếu chưa có -> Tạo mới
    return await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId: variantId,
        quantity: quantity,
      },
    });
  }
};

// 3. Cập nhật số lượng (Dựa trên CartItem ID)
const updateQuantity = async (
  userId: number,
  cartItemId: number,
  quantity: number
) => {
  // Kiểm tra quantity hợp lệ
  if (quantity < 1) {
    throw new AppError("Số lượng phải lớn hơn 0", 400);
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new AppError("Không tìm thấy sản phẩm trong giỏ hàng", 404);
  }

  return await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
};

// 4. Xóa sản phẩm khỏi giỏ
const removeItem = async (userId: number, cartItemId: number) => {
  // Check quyền sở hữu tương tự update (bỏ qua để code gọn)
  return await prisma.cartItem.delete({
    where: { id: cartItemId },
  });
};

export default { getCart, addToCart, updateQuantity, removeItem };
