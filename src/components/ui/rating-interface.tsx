import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Label } from "./label";
import { Badge } from "./badge";
import { Save, TrendingUp, TrendingDown, Minus, Plus } from "lucide-react";

interface RatingInterfaceProps {
  symbol: string;
  name: string;
  currentRating?: number;
  onSaveRating: (rating: number, notes: string) => void;
  className?: string;
}

const RatingInterface = ({ 
  symbol, 
  name, 
  currentRating, 
  onSaveRating, 
  className 
}: RatingInterfaceProps) => {
  const [rating, setRating] = useState(currentRating || 0);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const getRatingInfo = (rating: number) => {
    if (rating >= 3) return { 
      label: "Strong Buy", 
      color: "bg-green-500 text-white",
      description: "High conviction positive view",
      icon: TrendingUp
    };
    if (rating >= 1) return { 
      label: "Buy", 
      color: "bg-blue-500 text-white",
      description: "Positive bias",
      icon: TrendingUp
    };
    if (rating === 0) return { 
      label: "Neutral", 
      color: "bg-gray-500 text-white",
      description: "No strong conviction either way",
      icon: Minus
    };
    if (rating >= -2) return { 
      label: "Sell", 
      color: "bg-orange-500 text-white",
      description: "Negative bias",
      icon: TrendingDown
    };
    return { 
      label: "Strong Sell", 
      color: "bg-red-500 text-white",
      description: "High conviction negative view",
      icon: TrendingDown
    };
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveRating(rating, notes);
    } finally {
      setIsSaving(false);
    }
  };

  const { label, color, description, icon: Icon } = getRatingInfo(rating);

  return (
    <Card className={`border-0 shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Manual Stock Rating</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stock Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{symbol}</h3>
              <p className="text-gray-600">{name}</p>
            </div>
            <Badge className={color}>
              <Icon className="w-3 h-3 mr-1" />
              {label}
            </Badge>
          </div>
        </div>

        {/* Rating Slider */}
        <div className="space-y-4">
          <Label className="text-base font-semibold text-gray-900">Rating Scale (-5 to +5)</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Strong Sell (-5 to -3)</span>
              <span>Strong Buy (+3 to +5)</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="-5"
                max="5"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>-5</span>
                <span>-3</span>
                <span>-1</span>
                <span>0</span>
                <span>+1</span>
                <span>+3</span>
                <span>+5</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRating(Math.max(-5, rating - 1))}
                disabled={rating <= -5}
                className="border-gray-300 hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {rating > 0 ? '+' : ''}{rating}
                </div>
                <div className="text-sm text-gray-600">{description}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRating(Math.min(5, rating + 1))}
                disabled={rating >= 5}
                className="border-gray-300 hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Rating Notes */}
        <div className="space-y-2">
          <Label className="text-base font-semibold text-gray-900">Rating Notes (Optional)</Label>
          <Textarea
            placeholder="Explain your rating rationale, key factors, or investment thesis..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Rating'}
        </Button>

        {/* Rating Guidelines */}
        <div className="bg-blue-50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-blue-900">Rating Guidelines</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div><strong>+3 to +5:</strong> Strong Buy - High conviction positive view</div>
            <div><strong>+1 to +2:</strong> Buy - Positive bias</div>
            <div><strong>0:</strong> Neutral - No strong conviction either way</div>
            <div><strong>-1 to -2:</strong> Sell - Negative bias</div>
            <div><strong>-3 to -5:</strong> Strong Sell - High conviction negative view</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingInterface; 