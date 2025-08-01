import { Progress } from "./progress";
import { Card } from "./card";
import { Loader2, CheckCircle, Clock, Zap } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
  progress: number;
}

const ProgressIndicator = ({ currentStep, totalSteps, stepLabel, progress }: ProgressIndicatorProps) => {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Generating your report</h2>
            <p className="text-gray-600 mt-2">AI is analyzing {stepLabel.toLowerCase()}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 font-medium">{progress}% complete</span>
            <span className="text-blue-600 font-semibold">Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Current Step */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-gray-900 font-medium">{stepLabel}</p>
              <p className="text-sm text-gray-600">Processing...</p>
            </div>
          </div>
        </div>
        
        {/* Estimated Time */}
        <div className="flex items-center justify-center gap-2 text-blue-600 font-medium">
          <Clock className="w-4 h-4" />
          <span>Estimated time remaining: {Math.ceil((100 - progress) / 20) * 1.5} minutes</span>
        </div>
        
        {/* Progress Steps */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < currentStep - 1
                  ? 'bg-green-500'
                  : i === currentStep - 1
                  ? 'bg-blue-500 animate-pulse'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ProgressIndicator;