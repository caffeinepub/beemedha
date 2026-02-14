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
    <section className={cn('py-20 md:py-28', className)} {...props}>
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
    <div className={cn('container mx-auto px-6 md:px-8', className)} {...props}>
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
        'border-border/50 bg-card shadow-soft hover:shadow-soft-lg transition-all duration-300 rounded-xl',
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
      className={cn('font-medium rounded-full px-3 py-1', className)}
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
      className={cn('font-semibold rounded-lg', className)}
      {...props}
    >
      {children}
    </Button>
  );
}
