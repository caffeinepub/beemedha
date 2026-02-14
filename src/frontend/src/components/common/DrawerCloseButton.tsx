import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DrawerCloseButtonProps {
  onClose: () => void;
  className?: string;
}

export default function DrawerCloseButton({ onClose, className = '' }: DrawerCloseButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClose}
      className={`absolute top-4 right-4 h-8 w-8 rounded-full z-10 ${className}`}
      aria-label="Close drawer"
    >
      <X className="h-5 w-5" />
    </Button>
  );
}
