import { Card, CardContent, CardHeader } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { FileText, TrendingUp, ExternalLink } from "lucide-react";
import RatingBadge from "./rating-badge";

interface StockCardProps {
  symbol: string;
  name: string;
  sector?: string;
  exchange?: string;
  country?: string;
  rating?: number;
  hasReport?: boolean;
  currentPrice?: number;
  priceChange?: number;
  priceChangePercent?: number;
  onAnalyze?: () => void;
  onViewReport?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
  className?: string;
}

const StockCard = ({
  symbol,
  name,
  sector,
  exchange,
  country,
  rating,
  hasReport = false,
  currentPrice,
  priceChange,
  priceChangePercent,
  onAnalyze,
  onViewReport,
  onSelect,
  isSelected = false,
  className
}: StockCardProps) => {
  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-md hover:scale-105 ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''} ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {onSelect && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={onSelect}
                className="mt-1"
              />
            )}
            <div className="space-y-1">
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">{symbol}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{name}</p>
            </div>
          </div>
          {rating !== undefined && (
            <RatingBadge rating={rating} size="sm" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {sector && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 transition-colors">
              {sector}
            </Badge>
          )}
          {exchange && (
            <Badge variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
              {exchange}
            </Badge>
          )}
          {country && (
            <Badge variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
              {country}
            </Badge>
          )}
        </div>

        {/* Price Information */}
        {currentPrice && (
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-gray-900">
              ${currentPrice.toFixed(2)}
            </div>
            {priceChange !== undefined && priceChangePercent !== undefined && (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                priceChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAnalyze}
            className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-600 transition-all duration-200 group-hover:shadow-md"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Analyze
          </Button>
          {hasReport && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onViewReport}
              className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 hover:border-blue-300 transition-all duration-200 group-hover:shadow-md"
            >
              <FileText className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {hasReport && (
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            Report Available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockCard;