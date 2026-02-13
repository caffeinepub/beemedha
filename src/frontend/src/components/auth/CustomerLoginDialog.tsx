import { useState } from 'react';
import { useCustomerSession } from '../../hooks/useCustomerSession';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Mail, Phone, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import type { CustomerIdentifier } from '../../backend';

interface CustomerLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CustomerLoginDialog({ open, onOpenChange }: CustomerLoginDialogProps) {
  const { isValid, customerInfo, requestOTP, verifyOTP, logout } = useCustomerSession();
  const [identifierType, setIdentifierType] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'identifier' | 'otp'>('identifier');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError(`Please enter your ${identifierType}`);
      return;
    }

    // Basic validation
    if (identifierType === 'email' && !identifier.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (identifierType === 'phone' && !/^\d{10}$/.test(identifier.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);

    try {
      const customerIdentifier: CustomerIdentifier = 
        identifierType === 'email' 
          ? { __kind__: 'email', email: identifier }
          : { __kind__: 'phone', phone: identifier };

      const success = await requestOTP(customerIdentifier);
      
      if (success) {
        toast.success('OTP sent successfully! (Check console for demo OTP)');
        setStep('otp');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Request OTP error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const customerIdentifier: CustomerIdentifier = 
        identifierType === 'email' 
          ? { __kind__: 'email', email: identifier }
          : { __kind__: 'phone', phone: identifier };

      const success = await verifyOTP(customerIdentifier, otp);
      
      if (success) {
        toast.success('Login successful!');
        onOpenChange(false);
        resetForm();
      } else {
        setError('Invalid or expired OTP. Please try again.');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const resetForm = () => {
    setIdentifier('');
    setOtp('');
    setStep('identifier');
    setError('');
  };

  const handleBack = () => {
    setStep('identifier');
    setOtp('');
    setError('');
  };

  const getDisplayIdentifier = () => {
    if (!customerInfo) return '';
    if (customerInfo.__kind__ === 'email') return customerInfo.email;
    if (customerInfo.__kind__ === 'phone') return customerInfo.phone;
    return '';
  };

  // If already logged in, show logged-in state
  if (isValid && customerInfo) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Account</DialogTitle>
            <DialogDescription>
              You are currently logged in
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Logged in as</p>
                <p className="text-sm text-muted-foreground">{getDisplayIdentifier()}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Customer Login</DialogTitle>
          <DialogDescription>
            {step === 'identifier' 
              ? 'Enter your email or phone number to receive an OTP'
              : 'Enter the OTP sent to your email or phone'}
          </DialogDescription>
        </DialogHeader>

        {step === 'identifier' ? (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs value={identifierType} onValueChange={(v) => setIdentifierType(v as 'email' | 'phone')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="phone">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone
                </TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                />
              </TabsContent>
              <TabsContent value="phone" className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="1234567890"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                />
              </TabsContent>
            </Tabs>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={isLoading}
                className="text-center text-lg tracking-widest"
              />
              <p className="text-xs text-muted-foreground text-center">
                OTP sent to {identifier}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
