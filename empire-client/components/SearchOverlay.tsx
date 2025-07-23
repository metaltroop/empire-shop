// empire-client/components/SearchOverlay.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

// 🟡 Update this path if needed
import products from "@/data/real_products.json";

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const recentSearches = ["Custom Gaming PC", "Gaming Mouse"];

  const filteredSuggestions = query
    ? products
        .filter((product) =>
          product.prodName.toLowerCase().includes(query.toLowerCase())
        )
        .map((p) => p.prodName)
        .slice(0, 5)
    : recentSearches;

  useEffect(() => {
    if (!window.visualViewport) return;

    const handleVisualViewportChange = () => {
      const isKeyboard =
        window.innerHeight - window.visualViewport!.height > 100;
      setIsKeyboardVisible(isKeyboard);

      if (isKeyboard && containerRef.current) {
        requestAnimationFrame(() => {
          containerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        });
      }
    };

    window.visualViewport?.addEventListener(
      "resize",
      handleVisualViewportChange
    );
    window.visualViewport?.addEventListener(
      "scroll",
      handleVisualViewportChange
    );

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        handleVisualViewportChange
      );
      window.visualViewport?.removeEventListener(
        "scroll",
        handleVisualViewportChange
      );
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setIsKeyboardVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const BOTTOM_NAV_HEIGHT = 64;

  const handleSearchSubmit = () => {
    if (query.trim()) {
      router.push(`/products/search/${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <div
      className={`
        fixed inset-0 z-[60]
        transition-all duration-300 ease-out
        ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
    >
      {/* Overlay */}
      <div
        className={`
          fixed inset-x-0 top-0 bg-black/30 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
        style={{ height: `calc(80% + ${BOTTOM_NAV_HEIGHT}px)` }}
        onClick={onClose}
      />

      {/* Search Panel */}
      <div
        ref={containerRef}
        className={`
          fixed inset-x-0 bottom-0
          bg-white rounded-t-[32px]
          shadow-2xl 
          transition-all duration-300 ease-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
        style={{
          height: isKeyboardVisible ? "auto" : "fit-content",
          maxHeight: isKeyboardVisible
            ? `calc(100vh - ${BOTTOM_NAV_HEIGHT}px)`
            : "auto",
        }}
      >
        {/* Search Bar */}
        <div className="flex items-center p-4 border-b border-gray-100">
          <div className="flex-1 flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
            <Search className="text-gray-400" size={18} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything..."
              className="flex-1 bg-transparent outline-none text-base min-w-0"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit();
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={14} className="text-gray-500" />
              </button>
            )}
            {query && (
              <button
                onClick={handleSearchSubmit}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <ArrowRight size={18} className="text-blue-500" />
              </button>
            )}
          </div>
        </div>

        {/* Suggestions */}
        <div className="overflow-hidden">
          <div className="p-4 space-y-2">
            <h3 className="text-sm font-medium text-gray-500 px-2 mb-2">
              {query ? "Suggestions" : "Recent Searches"}
            </h3>
            {filteredSuggestions.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  router.push(`/products/search/${encodeURIComponent(item)}`);
                  onClose();
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 
                  rounded-lg flex items-center gap-3 transition-colors"
              >
                <Search size={16} className="text-gray-400" />
                <span className="flex-1">{item}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
