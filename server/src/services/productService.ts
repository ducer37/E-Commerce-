// src/services/productService.ts
import prisma from "../utils/prisma";

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string[];
  sections: string[];
  color: string;
  size: string;
}

interface FilterParams {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

interface PaginatedResult {
  data: ProductSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const getColorCode = (colorName: string): string => {
  const normalizedColor = colorName.toLowerCase().trim();

  const map: Record<string, string> = {
    gray: "#808080",
    black: "#000000",
    blue: "#0000FF",
    "light gray": "#D3D3D3",
    "dark blue": "#00008B",
    white: "#FFFFFF",
    brown: "#A52A2A",

    red: "#FF0000",
    green: "#008000",
    yellow: "#FFFF00",
    navy: "#000080",
    beige: "#F5F5DC",
    pink: "#FFC0CB",
    purple: "#800080",
  };

  return map[normalizedColor] || "#CCCCCC";
};

export const getAllProducts = async (
  params: FilterParams
): Promise<PaginatedResult> => {
  const { search, category, sort } = params;
  const page = params.page || 1;
  const limit = params.limit || 12;
  const skip = (page - 1) * limit;

  const whereClause: any = { isActive: true };
  if (search) whereClause.name = { contains: search, mode: "insensitive" };

  if (category) {
    whereClause.categories = {
      some: {
        name: category,
      },
    };
  }

  let orderBy: any = { createdAt: "desc" };

  if (sort === "newest") orderBy = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };

  const rawProducts = await prisma.product.findMany({
    where: whereClause,
    orderBy: orderBy,
    skip: skip,
    take: limit,
    include: {
      categories: true,
      variants: true,
    },
  });

  const total = await prisma.product.count({ where: whereClause });

  const formattedData = rawProducts.map((product) => {
    const representativeVariant = product.variants[0];
    const sections: string[] = [];

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    if (new Date(product.createdAt) > oneYearAgo) sections.push("new");

    const originalPrice = Number(product.originalPrice);
    const price = Number(product.price);
    const discountPercent =
      originalPrice > 0 ? ((originalPrice - price) / originalPrice) * 100 : 0;

    if (discountPercent > 0) {
      sections.push("sale");
    }
    if (product.reviewCount > 5) {
      sections.push("best seller");
    }

    return {
      id: product.id.toString(),
      name: product.name,
      price: Number(product.price),
      originalPrice: Number(product.originalPrice),
      image: product.thumbnail || "",
      category: product.categories.map((cat) => cat.name),
      sections: sections,
      color: representativeVariant ? representativeVariant.color : "Free",
      size: representativeVariant ? representativeVariant.size : "Free",
    };
  });

  return {
    data: formattedData,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  variants: {
    id: number;
    color: string;
    colorCode: string;
    size: string;
    stock: number;
    image: string | null;
  }[];
}

export const getProductById = async (
  id: string
): Promise<ProductDetail | null> => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      categories: true,
      variants: true,
    },
  });

  if (!product) return null;

  return {
    id: product.id.toString(),
    name: product.name,
    price: Number(product.price),
    rating: Number(product.rating),
    reviewCount: Number(product.reviewCount),
    description: product.description || "",
    variants: product.variants.map((v) => ({
      id: v.id,
      color: v.color,
      colorCode: getColorCode(v.color),
      size: v.size,
      stock: v.stock,
      image: v.image,
    })),
  };
};
