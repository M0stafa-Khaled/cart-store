import { IProduct } from "@/interfaces";
export const NODE_ENV = process.env.NODE_ENV;

export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

export const API_ROUTES = {
  AUTH: {
    SIGN_IN: "/auth/sign-in",
    SIGN_UP: "/auth/sign-up",
    SIGNOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },
  HOME: {
    PAGE: "/homepage",
    CATEGORIES: "/homepage/categories",
  },
  PROFILE: "/profile",
  USERS: "/users",
  COUNTRIES: "/countries",
  CITIES: "/cities",
  COUPONS: "/coupons",
  BRANDS: "/brands",
  CATEGORIES: "/categories",
  SUB_CATEGORIES: "/sub-categories",
  PRODUCTS: "/products",
  REVIEWS: "/reviews",
  SHIPPING_ADDRESSES: "/shipping-addresses",
  CART: {
    MAIN: "/cart",
    APPLY_COUPON: "/cart/coupon/apply",
    REMOVE_COUPON: "/cart/coupon/remove",
  },
  ORDERS: {
    ADMIN: {
      MAIN: "/orders",
      USER: "/orders/user",
    },
    USER: {
      MY_ORDERS: "/orders/my-orders",
      CHECKOUT: "/orders/checkout",
    },
  },
  ANALYTICS: "/analytics",
};

export const MOCK_PRODUCTS: IProduct[] = [
  {
    id: "mock-1",
    title: "Premium Wireless Headphones",
    description:
      "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation and 30-hour battery life.",
    stock: 50,
    imageCover:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop",
    ],
    price: 299.99,
    priceAfterDiscount: 249.99,
    discountType: "FIXED",
    discountValue: 50,
    sold: 120,
    colors: ["Black", "Silver", "Blue"],
    sizes: null,
    ratingAverage: 4.5,
    ratingQuantity: 89,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      id: "cat-1",
      name: "Electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    subCategory: {
      id: "subcat-1",
      name: "Audio",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: {
        id: "cat-1",
        name: "Electronics",
        image:
          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    brand: {
      id: "brand-1",
      name: "TechSound",
      image:
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    reviews: [],
  },
  {
    id: "mock-2",
    title: "Classic Leather Backpack",
    description:
      "Handcrafted genuine leather backpack with multiple compartments, perfect for work or travel. Timeless design meets modern functionality.",
    stock: 35,
    imageCover:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=600&fit=crop",
    ],
    price: 189.99,
    priceAfterDiscount: 151.99,
    discountType: "PERCENTAGE",
    discountValue: 20,
    sold: 78,
    colors: ["Brown", "Black", "Tan"],
    sizes: null,
    ratingAverage: 4.7,
    ratingQuantity: 124,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      id: "cat-2",
      name: "Fashion",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    subCategory: {
      id: "subcat-2",
      name: "Bags",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: {
        id: "cat-2",
        name: "Fashion",
        image:
          "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    brand: {
      id: "brand-2",
      name: "LeatherCraft",
      image:
        "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=200&h=200&fit=crop",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    reviews: [],
  },
  {
    id: "mock-3",
    title: "Smart Fitness Watch",
    description:
      "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, and 7-day battery life.",
    stock: 100,
    imageCover:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=600&fit=crop",
    ],
    price: 349.99,
    priceAfterDiscount: 279.99,
    discountType: "FIXED",
    discountValue: 70,
    sold: 245,
    colors: ["Black", "Silver", "Rose Gold"],
    sizes: ["Small", "Medium", "Large"],
    ratingAverage: 4.6,
    ratingQuantity: 312,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      id: "cat-1",
      name: "Electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    subCategory: {
      id: "subcat-3",
      name: "Wearables",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: {
        id: "cat-1",
        name: "Electronics",
        image:
          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    brand: {
      id: "brand-3",
      name: "FitTech",
      image:
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    reviews: [],
  },
  {
    id: "mock-4",
    title: "Minimalist Desk Lamp",
    description:
      "Modern LED desk lamp with adjustable brightness and color temperature. Perfect for your workspace with sleek minimalist design.",
    stock: 65,
    imageCover:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=600&fit=crop",
    ],
    price: 79.99,
    priceAfterDiscount: 59.99,
    discountType: "PERCENTAGE",
    discountValue: 25,
    sold: 156,
    colors: ["White", "Black", "Gray"],
    sizes: null,
    ratingAverage: 4.4,
    ratingQuantity: 98,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      id: "cat-3",
      name: "Home & Living",
      image:
        "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=400&fit=crop",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    subCategory: {
      id: "subcat-4",
      name: "Lighting",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: {
        id: "cat-3",
        name: "Home & Living",
        image:
          "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=400&fit=crop",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    brand: {
      id: "brand-4",
      name: "LightCo",
      image:
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    reviews: [],
  },
];
