import { Progress } from "./progress";
import { Card } from "./card";
import { Loader2 } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
  progress: number;
}

const ProgressIndicator = ({ currentStep, totalSteps, stepLabel, progress }: ProgressIndicatorProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <div>
            <h3 className="font-medium">Generating Research Report</h3>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}: {stepLabel}
            </p>
          </div>
        </div>
        
        <Progress value={progress} className="w-full" />
        
        <div className="text-xs text-muted-foreground text-center">
          Estimated time remaining: {Math.ceil((100 - progress) / 20)} minutes
        </div>
      </div>
    </Card>
  );
};

export default ProgressIndicator;