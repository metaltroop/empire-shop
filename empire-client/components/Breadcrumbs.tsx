"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@/types";

interface BreadcrumbsProps {
  searchterm?: string;
  productName?: string;
  categoryId?: string;
}

export default function Breadcrumbs({
  searchterm,
  productName,
  categoryId,
}: BreadcrumbsProps) {
  const pathname = usePathname();

  // Determine if we're on a product detail page
  const isProductDetail = pathname.startsWith("/products/detail/");

  // Determine if we're on a search results page
  const isSearchResults = pathname.startsWith("/products/search/");

  // Get category name if provided
  const categoryName = categoryId
    ? PRODUCT_CATEGORIES[categoryId as keyof typeof PRODUCT_CATEGORIES]
    : undefined;

  return (
    <nav className="flex items-center text-sm">
      <Link
        href="/"
        className="text-gray-500 hover:text-gray-700 flex items-center"
      >
        <Home size={14} className="mr-1" />
        Home
      </Link>

      {/* Search Results Breadcrumb */}
      {isSearchResults && searchterm && (
        <>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="text-gray-900 font-medium">
            Search: {searchterm}
          </span>
        </>
      )}

      {/* Product Detail Breadcrumbs */}
      {isProductDetail && (
        <>
          {/* Category Link (if available) */}
          {categoryId && categoryName && (
            <>
              <ChevronRight size={14} className="mx-2 text-gray-400" />
              <Link
                href={`/products/search/${categoryName.toLowerCase()}`}
                className="text-gray-500 hover:text-gray-700"
              >
                {categoryName}
              </Link>
            </>
          )}

          {/* Product Name */}
          {productName && (
            <>
              <ChevronRight size={14} className="mx-2 text-gray-400" />
              <span className="text-gray-900 font-medium truncate max-w-[200px]">
                {productName}
              </span>
            </>
          )}
        </>
      )}
    </nav>
  );
}
