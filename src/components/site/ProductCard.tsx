// ProductCard.tsx
import React from "react";

type ProductCardProps = {
  id?: string | number;
  title: string;
  imageUrl: string;
  priceEUR: number | string;
  oldPriceEUR?: number | string;
  rating?: number; // 0–5
  reviewsCount?: number;
  badge?: string; // e.g. "New", "Sale"
  onAddToCart?: () => void;
  onClick?: () => void; // open details
  currency?: string; // default "€"
  className?: string;
};

export default function ProductCard({
  title,
  imageUrl,
  priceEUR,
  oldPriceEUR,
  rating = 0,
  reviewsCount,
  badge,
  onAddToCart,
  onClick,
  currency = "€",
  className = "",
}: ProductCardProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));

  return (
    <article
      className={`group relative w-full max-w-sm overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg ${className}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      aria-label={`View details for ${title}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {badge}
          </span>
        )}
        {/* Subtle gradient at bottom for text legibility on images */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-gray-900">
          {title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {stars.map((filled, idx) => (
              <svg
                key={idx}
                viewBox="0 0 24 24"
                className={`h-4 w-4 ${
                  filled ? "fill-yellow-400" : "fill-gray-200"
                }`}
                aria-hidden="true"
              >
                <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          {reviewsCount !== undefined && (
            <span className="text-xs text-gray-500">({reviewsCount})</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            {currency}
            {priceEUR}
          </span>
          {oldPriceEUR && (
            <span className="text-sm text-gray-400 line-through">
              {currency}
              {oldPriceEUR}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.();
            }}
            className="flex-1 rounded-xl border border-gray-200 bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:translate-y-[-1px] hover:shadow"
            aria-label={`Add ${title} to cart`}
          >
            Add to cart
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            aria-label={`View ${title} details`}
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}
