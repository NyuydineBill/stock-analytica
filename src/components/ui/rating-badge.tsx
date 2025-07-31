import { cn } from "@/lib/utils";

interface RatingBadgeProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const RatingBadge = ({ rating, size = "md", className }: RatingBadgeProps) => {
  const getRatingInfo = (rating: number) => {
    if (rating >= 3) return { label: "Strong Buy", color: "rating-strong-buy" };
    if (rating >= 1) return { label: "Buy", color: "rating-buy" };
    if (rating === 0) return { label: "Neutral", color: "rating-neutral" };
    if (rating >= -2) return { label: "Sell", color: "rating-sell" };
    return { label: "Strong Sell", color: "rating-strong-sell" };
  };

  const { label, color } = getRatingInfo(rating);

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const colorClasses = {
    "rating-strong-sell": "bg-rating-strong-sell",
    "rating-sell": "bg-rating-sell",
    "rating-neutral": "bg-rating-neutral",
    "rating-buy": "bg-rating-buy",
    "rating-strong-buy": "bg-rating-strong-buy"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium text-white",
        colorClasses[color as keyof typeof colorClasses],
        sizeClasses[size],
        className
      )}
    >
      {rating > 0 ? "+" : ""}{rating} {label}
    </span>
  );
};

export default RatingBadge;