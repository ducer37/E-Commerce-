// prisma/seed.ts

import { PrismaClient, Role, OrderStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Danh sách Category và Ảnh tương ứng bạn cung cấp
const CATEGORIES_DATA = [
  {
    name: "Men Fashion",
    img: "https://i.pinimg.com/1200x/0f/27/a9/0f27a9c312782477674974ca9780f3fe.jpg",
  },
  {
    name: "Men T-Shirt",
    img: "https://i.pinimg.com/1200x/8c/a9/9d/8ca99d32bf87f94cd3b2bbc3518c4387.jpg",
  },
  {
    name: "Men Hoodies",
    img: "https://i.pinimg.com/1200x/fa/3e/51/fa3e51d5114a69a3821ae6fa03918263.jpg",
  },
  {
    name: "Men Sweater",
    img: "https://i.pinimg.com/736x/e7/37/0f/e7370f5da9e85f910777e737c858a15a.jpg",
  },
  {
    name: "Men Jeans",
    img: "https://i.pinimg.com/736x/4c/b6/1f/4cb61f345d73d8b6900f973eec4666c1.jpg",
  },
  {
    name: "Men Polos",
    img: "https://i.pinimg.com/1200x/b0/61/de/b061de686fdcdd8e2b442594a62ed024.jpg",
  },
  {
    name: "Women Fashion",
    img: "https://i.pinimg.com/1200x/a1/ad/ac/a1adac09ab41f7c8b15b8e78c66c6f14.jpg",
  },
  {
    name: "Women Dress",
    img: "https://i.pinimg.com/1200x/47/cb/62/47cb6276f42c80d348d04beab33dd17a.jpg",
  },
  {
    name: "Women Shoes",
    img: "https://i.pinimg.com/1200x/3a/45/2b/3a452bef35a5cbe371dfda1ae7b70740.jpg",
  },
  {
    name: "Women Legging",
    img: "https://i.pinimg.com/736x/fb/36/38/fb36381569a93e15b375645816ba647b.jpg",
  },
  {
    name: "Women Skirts",
    img: "https://i.pinimg.com/1200x/42/49/61/4249613f142e10b2fc902fe9802718fb.jpg",
  },
  {
    name: "Women Tops",
    img: "https://i.pinimg.com/1200x/66/93/b9/6693b96944eb46a1b1c404cc227a2f6e.jpg",
  },
  {
    name: "Kids",
    img: "https://i.pinimg.com/736x/bb/32/18/bb3218c077dc32e1004b55003e2025a8.jpg",
  },
  {
    name: "Kids Shoes",
    img: "https://i.pinimg.com/736x/5a/f0/6c/5af06c91fd5e8fe09390fe6afb592428.jpg",
  },
  {
    name: "Kids T-Shirt",
    img: "https://i.pinimg.com/1200x/d4/f0/17/d4f017d6f982facefb6438df638e9590.jpg",
  },
  {
    name: "Kids Short",
    img: "https://i.pinimg.com/1200x/41/53/d5/4153d5e8406377497c95ec59c9b530f9.jpg",
  },
  {
    name: "Accessories",
    img: "https://i.pinimg.com/736x/96/dc/35/96dc35668f7f29c093be5fedfe0b066c.jpg",
  },
  {
    name: "Bags",
    img: "https://i.pinimg.com/1200x/e9/9f/ae/e99fae5bd7efaf675e9daff520f50e8d.jpg",
  },
  {
    name: "Hats",
    img: "https://i.pinimg.com/736x/c0/df/bd/c0dfbd1a31f36736781173181e4057b5.jpg",
  },
  {
    name: "Wallets",
    img: "https://i.pinimg.com/1200x/c4/9a/81/c49a8168afb22d0d43bf294647ffed27.jpg",
  },
];

// Hàm tạo slug từ tên
const createSlug = (name: string) => name.toLowerCase().replace(/ /g, "-");

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Clean up database (xóa dữ liệu cũ để tránh lỗi unique)
  // Xóa theo thứ tự quan hệ ngược
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.userPayment.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.userVoucher.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.supportMessage.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Admin & Users
  const hashedPassword = await bcrypt.hash("123456", 10);

  // Tạo Admin
  await prisma.user.create({
    data: {
      email: "admin@fashion.com",
      password: hashedPassword,
      name: "Super Admin",
      role: Role.ADMIN,
      avatar: faker.image.avatar(),
    },
  });

  // Tạo 50 Users
  const users = [];
  for (let i = 0; i < 50; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: hashedPassword,
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        role: Role.CUSTOMER,
        avatar: faker.image.avatar(),
        createdAt: faker.date.past(),
      },
    });
    users.push(user);

    // Tạo 2 Address cho mỗi User
    await prisma.address.createMany({
      data: [
        {
          userId: user.id,
          recipientName: user.name || "User",
          phone: user.phone || "0123456789",
          city: faker.location.city(),
          district: faker.location.county(),
          ward: faker.location.state(),
          detail: faker.location.streetAddress(),
          isDefault: true,
        },
        {
          userId: user.id,
          recipientName: faker.person.fullName(),
          phone: faker.phone.number(),
          city: faker.location.city(),
          district: faker.location.county(),
          ward: faker.location.state(),
          detail: faker.location.streetAddress(),
          isDefault: false,
        },
      ],
    });

    // Tạo Support Message ngẫu nhiên (30% user sẽ có tin nhắn)
    if (Math.random() > 0.7) {
      await prisma.supportMessage.create({
        data: {
          userId: user.id,
          content: faker.lorem.sentences(2),
          status: "OPEN",
        },
      });
    }
  }
  console.log("✅ Created 50 Users and Addresses");

  // 3. Create Payment Methods & User Payments
  const paymentMethods = await prisma.paymentMethod.createManyAndReturn({
    data: [
      {
        name: "Credit Card (Visa/Master)",
        code: "CREDIT_CARD",
        isActive: true,
      },
      { name: "PayPal", code: "PAYPAL", isActive: true },
      { name: "Cash On Delivery", code: "COD", isActive: true },
      { name: "Momo Wallet", code: "MOMO", isActive: true },
    ],
  });

  // Tạo User Payment (Mỗi user add random 1 thẻ)
  for (const user of users) {
    const randomMethod =
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    // Không add thẻ cho COD
    if (randomMethod.code !== "COD") {
      await prisma.userPayment.create({
        data: {
          userId: user.id,
          paymentMethodId: randomMethod.id,
          provider:
            randomMethod.code === "CREDIT_CARD" ? "Visa" : randomMethod.name,
          accountNumber: `**** ${faker.string.numeric(4)}`,
          expiryDate: "12/28",
          isDefault: true,
        },
      });
    }
  }
  console.log("✅ Created Payment Methods");

  // 4. Create Categories (Logic Cha - Con)
  // Chúng ta sẽ tạo Map để lưu ID của Category cha
  const parentMap: Record<string, number> = {};

  for (const cat of CATEGORIES_DATA) {
    let parentId = null;

    // Logic xác định cha dựa trên tên
    if (cat.name.includes("Men ") && cat.name !== "Men Fashion") {
      parentId = parentMap["Men Fashion"];
    } else if (cat.name.includes("Women ") && cat.name !== "Women Fashion") {
      parentId = parentMap["Women Fashion"];
    } else if (cat.name.includes("Kids ") && cat.name !== "Kids") {
      parentId = parentMap["Kids"];
    } else if (["Bags", "Hats", "Wallets"].includes(cat.name)) {
      parentId = parentMap["Accessories"];
    }

    const createdCat = await prisma.category.create({
      data: {
        name: cat.name,
        slug: createSlug(cat.name),
        image: cat.img,
        parentId: parentId,
      },
    });

    // Lưu lại ID nếu đây là danh mục cha
    if (
      ["Men Fashion", "Women Fashion", "Kids", "Accessories"].includes(cat.name)
    ) {
      parentMap[cat.name] = createdCat.id;
    }
  }
  console.log("✅ Created Categories Hierarchy");

  const menSweaterCat = await prisma.category.findFirst({
    where: { slug: "men-sweater" },
  });
  const menPolosCat = await prisma.category.findFirst({
    where: { slug: "men-polos" },
  });

  // Fallback nếu không tìm thấy category (để tránh lỗi crash)
  const defaultCatId =
    menSweaterCat?.id || (await prisma.category.findFirst())?.id;

  const SPECIFIC_PRODUCTS = [
    {
      // ID giả định: 1
      name: "Sweater Novita",
      thumbnail:
        "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0fm2xvr52mn0d.webp",
      categoryId: menSweaterCat?.id || defaultCatId,
      originalPrice: 250,
      price: 199,
      variants: [
        {
          color: "gray",
          size: "L",
          sku: "sweater-novita-gray-L",
          image:
            "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0fm2xvr52mn0d.webp",
        },
        {
          color: "black",
          size: "L",
          sku: "sweater-novita-black-L",
          image:
            "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0fm2xvr3o275f.webp",
        },
        {
          color: "blue",
          size: "L",
          sku: "sweater-novita-blue-L",
          image:
            "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m2695m4aom9gd7.webp",
        },
      ],
    },
    {
      // ID giả định: 2
      name: "Polo Summer",
      thumbnail:
        "https://down-vn.img.susercontent.com/file/sg-11134202-821du-mh8p517ncbgqcf@resize_w900_nl.webp",
      categoryId: menPolosCat?.id || defaultCatId,
      originalPrice: 300,
      price: 250,
      variants: [
        {
          color: "white",
          size: "L",
          sku: "polo-summer-white-L",
          image:
            "https://down-vn.img.susercontent.com/file/sg-11134202-821du-mh8p517ncbgqcf@resize_w900_nl.webp",
        },
        {
          color: "brown",
          size: "L",
          sku: "polo-summer-brown-L",
          image:
            "https://down-vn.img.susercontent.com/file/sg-11134202-821g3-mh8p50tt1csrfd.webp",
        },
        {
          color: "black",
          size: "L",
          sku: "polo-summer-black-L",
          image:
            "https://down-vn.img.susercontent.com/file/sg-11134202-821e8-mh8p51cczsp5bb.webp",
        },
      ],
    },
    {
      // ID giả định: 3
      name: "Plain Oversized Sweater",
      thumbnail:
        "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1my0ckqpemr7f@resize_w900_nl.webp",
      categoryId: menSweaterCat?.id || defaultCatId,
      originalPrice: 200,
      price: 150,
      variants: [
        {
          color: "light gray",
          size: "L",
          sku: "plain-oversized-sweater-light-gray-L",
          image:
            "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1my0ckqpemr7f@resize_w900_nl.webp",
        },
        {
          color: "dark blue",
          size: "L",
          sku: "plain-oversized-sweater-black-blue-L",
          image:
            "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m31shhs73b4675.webp",
        },
        {
          color: "black",
          size: "L",
          sku: "plain-oversized-sweater-black-L",
          image:
            "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m31shhs71wjq3f.webp",
        },
      ],
    },
    {
      // ID giả định: 4 (Chỉ có thumbnail, tự tạo variant random)
      name: "Loose Fit Sweater",
      thumbnail:
        "https://image.hm.com/assets/hm/90/82/908265eaea9476d9c7746a7aee8a5f8d5a682663.jpg?imwidth=2160",
      categoryId: menSweaterCat?.id || defaultCatId,
      originalPrice: 220,
      price: 180,
      variants: [], // Để trống, sẽ xử lý logic random bên dưới
    },
  ];

  console.log("🌱 Seeding specific products...");

  for (const p of SPECIFIC_PRODUCTS) {
    // 1. Tạo Product
    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        slug: createSlug(p.name) + "-" + faker.string.alphanumeric(4), // Thêm đuôi random để tránh trùng nếu chạy seed nhiều lần
        description: `High quality ${p.name} for the season.`,
        thumbnail: p.thumbnail,
        originalPrice: p.originalPrice,
        price: p.price,
        rating: 5,
        reviewCount: faker.number.int({ min: 10, max: 50 }),
        categories: { connect: { id: p.categoryId } },
      },
    });

    // 2. Tạo Variants
    if (p.variants.length > 0) {
      // Nếu có variant cụ thể (ID 1, 2, 3)
      for (const v of p.variants) {
        await prisma.productVariant.create({
          data: {
            productId: createdProduct.id,
            color: v.color,
            size: v.size,
            sku: v.sku,
            image: v.image,
            stock: faker.number.int({ min: 10, max: 100 }),
          },
        });
      }
    } else {
      // Nếu không có variant cụ thể (ID 4 - Loose Fit Sweater) -> Tạo random
      const sizes = ["S", "M", "L"];
      const colors = ["Beige", "White"];
      for (const size of sizes) {
        for (const color of colors) {
          await prisma.productVariant.create({
            data: {
              productId: createdProduct.id,
              color: color,
              size: size,
              sku: `${createSlug(p.name)}-${color}-${size}`.toUpperCase(),
              image: p.thumbnail, // Dùng tạm ảnh thumbnail
              stock: 50,
            },
          });
        }
      }
    }
  }

  console.log("✅ Created Specific Products and Variants");

  // 5. Create Products & Variants
  // Lấy tất cả danh mục con (những cái có parentId) để add sản phẩm vào
  const leafCategories = await prisma.category.findMany({
    where: { parentId: { not: null } },
  });

  const allVariants = []; // Lưu lại để dùng cho seeding Order

  for (const cat of leafCategories) {
    // Mỗi danh mục tạo 3-5 sản phẩm
    const productCount = faker.number.int({ min: 3, max: 5 });

    for (let i = 0; i < productCount; i++) {
      const productName = `${faker.commerce.productAdjective()} ${cat.name}`;
      const product = await prisma.product.create({
        data: {
          name: productName,
          slug: createSlug(productName) + "-" + faker.string.uuid(), // Thêm uuid để tránh trùng slug
          description: faker.commerce.productDescription(),
          thumbnail: faker.image.url(),
          originalPrice: faker.commerce.price({ min: 50, max: 200 }),
          price: faker.commerce.price({ min: 20, max: 150 }), // Sale price
          rating: faker.number.float({ min: 3, max: 5, multipleOf: 0.1 }),
          reviewCount: faker.number.int({ min: 0, max: 100 }),
          categories: { connect: { id: cat.id } },
        },
      });

      // Tạo Variants (Size S, M, L - Color Random)
      const sizes = ["S", "M", "L", "XL"];
      const colors = ["Red", "Blue", "Black", "White"];

      for (const size of sizes) {
        // Random chọn 1 màu cho size này để đỡ tạo nhiều
        const color = colors[Math.floor(Math.random() * colors.length)];

        const variant = await prisma.productVariant.create({
          data: {
            productId: product.id,
            size: size,
            color: color,
            sku: `${createSlug(cat.name).toUpperCase()}-${
              product.id
            }-${size}-${color}`,
            stock: faker.number.int({ min: 0, max: 100 }),
            image: faker.image.url(),
          },
        });
        allVariants.push(variant);
      }

      // Tạo Review giả cho sản phẩm
      if (Math.random() > 0.5) {
        await prisma.review.create({
          data: {
            userId: users[Math.floor(Math.random() * users.length)].id,
            productId: product.id,
            rating: faker.number.int({ min: 3, max: 5 }),
            comment: faker.lorem.sentence(),
          },
        });
      }
    }
  }
  console.log("✅ Created Products, Variants & Reviews");

  // 6. Create Vouchers & UserVouchers
  const vouchers = await prisma.voucher.createManyAndReturn({
    data: [
      {
        code: "WELCOME20",
        value: 20,
        type: "PERCENT",
        stock: 100,
        startDate: new Date(),
        endDate: faker.date.future(),
      },
      {
        code: "SUMMER_SALE",
        value: 50,
        type: "FIXED",
        stock: 50,
        startDate: new Date(),
        endDate: faker.date.future(),
      },
      {
        code: "FREESHIP",
        value: 100,
        type: "PERCENT",
        stock: 200,
        startDate: new Date(),
        endDate: faker.date.future(),
      },
    ],
  });

  // Assign vouchers cho user
  for (const user of users) {
    if (Math.random() > 0.5) {
      await prisma.userVoucher.create({
        data: {
          userId: user.id,
          voucherId: vouchers[0].id, // Ai cũng có mã welcome
        },
      });
    }
  }
  console.log("✅ Created Vouchers");

  // 7. Create Orders (30 Orders)
  console.log("📦 Seeding Orders...");

  for (let i = 0; i < 30; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];

    // LOGIC MỚI: Đảm bảo không trùng variant trong 1 đơn hàng
    // 1. Xáo trộn danh sách tất cả variant
    const shuffledVariants = [...allVariants].sort(() => 0.5 - Math.random());

    // 2. Lấy ngẫu nhiên 1 đến 3 sản phẩm đầu tiên từ danh sách đã xáo trộn
    const itemCount = faker.number.int({ min: 1, max: 3 });
    const selectedVariantsSlice = shuffledVariants.slice(0, itemCount);

    // 3. Tính toán tổng tiền
    let totalAmount = 0;
    const orderItemsData = selectedVariantsSlice.map((variant) => {
      const quantity = faker.number.int({ min: 1, max: 2 });
      const price = Number(faker.commerce.price({ min: 20, max: 100 }));

      totalAmount += price * quantity;

      return {
        variantId: variant.id,
        quantity: quantity,
        price: price,
      };
    });

    const shippingFee = 5;
    const finalAmount = totalAmount + shippingFee;

    // 4. Tạo đơn hàng
    await prisma.order.create({
      data: {
        userId: randomUser.id,
        shippingAddress: `${faker.location.streetAddress()}, ${faker.location.city()}`,
        paymentMethod: Math.random() > 0.5 ? "COD" : "Visa **** 4242",
        status: faker.helpers.enumValue(OrderStatus),
        totalAmount: totalAmount,
        shippingFee: shippingFee,
        discountAmount: 0,
        finalAmount: finalAmount,
        paymentStatus: Math.random() > 0.5 ? "PAID" : "UNPAID",
        orderItems: {
          create: orderItemsData, // Dùng mảng đã xử lý ở trên
        },
      },
    });
  }
  console.log("✅ Created 30 Orders with OrderItems");

  console.log("🚀 Seed successfully completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
