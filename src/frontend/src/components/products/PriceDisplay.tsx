import type { Price } from '../../backend';
import { renderPriceDisplay } from '../../utils/price';

interface PriceDisplayProps {
  price: Price;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PriceDisplay({ price, className = '', size = 'md' }: PriceDisplayProps) {
  const { displayPrice, originalPrice, hasDiscount, discountPercentage } = renderPriceDisplay(price);
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };
  
  const originalSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`font-bold text-primary ${sizeClasses[size]}`}>
        {displayPrice}
      </span>
      {hasDiscount && originalPrice && (
        <>
          <span className={`text-muted-foreground line-through ${originalSizeClasses[size]}`}>
            {originalPrice}
          </span>
          {discountPercentage && (
            <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded">
              {discountPercentage}% OFF
            </span>
          )}
        </>
      )}
    </div>
  );
}
