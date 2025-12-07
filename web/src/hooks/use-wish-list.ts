"use client";

import { IProduct } from "@/interfaces";
import { useSyncExternalStore, useMemo } from "react";
import { toast } from "sonner";

const WISHLIST_STORAGE_KEY = "wishlist_storage";

// Subscribe to store changes
const subscribe = (callback: () => void) => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === WISHLIST_STORAGE_KEY) {
      callback();
    }
  };

  // Listen for cross-tab changes
  window.addEventListener("storage", handleStorageChange);
  // Listen for custom events within the same tab
  window.addEventListener("wishlist-updated", callback);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener("wishlist-updated", callback);
  };
};

const getSnapshot = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(WISHLIST_STORAGE_KEY);
};

// Server snapshot (always empty/null)
const getServerSnapshot = () => null;

export const useWishList = () => {
  const itemsJson = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const items = useMemo(() => {
    if (!itemsJson) return [];
    try {
      return JSON.parse(itemsJson) as IProduct[];
    } catch (error) {
      console.error("Failed to parse wishlist", error);
      return [];
    }
  }, [itemsJson]);

  const addToWishlist = (product: IProduct) => {
    setTimeout(() => {
      try {
        const exists = items.some((item) => item.id === product.id);
        if (exists) {
          toast.info("Product already in wishlist");
          return;
        }

        const newItems = [...items, product];
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newItems));
        window.dispatchEvent(new Event("wishlist-updated"));
        toast.success("Added to wishlist");
      } catch (error) {
        console.error("Error adding to wishlist", error);
        toast.error("Failed to add to wishlist");
      }
    }, 300);
  };

  const removeFromWishlist = (productId: string) => {
    setTimeout(() => {
      try {
        const newItems = items.filter((item) => item.id !== productId);
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newItems));
        window.dispatchEvent(new Event("wishlist-updated"));
        toast.success("Removed from wishlist");
      } catch (error) {
        console.error("Error removing from wishlist", error);
        toast.error("Failed to remove from wishlist");
      }
    }, 300);
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    setTimeout(() => {
      try {
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
        window.dispatchEvent(new Event("wishlist-updated"));
        toast.success("Wishlist cleared");
      } catch (error) {
        console.error("Error clearing wishlist", error);
      }
    }, 300);
  };

  return {
    items,
    count: items.length,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };
};
