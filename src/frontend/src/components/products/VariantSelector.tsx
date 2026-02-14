import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ProductVariants, Price, WeightVariant, FlavorVariant } from '../../backend';

interface VariantSelectorProps {
  variants: ProductVariants;
  onVariantChange: (price: Price, label: string, weightVariant?: WeightVariant, flavorVariant?: FlavorVariant) => void;
}

export default function VariantSelector({ variants, onVariantChange }: VariantSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (variants.__kind__ === 'weight') {
    const weightVariants = variants.weight;

    const handleChange = (index: number) => {
      setSelectedIndex(index);
      const variant = weightVariants[index];
      onVariantChange(variant.price, `${variant.weight}g`, variant, undefined);
    };

    // Auto-select first variant on mount
    if (selectedIndex === 0 && weightVariants.length > 0) {
      setTimeout(() => handleChange(0), 0);
    }

    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold">Select Weight</Label>
        <RadioGroup
          value={selectedIndex.toString()}
          onValueChange={(value) => handleChange(parseInt(value))}
        >
          {weightVariants.map((variant, index) => (
            <div key={index} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={index.toString()} id={`weight-${index}`} />
              <Label htmlFor={`weight-${index}`} className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{variant.weight}g</p>
                    <p className="text-sm text-muted-foreground">{variant.description}</p>
                  </div>
                  <div className="text-right">
                    {variant.price.salePrice ? (
                      <>
                        <p className="font-semibold text-primary">₹{variant.price.salePrice.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground line-through">₹{variant.price.listPrice.toFixed(2)}</p>
                      </>
                    ) : (
                      <p className="font-semibold">₹{variant.price.listPrice.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  if (variants.__kind__ === 'flavor') {
    const flavorVariants = variants.flavor;

    const handleChange = (index: number) => {
      setSelectedIndex(index);
      const variant = flavorVariants[index];
      onVariantChange(variant.price, variant.flavor, undefined, variant);
    };

    // Auto-select first variant on mount
    if (selectedIndex === 0 && flavorVariants.length > 0) {
      setTimeout(() => handleChange(0), 0);
    }

    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold">Select Flavor</Label>
        <RadioGroup
          value={selectedIndex.toString()}
          onValueChange={(value) => handleChange(parseInt(value))}
        >
          {flavorVariants.map((variant, index) => (
            <div key={index} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={index.toString()} id={`flavor-${index}`} />
              <Label htmlFor={`flavor-${index}`} className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{variant.flavor}</p>
                    <p className="text-sm text-muted-foreground">{variant.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{variant.weight}g</p>
                  </div>
                  <div className="text-right">
                    {variant.price.salePrice ? (
                      <>
                        <p className="font-semibold text-primary">₹{variant.price.salePrice.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground line-through">₹{variant.price.listPrice.toFixed(2)}</p>
                      </>
                    ) : (
                      <p className="font-semibold">₹{variant.price.listPrice.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  return null;
}
