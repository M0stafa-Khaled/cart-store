export interface ISignInInputs {
  email: string;
  password: string;
}

export interface IAuthRes extends IRefreshTokenRes {
  user: IUser;
}

export interface IRefreshTokenRes {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type APIRes<T = void> = {
  data?: T;
  error?:
    | string
    | {
        field: string;
        errors: string[];
      }[];
  message: string;
  statusCode?: number;
  success: boolean;
};

export interface IPaginationMeta {
  count: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type IPaginatedRes<T> = APIRes<{
  items: T[];
  meta: IPaginationMeta;
}>;

export interface IPaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone: string | null;
  avatar: string | null;
  gender: Gender;
  active: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  shippingAddresses: IShippingAddress[];
}

export type Role = "USER" | "ADMIN";
export type Gender = "MALE" | "FEMALE";

export interface IUserParams extends IPaginationParams {
  q?: string | null;
  role?: string | null;
  active?: boolean | null;
  isVerified?: boolean | null;
}

export interface ICountry {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICountryParams {
  name?: string | null;
}

export interface ICity {
  id: string;
  name: string;
  shippingPrice: number;
  createdAt: string;
  updatedAt: string;
  country: ICountry;
}

export interface ICityParams {
  name?: string | null;
  country?: string | null;
  sort?: string | null;
}

export type DiscountType = "PERCENTAGE" | "FIXED";

export interface ICoupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  maxUsage: number;
  usedCount: number;
  minOrderValue: number;
  expiredAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICouponParams extends IPaginationParams {
  code?: string | null;
}

export interface IBrand {
  id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  _count?: { products: number };
}

export interface IBrandParams {
  name?: string | null;
  sort?: string | null;
}

export interface ICategory {
  id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  _count?: { products: number };
}

export interface ICategoryParams {
  sort?: string | null;
  name?: string | null;
}

export interface ISubCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  category: ICategory;
  _count?: { products: number };
}

export interface ISubCategoryParams {
  name?: string | null;
  sort?: string | null;
  category?: string | null;
}

export interface IProduct {
  id: string;
  title: string;
  description: string;
  stock: number;
  imageCover: string;
  images: string[];
  price: number;
  priceAfterDiscount: number;
  discountType: DiscountType;
  discountValue: number;
  sold: number;
  colors: string[] | null;
  sizes: string[] | null;
  ratingAverage: number;
  ratingQuantity: number;
  createdAt: string;
  updatedAt: stirng;
  category: ICategory;
  subCategory: ISubCategory;
  brand: IBrand;
  reviews: IReview[];
}

export interface IReview {
  id: string;
  reviewText: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  product: IProduct;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface IReviewParams extends IPaginationParams {
  user?: string | null;
  product?: string | null;
  minRating?: string | null;
  maxRating?: strnig | null;
}

export interface IProductParams extends IPaginationParams {
  search?: string | null; // search in title, description, and brand
  title?: string | null;
  category?: string | null;
  subCategory?: string | null;
  brand?: string | null;
  reviews?: boolean | null;
  minPrice?: string | null;
  maxPrice?: string | null;
}

export interface ICart {
  id: string;
  subTotal: number;
  discount: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  coupon: ICoupon | null;
  cartItems: ICartItem[];
}

export interface ICartItem {
  id: string;
  price: number;
  quantity: number;
  color?: string | null;
  size?: string | null;
  total: number;
  product: IProduct;
}

export interface IShippingAddress {
  id: string;
  city: ICity;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = "CASH" | "CREDIT_CARD";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface IOrder {
  id: string;
  orderNumber: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  discount: number;
  shippingAddress: IShippingAddress;
  shippingCost: number;
  subTotal: number;
  totalPrice: number;
  status: OrderStatus;
  isPaid: boolean;
  isDelivered: boolean;
  deliveredAt: null | string;
  createdAt: string;
  updatedAt: string;
  coupon: null | ICoupon;
  user: IUser;
  orderItems: IOrderItem[];
}

export interface IOrderItem {
  id: string;
  price: number;
  quantity: number;
  color: string | null;
  size: null | string;
  total: number;
  createdAt: string;
  updatedAt: string;
  product: IProduct;
}

export interface IOrderParams extends IPaginationParams {
  isDelivered?: string | null;
  isPaid?: string | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  status?: string | null;
  user?: string | null;
}

export interface IHomePage {
  categories: ICategory[];
  featuredProducts: IProduct[];
  flashSale: IProduct[];
  newArrivals: IProduct[];
  brands: IBrand[];
}

export interface IDashboardData {
  summary: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalReviews: number;
    totalCategories: number;
    totalSubCategories: number;
    totalBrands: number;
    totalCoupons: number;
    activeUsers: number;
    recentUsers: IUser[];
    totalRevenue: number;
  };
  period: {
    startDate: string;
    endDate: string;
    revenue: number;
    orders: number;
    newUsers: number;
    reviews: number;
    pendingOrders: number;
    completedOrders: number;
  };
  charts: {
    sales: {
      date: string;
      revenue: number;
      orders: number;
    }[];
  };
  topProducts: {
    id: string;
    title: string;
    sold: number;
    price: number;
    imageCover: string;
  }[];
}

export interface IAnalyticsParams {
  startDate?: string;
  endDate?: string;
}
