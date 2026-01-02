import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Mở rộng kiểu Request để có thêm thuộc tính user
export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // 1. Lấy token từ header (Dạng: "Bearer eyJhbGci...")
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Lấy phần sau chữ Bearer

  if (!token) {
    return res
      .status(401)
      .json({ message: "Bạn chưa đăng nhập (Thiếu Token)!" });
  }

  // 2. Kiểm tra token có hợp lệ không
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }

    // 3. Lưu thông tin user (id, email, role) vào request để các hàm sau dùng
    req.user = user;

    next(); // Cho phép đi tiếp
  });
};
