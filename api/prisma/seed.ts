import * as bcrypt from "bcrypt";
import { Gender, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const adminHashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      name: "admin",
      password: adminHashedPassword,
      role: Role.ADMIN,
      phone: "01019065964",
      gender: Gender.MALE,
      isVerified: true,
    },
  });

  // // Seed Categories
  // const category1 = await prisma.category.create({
  //   data: {
  //     name: "Electronics",
  //     image: "https://images.unsplash.com/photo-1763713382836-e2263bff42b3",
  //   },
  // });

  // const category2 = await prisma.category.create({
  //   data: {
  //     name: "Clothing",
  //     image: "https://images.unsplash.com/photo-1763713382836-e2263bff42b3",
  //   },
  // });

  // // Seed SubCategories
  // const subCategory1 = await prisma.subCategory.create({
  //   data: {
  //     name: "Smartphones",
  //     categoryId: category1.id,
  //   },
  // });

  // const subCategory2 = await prisma.subCategory.create({
  //   data: {
  //     name: "Laptops",
  //     categoryId: category1.id,
  //   },
  // });

  // const subCategory3 = await prisma.subCategory.create({
  //   data: {
  //     name: "Shirts",
  //     categoryId: category2.id,
  //   },
  // });

  // // Seed Brands
  // const brand1 = await prisma.brand.create({
  //   data: {
  //     name: "Apple",
  //     image: "https://images.unsplash.com/photo-1763713382836-e2263bff42b3",
  //   },
  // });

  // const brand2 = await prisma.brand.create({
  //   data: {
  //     name: "Samsung",
  //     image: "https://images.unsplash.com/photo-1763713382836-e2263bff42b3",
  //   },
  // });

  // const brand3 = await prisma.brand.create({
  //   data: {
  //     name: "Nike",
  //     image: "https://images.unsplash.com/photo-1763713382836-e2263bff42b3",
  //   },
  // });

  // // Seed Products
  // const product1 = await prisma.product.create({
  //   data: {
  //     title: "iPhone 14",
  //     description: "Latest iPhone model",
  //     stock: 100,
  //     price: 999.99,
  //     imageCover:
  //       "https://images.unsplash.com/photo-1761578571404-f7e0fa2ff634",
  //     images: [
  //       "https://images.unsplash.com/photo-1763713382836-e2263bff42b3",
  //       "https://images.unsplash.com/photo-1763713382836-e2263bff42b3",
  //     ],
  //     priceAfterDiscount: 899.99,
  //     colors: ["Black", "White"],
  //     categoryId: category1.id,
  //     subCategoryId: subCategory1.id,
  //     brandId: brand1.id,
  //     ratingAverage: 4.5,
  //     ratingQuantity: 10,
  //   },
  // });

  // const product2 = await prisma.product.create({
  //   data: {
  //     title: "Galaxy S23",
  //     description: "Samsung flagship phone",
  //     stock: 50,
  //     price: 799.99,
  //     imageCover:
  //       "https://images.unsplash.com/photo-1761405378558-3688471ba000",
  //     images: ["https://images.unsplash.com/photo-1763713382836-e2263bff42b3"],
  //     priceAfterDiscount: 749.99,
  //     colors: ["Blue", "Red"],
  //     categoryId: category1.id,
  //     subCategoryId: subCategory1.id,
  //     brandId: brand2.id,
  //     ratingAverage: 4.2,
  //     ratingQuantity: 8,
  //   },
  // });

  // const product3 = await prisma.product.create({
  //   data: {
  //     title: "MacBook Pro",
  //     description: "Powerful laptop",
  //     stock: 20,
  //     price: 1999.99,
  //     imageCover:
  //       "https://images.unsplash.com/photo-1761405378558-3688471ba000",
  //     images: [
  //       "https://images.unsplash.com/photo-1763713382836-e2263bff42b3",
  //       "https://images.unsplash.com/photo-1763713382836-e2263bff42b3",
  //     ],
  //     priceAfterDiscount: 1899.99,
  //     colors: ["Silver"],
  //     categoryId: category1.id,
  //     subCategoryId: subCategory2.id,
  //     brandId: brand1.id,
  //     ratingAverage: 4.8,
  //     ratingQuantity: 15,
  //   },
  // });

  // const product4 = await prisma.product.create({
  //   data: {
  //     title: "Nike T-Shirt",
  //     description: "Comfortable cotton shirt",
  //     stock: 200,
  //     price: 29.99,
  //     imageCover:
  //       "https://images.unsplash.com/photo-1761405378558-3688471ba000",
  //     images: ["https://images.unsplash.com/photo-1763713382836-e2263bff42b3"],
  //     priceAfterDiscount: 24.99,
  //     colors: ["Black", "White", "Blue"],
  //     categoryId: category2.id,
  //     subCategoryId: subCategory3.id,
  //     brandId: brand3.id,
  //     ratingAverage: 4.0,
  //     ratingQuantity: 20,
  //   },
  // });

  // // Seed Reviews
  // await prisma.review.create({
  //   data: {
  //     userId: admin.id,
  //     productId: product1.id,
  //     reviewText: "Great phone, highly recommend!",
  //     rating: 4,
  //   },
  // });

  // await prisma.review.create({
  //   data: {
  //     userId: user2.id,
  //     productId: product2.id,
  //     reviewText: "Good value for money.",
  //     rating: 2,
  //   },
  // });

  // Seed Carts
  // const cart1 = await prisma.cart.create({
  //   data: {
  //     userId: user1.id,
  //     totalPrice: 999.99,
  //     subTotal: 899.99,
  //   },
  // });

  // const cart2 = await prisma.cart.create({
  //   data: {
  //     userId: admin.id,
  //     totalPrice: 829.98,
  //     subTotal: 774.98,
  //   },
  // });

  // // Seed CartItems
  // await prisma.cartItem.create({
  //   data: {
  //     cartId: cart1.id,
  //     productId: product1.id,
  //     quantity: 1,
  //     price: 899.99,
  //     total: 899.99,
  //   },
  // });

  // await prisma.cartItem.create({
  //   data: {
  //     cartId: cart2.id,
  //     productId: product2.id,
  //     quantity: 1,
  //     price: 774.98,
  //     total: 774.98,
  //   },
  // });

  // await prisma.cartItem.create({
  //   data: {
  //     cartId: cart2.id,
  //     productId: product4.id,
  //     quantity: 1,
  //     price: 29.99,
  //     total: 29.99,
  //   },
  // });

  // // Seed Coupons
  // const coupon1 = await prisma.coupon.create({
  //   data: {
  //     code: "SAVE10",
  //     discountType: "PERCENTAGE",
  //     discountValue: 10.0,
  //     maxUsage: 10,
  //     minOrderValue: 100,
  //     expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  //   },
  // });

  // const coupon2 = await prisma.coupon.create({
  //   data: {
  //     code: "WELCOME20",
  //     discountType: "PERCENTAGE",
  //     discountValue: 20.0,
  //     maxUsage: 10,
  //     minOrderValue: 100,
  //     expiredAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
  //   },
  // });

  // seed countries
  const country1 = await prisma.country.create({
    data: {
      name: "Egypt",
    },
  });

  // seed cities
  const city1 = await prisma.city.create({
    data: {
      name: "Cairo",
      countryId: country1.id,
      shippingPrice: 10.0,
    },
  });

  const city2 = await prisma.city.create({
    data: {
      name: "Alexandria",
      countryId: country1.id,
      shippingPrice: 15.0,
    },
  });

  const city3 = await prisma.city.create({
    data: {
      name: "Giza",
      countryId: country1.id,
      shippingPrice: 20.0,
    },
  });

  const city4 = await prisma.city.create({
    data: {
      name: "Asyut",
      countryId: country1.id,
      shippingPrice: 25.0,
    },
  });

  const city5 = await prisma.city.create({
    data: {
      name: "Aswan",
      countryId: country1.id,
      shippingPrice: 40.0,
    },
  });

  const city6 = await prisma.city.create({
    data: {
      name: "Luxor",
      countryId: country1.id,
      shippingPrice: 30.0,
    },
  });

  const city7 = await prisma.city.create({
    data: {
      name: "Mansoura",
      countryId: country1.id,
      shippingPrice: 20.0,
    },
  });

  // shipping address
  // const shippingAddress1 = await prisma.shippingAddress.create({
  //   data: {
  //     userId: user1.id,
  //     cityId: city1.id,
  //     address: "123 Main St",
  //     phone: "1234567890",
  //   },
  // });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
