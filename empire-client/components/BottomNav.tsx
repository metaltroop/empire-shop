// empire-client/components/BottomNav.tsx
"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Settings, Search, ShoppingCart, User, List } from "lucide-react";
import SearchOverlay from "./SearchOverlay";
import { useCart } from "@/contexts/CartContext";

export default function BottomNav() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();

  // Close search overlay when navigating away
  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  // Define navItems with useMemo to prevent recreating on each render
  const navItems = useMemo(
    () => [
      { label: "Home", icon: Home, href: "/" },
      { label: "Part Picker", icon: List, href: "/PartPicker" },
      {
        label: "Search",
        icon: Search,
        href: "#",
        onClick: handleSearchOpen,
      },
      { label: "Cart", icon: ShoppingCart, href: "/cart", badge: itemCount > 0 ? itemCount : undefined },
      { label: "Profile", icon: User, href: "/profile" },
    ],
    [itemCount]
  );

  // Prefetch all routes on mount
  useEffect(() => {
    const routesToPrefetch = ["/", "/PartPicker", "/cart", "/profile"];
    routesToPrefetch.forEach((route) => {
      router.prefetch(route);
    });
  }, [router]);

  const renderNavItem = useMemo(
    () => (item: (typeof navItems)[0] & { badge?: number }) => {
      const isActive = pathname === item.href;
      const Icon = item.icon;
      const showBadge = item.badge !== undefined;

      // Base classes that don't change
      const baseButtonClasses =
        "relative flex flex-col items-center justify-center w-16 h-14 transition-all duration-300 ease-out";
      const baseIconClasses = "transition-all duration-300";
      const baseTextClasses =
        "mt-1 text-xs font-medium transition-colors duration-300";
      const baseIndicatorClasses =
        "absolute -bottom-2 w-1/2 h-0.5 bg-blue-500 transition-all duration-300";

      if (item.onClick) {
        return (
          <button
            key={item.label}
            onClick={item.onClick}
            className={baseButtonClasses}
          >
            <Icon
              className={`${baseIconClasses} ${
                isActive
                  ? "stroke-blue-500 fill-blue-500 scale-110"
                  : "stroke-gray-500 scale-100"
              }`}
              size={24}
            />
            <span
              className={`${baseTextClasses} ${
                isActive ? "text-blue-500" : "text-gray-500"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      }

      return (
        <Link
          key={item.href}
          href={item.href}
          prefetch={true}
          className={`${baseButtonClasses} ${
            isActive ? "transform -translate-y-1" : ""
          }`}
        >
          <div className="relative">
            <div
              className={`absolute inset-0 -z-10 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-blue-100 scale-150 opacity-100"
                  : "opacity-0 scale-50"
              }`}
            />
            <Icon
              className={`${baseIconClasses} ${
                isActive
                  ? "stroke-blue-500 fill-blue-500 scale-110"
                  : "stroke-gray-500 scale-100"
              }`}
              size={24}
            />
            {showBadge && (
              <div className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-red-500 rounded-full px-1">
                {item.badge! > 99 ? '99+' : item.badge}
              </div>
            )}
          </div>
          <span
            className={`${baseTextClasses} ${
              isActive ? "text-blue-500" : "text-gray-500"
            }`}
          >
            {item.label}
          </span>
          <div
            className={`${baseIndicatorClasses} ${
              isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          />
        </Link>
      );
    },
    [pathname]
  );

  return (
    <>
      <SearchOverlay isOpen={isSearchOpen} onClose={handleSearchClose} />

      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg z-50 rounded-t-xl">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-around items-center py-2">
            {navItems.map(renderNavItem)}
          </div>
        </div>
      </nav>
    </>
  );
}
