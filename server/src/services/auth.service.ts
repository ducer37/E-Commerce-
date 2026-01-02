import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

const generateToken = (user: User) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN ||
        "7d") as jwt.SignOptions["expiresIn"],
    }
  );
};

// 1. Đăng ký
const register = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) {
    throw new AppError("Email đã được sử dụng!", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Tạo user mới
  const newUser = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${data.name}`, // Avatar mặc định
    },
  });

  // Tạo token luôn để đăng ký xong là đăng nhập luôn
  const token = generateToken(newUser);

  // Loại bỏ password trước khi trả về (bảo mật)
  const { password, ...userWithoutPassword } = newUser;

  return { user: userWithoutPassword, token };
};

// 2. Đăng nhập
const login = async (data: any) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Email không tồn tại!", 404);
  }

  // So sánh password nhập vào với password mã hóa trong DB
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Mật khẩu không đúng!", 404);
  }

  const token = generateToken(user);

  const { password: pwd, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export default { register, login };
