import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { Label } from "@/components/ui/label"

export interface StepperProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export const Stepper = React.forwardRef<HTMLInputElement, StepperProps>(
  ({ className, value = 0, onChange, min = 0, max, step = 1, disabled, label, ...props }, ref) => {
    
    const handleIncrement = () => {
      const nextValue = value + step;
      if (max !== undefined && nextValue > max) return;
      onChange?.(nextValue);
    };

    const handleDecrement = () => {
      const nextValue = value - step;
      if (min !== undefined && nextValue < min) return;
      onChange?.(nextValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value, 10);
      if (isNaN(val)) return;
      if (min !== undefined && val < min) return;
      if (max !== undefined && val > max) return;
      onChange?.(val);
    };

    const stepperControls = (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={handleDecrement}
          disabled={disabled || (min !== undefined && value <= min)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input 
          type="number" 
          className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
          value={value} 
          onChange={handleInputChange}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && value >= max)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );

    if (label) {
      return (
        <div className="space-y-2 text-center">
          <Label>{label}</Label>
          {stepperControls}
        </div>
      );
    }

    return stepperControls;
  }
)
Stepper.displayName = "Stepper"
