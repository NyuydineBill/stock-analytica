import React, { useState } from 'react';
import { Star, Save, History, Edit3, X, Check, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Textarea } from './textarea';
import { Slider } from './slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';

interface RatingHistory {
  id: string;
  rating: number;
  notes: string;
  timestamp: Date;
}

interface StockRatingProps {
  symbol: string;
  name: string;
  currentRating?: number;
  currentNotes?: string;
  ratingHistory?: RatingHistory[];
  onRatingChange: (rating: number, notes: string) => void;
  onRatingHistory?: (history: RatingHistory[]) => void;
}

const StockRating: React.FC<StockRatingProps> = ({
  symbol,
  name,
  currentRating = 0,
  currentNotes = '',
  ratingHistory = [],
  onRatingChange,
  onRatingHistory
}) => {
  const [rating, setRating] = useState(currentRating);
  const [notes, setNotes] = useState(currentNotes);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [tempRating, setTempRating] = useState(currentRating);
  const [tempNotes, setTempNotes] = useState(currentNotes);

  const ratingScale = [
    { value: -5, label: "Strong Sell", description: "High conviction negative view", color: "bg-gray-400" },
    { value: -4, label: "Sell", description: "Negative bias", color: "bg-gray-500" },
    { value: -3, label: "Sell", description: "Negative bias", color: "bg-gray-500" },
    { value: -2, label: "Underweight", description: "Slight negative bias", color: "bg-gray-600" },
    { value: -1, label: "Underweight", description: "Slight negative bias", color: "bg-gray-600" },
    { value: 0, label: "Neutral", description: "No strong conviction", color: "bg-gray-700" },
    { value: 1, label: "Overweight", description: "Slight positive bias", color: "bg-gray-800" },
    { value: 2, label: "Overweight", description: "Slight positive bias", color: "bg-gray-800" },
    { value: 3, label: "Buy", description: "Positive bias", color: "bg-gray-900" },
    { value: 4, label: "Buy", description: "Positive bias", color: "bg-gray-900" },
    { value: 5, label: "Strong Buy", description: "High conviction positive view", color: "bg-black" }
  ];

  const getRatingInfo = (value: number) => {
    return ratingScale.find(r => r.value === value) || ratingScale[5]; // Default to neutral
  };

  const getRatingIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4" />;
    if (value < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const handleSaveRating = () => {
    const newRating: RatingHistory = {
      id: Date.now().toString(),
      rating: tempRating,
      notes: tempNotes,
      timestamp: new Date()
    };

    const updatedHistory = [newRating, ...ratingHistory];
    
    setRating(tempRating);
    setNotes(tempNotes);
    setIsEditing(false);
    
    onRatingChange(tempRating, tempNotes);
    if (onRatingHistory) {
      onRatingHistory(updatedHistory);
    }
  };

  const handleCancelEdit = () => {
    setTempRating(rating);
    setTempNotes(notes);
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const currentRatingInfo = getRatingInfo(rating);

  return (
    <div className="space-y-4">
      {/* Current Rating Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Stock Rating</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Rating
              </Button>
              {ratingHistory.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <History className="h-4 w-4 mr-2" />
                      History
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Rating History - {symbol}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {ratingHistory.map((entry) => {
                        const entryInfo = getRatingInfo(entry.rating);
                        return (
                          <div key={entry.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <Badge 
                                  variant="outline" 
                                  className={`${entryInfo.color} text-white border-0`}
                                >
                                  {entryInfo.label}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                  {formatDate(entry.timestamp)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {getRatingIcon(entry.rating)}
                                <span className="font-medium">{entry.rating}</span>
                              </div>
                            </div>
                            {entry.notes && (
                              <p className="text-sm text-gray-700 mt-2">{entry.notes}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {!isEditing ? (
            // Display Current Rating
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={`${currentRatingInfo.color} text-white border-0`}
                  >
                    {currentRatingInfo.label}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {getRatingIcon(rating)}
                    <span className="font-medium text-lg">{rating}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {currentRatingInfo.description}
                </div>
              </div>
              
              {notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-700">{notes}</p>
                </div>
              )}
            </div>
          ) : (
            // Edit Rating Interface
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Rating Scale (-5 to +5)
                  </label>
                  <div className="space-y-2">
                    <Slider
                      value={[tempRating]}
                      onValueChange={(value) => setTempRating(value[0])}
                      max={5}
                      min={-5}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>-5 (Strong Sell)</span>
                      <span>0 (Neutral)</span>
                      <span>+5 (Strong Buy)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={`${getRatingInfo(tempRating).color} text-white border-0`}
                    >
                      {getRatingInfo(tempRating).label}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getRatingIcon(tempRating)}
                      <span className="font-medium">{tempRating}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {getRatingInfo(tempRating).description}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Rating Notes (Optional)
                </label>
                <Textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="Add your reasoning for this rating..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSaveRating} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Rating
                </Button>
                <Button variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rating Scale Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rating Scale Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {ratingScale.map((scale) => (
              <div key={scale.value} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${scale.color}`}></div>
                  <div>
                    <span className="font-medium">{scale.value}</span>
                    <span className="text-gray-600 ml-2">- {scale.label}</span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{scale.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockRating; 