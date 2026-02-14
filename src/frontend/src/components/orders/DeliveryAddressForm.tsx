import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DeliveryAddress } from '../../backend';

interface DeliveryAddressFormProps {
  initialAddress?: DeliveryAddress;
  onSuccess: (address: DeliveryAddress) => Promise<void>;
  isSubmitting?: boolean;
}

export default function DeliveryAddressForm({
  initialAddress,
  onSuccess,
  isSubmitting = false,
}: DeliveryAddressFormProps) {
  const [formData, setFormData] = useState<DeliveryAddress>(
    initialAddress || {
      name: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      phoneNumber: '',
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryAddress, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DeliveryAddress, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSuccess(formData);
  };

  const handleChange = (field: keyof DeliveryAddress, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="John Doe"
          disabled={isSubmitting}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine1">Address Line 1 *</Label>
        <Input
          id="addressLine1"
          value={formData.addressLine1}
          onChange={(e) => handleChange('addressLine1', e.target.value)}
          placeholder="Street address, P.O. box"
          disabled={isSubmitting}
        />
        {errors.addressLine1 && <p className="text-sm text-destructive">{errors.addressLine1}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine2">Address Line 2</Label>
        <Input
          id="addressLine2"
          value={formData.addressLine2}
          onChange={(e) => handleChange('addressLine2', e.target.value)}
          placeholder="Apartment, suite, unit, building, floor, etc."
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="City"
            disabled={isSubmitting}
          />
          {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="State"
            disabled={isSubmitting}
          />
          {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            placeholder="123456"
            disabled={isSubmitting}
          />
          {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="India"
            disabled={isSubmitting}
          />
          {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number *</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleChange('phoneNumber', e.target.value)}
          placeholder="+91 98765 43210"
          disabled={isSubmitting}
          />
        {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Address'}
      </Button>
    </form>
  );
}
