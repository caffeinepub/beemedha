import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function Section({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn('py-16 md:py-24', className)} {...props}>
      {children}
    </section>
  );
}

export function Container({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('container mx-auto px-4', className)} {...props}>
      {children}
    </div>
  );
}

export function BrandCard({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        'border-border/50 shadow-soft hover:shadow-premium transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

export function BrandBadge({
  children,
  variant = 'secondary',
  className,
  ...props
}: React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      variant={variant}
      className={cn('font-medium', className)}
      {...props}
    >
      {children}
    </Badge>
  );
}

export function BrandButton({
  children,
  variant = 'default',
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant={variant}
      className={cn('font-medium', className)}
      {...props}
    >
      {children}
    </Button>
  );
}
