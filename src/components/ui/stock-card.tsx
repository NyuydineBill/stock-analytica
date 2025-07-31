import { Card, CardContent, CardHeader } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { FileText, TrendingUp } from "lucide-react";
import RatingBadge from "./rating-badge";

interface StockCardProps {
  symbol: string;
  name: string;
  sector?: string;
  exchange?: string;
  country?: string;
  rating?: number;
  hasReport?: boolean;
  onAnalyze?: () => void;
  onViewReport?: () => void;
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
  onAnalyze,
  onViewReport,
  className
}: StockCardProps) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{symbol}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{name}</p>
          </div>
          {rating !== undefined && (
            <RatingBadge rating={rating} size="sm" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {sector && <Badge variant="secondary">{sector}</Badge>}
          {exchange && <Badge variant="outline">{exchange}</Badge>}
          {country && <Badge variant="outline">{country}</Badge>}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAnalyze}
            className="flex-1"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Analyze
          </Button>
          {hasReport && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onViewReport}
            >
              <FileText className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockCard;