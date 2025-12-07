"use client";

import { APIRes, ICart, ICartItem, ICoupon } from "@/interfaces";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  getCartAction,
  addToCartItemAction,
  updateCartItemAction,
  removeCartItemAction,
  applyCouponToCartAction,
  removeCouponFromCartAction,
} from "@/actions/cart.actions";
import { toast } from "sonner";
import { handleActionError } from "@/lib/error-handlers";
import { useSession } from "@/hooks/use-session";
import { usePathname, useRouter } from "next/navigation";

interface CartContextType {
  cart: ICart | null;
  cartItems: ICartItem[];
  isLoading: boolean;
  error: string | null;
  subTotal: number;
  discount: number;
  totalPrice: number;
  coupon: ICoupon | null;
  itemCount: number;

  // Cart operations
  fetchCart: () => Promise<void>;
  addToCart: (item: {
    productId: string;
    quantity: number;
    color?: string;
    size?: string;
  }) => Promise<void>;
  updateCartItem: (itemId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => void;

  // Coupon operations
  applyCoupon: (couponCode: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [cart, setCart] = useState<ICart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await getCartAction();

      if (res.success && res.data) {
        setCart(res.data);
      } else {
        setError(res.message || "Failed to fetch cart");
        setCart(null);
      }
    } catch (_) {
      setError("An error occurred while fetching the cart");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch cart on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchCart();
  }, [fetchCart, isAuthenticated]);

  const addToCart = useCallback(
    async (item: {
      productId: string;
      quantity: number;
      color?: string;
      size?: string;
    }) => {
      if (!isAuthenticated) {
        toast.warning("Please sign in to add this product to cart");
        return router.push(`/auth/sign-in?callbackUrl=${pathname}`);
      }
      if (!cart) return;

      setError(null);
      setIsLoading(true);
      toast.loading("Adding to cart...", { id: "add-to-cart" });

      try {
        const res = await addToCartItemAction(item);

        if (res.success) {
          await fetchCart();
          toast.success(res.message || "Product added to cart successfully.", {
            id: "add-to-cart",
          });
        } else {
          setError(res.message || "Failed to add item to cart");
          toast.error(res.message || "Failed to add item to cart", {
            id: "add-to-cart",
          });
        }
      } catch (err) {
        setError("An error occurred while adding item to cart");
        handleActionError(err as APIRes);
        toast.error("An error occurred while adding item to cart", {
          id: "add-to-cart",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [cart, fetchCart, pathname, router, isAuthenticated]
  );

  const updateCartItem = useCallback(
    async (itemId: string, quantity?: number) => {
      if (!cart || quantity === undefined) return;

      setError(null);

      toast.loading("Updating cart...", { id: `update-${itemId}` });

      try {
        const res = await updateCartItemAction(itemId, { quantity });

        if (res.success) {
          await fetchCart();
          toast.success(res.message || "Cart updated successfully.", {
            id: `update-${itemId}`,
          });
        } else {
          setError(res.message || "Failed to update cart item");
          toast.error(res.message || "Failed to update cart item", {
            id: `update-${itemId}`,
          });
        }
      } catch (err) {
        setError("An error occurred while updating cart item");
        handleActionError(err as APIRes);
        toast.error("An error occurred while updating cart item", {
          id: `update-${itemId}`,
        });
      }
    },
    [cart, fetchCart]
  );

  const removeFromCart = useCallback(
    async (itemId: string) => {
      if (!cart) return;

      setError(null);

      toast.loading("Removing item...", { id: `remove-${itemId}` });

      try {
        const res = await removeCartItemAction(itemId);

        if (res.success) {
          await fetchCart();
          toast.success("Item removed from cart", { id: `remove-${itemId}` });
        } else {
          setError(res.message || "Failed to remove item from cart");
          toast.error(res.message || "Failed to remove item from cart", {
            id: `remove-${itemId}`,
          });
        }
      } catch (err) {
        setError("An error occurred while removing item from cart");
        handleActionError(err as APIRes);
        toast.error("An error occurred while removing item from cart", {
          id: `remove-${itemId}`,
        });
      }
    },
    [cart, fetchCart]
  );

  const clearCart = useCallback(() => {
    if (!isAuthenticated) {
      toast.warning("Please sign in to add this product to cart");
      return router.push(`/auth/sign-in?callbackUrl=${pathname}`);
    }
    setCart(null);
    setError(null);
    for (const item of cart?.cartItems || []) {
      removeFromCart(item.id);
    }
  }, [removeFromCart, cart, isAuthenticated, pathname, router]);

  const applyCoupon = useCallback(
    async (couponCode: string) => {
      if (!cart) return;

      setError(null);
      toast.loading("Applying coupon...", { id: "apply-coupon" });

      try {
        const res = await applyCouponToCartAction(couponCode);

        if (res.success) {
          await fetchCart();
          toast.success(res.message, { id: "apply-coupon" });
        } else {
          setError(res.message || "Failed to apply coupon");
          toast.error(res.message || "Failed to apply coupon", {
            id: "apply-coupon",
          });
        }
      } catch (err) {
        setError("An error occurred while applying coupon");
        handleActionError(err as APIRes);
        toast.error("An error occurred while applying coupon", {
          id: "apply-coupon",
        });
      }
    },
    [cart, fetchCart]
  );

  const removeCoupon = useCallback(async () => {
    if (!cart) return;

    setError(null);

    toast.loading("Removing coupon...", { id: "remove-coupon" });

    try {
      const res = await removeCouponFromCartAction();

      if (res.success) {
        await fetchCart();
        toast.success("Coupon removed", { id: "remove-coupon" });
      } else {
        setError(res.message || "Failed to remove coupon");
        toast.error(res.message || "Failed to remove coupon", {
          id: "remove-coupon",
        });
      }
    } catch (_err) {
      setError("An error occurred while removing coupon");
      toast.error("An error occurred while removing coupon", {
        id: "remove-coupon",
      });
    }
  }, [cart, fetchCart]);

  const cartItems = cart?.cartItems || [];
  const subTotal = cart?.subTotal || 0;
  const discount = cart?.discount || 0;
  const totalPrice = cart?.totalPrice || 0;
  const coupon = cart?.coupon || null;
  const itemCount = cart?.cartItems.length || 0;

  const value: CartContextType = {
    cart,
    cartItems,
    isLoading,
    error,
    subTotal,
    discount,
    totalPrice,
    coupon,
    itemCount,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
