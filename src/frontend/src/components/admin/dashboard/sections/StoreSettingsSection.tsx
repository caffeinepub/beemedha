import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminStoreSettings } from '../../../../hooks/useAdminStoreSettings';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export default function StoreSettingsSection() {
  const { settings, rawSettings, isLoading, updateSettings, isUpdating } = useAdminStoreSettings();
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    whatsapp: '',
    address: '',
    facebook: '',
    instagram: '',
    twitter: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        phone: settings.phone || '',
        email: settings.email || '',
        whatsapp: settings.whatsapp || '',
        address: settings.address || '',
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        twitter: settings.twitter || '',
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (logoFile && !logoFile.type.includes('jpeg') && !logoFile.type.includes('jpg')) {
      toast.error('Logo must be a JPEG image');
      return;
    }

    if (backgroundFile && !backgroundFile.type.includes('jpeg') && !backgroundFile.type.includes('jpg')) {
      toast.error('Background image must be a JPEG image');
      return;
    }

    try {
      await updateSettings({
        ...formData,
        logoFile,
        bgFile: backgroundFile,
      });
      toast.success('Settings updated successfully');
      setLogoFile(null);
      setBackgroundFile(null);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update settings');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2 neon-text-glow">Store Settings</h1>
        <p className="neon-text-muted">
          Manage your store information and branding
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="neon-card-admin">
          <CardHeader>
            <CardTitle className="font-serif neon-text">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="neon-text">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="neon-input"
                  placeholder="+91 1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="neon-text">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="neon-input"
                  placeholder="contact@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="neon-text">WhatsApp</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="neon-input"
                placeholder="+91 1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="neon-text">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="neon-input resize-none"
                placeholder="Enter your business address..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="neon-card-admin">
          <CardHeader>
            <CardTitle className="font-serif neon-text">Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook" className="neon-text">Facebook URL</Label>
              <Input
                id="facebook"
                type="url"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                className="neon-input"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram" className="neon-text">Instagram URL</Label>
              <Input
                id="instagram"
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="neon-input"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter" className="neon-text">Twitter URL</Label>
              <Input
                id="twitter"
                type="url"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className="neon-input"
                placeholder="https://twitter.com/..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="neon-card-admin">
          <CardHeader>
            <CardTitle className="font-serif neon-text">Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo" className="neon-text">Logo (JPEG only)</Label>
              <Input
                id="logo"
                type="file"
                accept=".jpg,.jpeg,image/jpeg"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="neon-input file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:neon-file-button"
              />
              {logoFile && (
                <p className="text-sm neon-text-muted">Selected: {logoFile.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="background" className="neon-text">Background Image (JPEG only)</Label>
              <Input
                id="background"
                type="file"
                accept=".jpg,.jpeg,image/jpeg"
                onChange={(e) => setBackgroundFile(e.target.files?.[0] || null)}
                className="neon-input file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:neon-file-button"
              />
              {backgroundFile && (
                <p className="text-sm neon-text-muted">Selected: {backgroundFile.name}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isUpdating} className="neon-button-primary">
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
