import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { ProductVariants, WeightVariant, FlavorVariant, Price } from '../../backend';

interface VariantSelectorProps {
  variants: ProductVariants;
  onVariantChange: (price: Price, label: string) => void;
}

export default function VariantSelector({ variants, onVariantChange }: VariantSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (variants.__kind__ === 'weight') {
    const weightVariants = variants.weight;
    
    const handleSelect = (index: number) => {
      setSelectedIndex(index);
      const variant = weightVariants[index];
      onVariantChange(variant.price, `${variant.weight}g`);
    };

    // Initialize with first variant
    if (selectedIndex === 0 && weightVariants.length > 0) {
      setTimeout(() => onVariantChange(weightVariants[0].price, `${weightVariants[0].weight}g`), 0);
    }

    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold">Select Weight</Label>
        <div className="flex flex-wrap gap-2">
          {weightVariants.map((variant, index) => (
            <Button
              key={index}
              type="button"
              variant={selectedIndex === index ? 'default' : 'outline'}
              onClick={() => handleSelect(index)}
              className="min-w-[100px]"
            >
              {variant.weight}g
            </Button>
          ))}
        </div>
        {weightVariants[selectedIndex] && (
          <p className="text-sm text-muted-foreground">
            {weightVariants[selectedIndex].description}
          </p>
        )}
      </div>
    );
  }

  if (variants.__kind__ === 'flavor') {
    const flavorVariants = variants.flavor;
    
    const handleSelect = (index: number) => {
      setSelectedIndex(index);
      const variant = flavorVariants[index];
      onVariantChange(variant.price, variant.flavor);
    };

    // Initialize with first variant
    if (selectedIndex === 0 && flavorVariants.length > 0) {
      setTimeout(() => onVariantChange(flavorVariants[0].price, flavorVariants[0].flavor), 0);
    }

    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold">Select Variant</Label>
        <div className="flex flex-col gap-2">
          {flavorVariants.map((variant, index) => (
            <Button
              key={index}
              type="button"
              variant={selectedIndex === index ? 'default' : 'outline'}
              onClick={() => handleSelect(index)}
              className="justify-start text-left h-auto py-3"
            >
              <div>
                <div className="font-semibold">{variant.flavor}</div>
                <div className="text-xs opacity-80">{variant.weight}g - {variant.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
