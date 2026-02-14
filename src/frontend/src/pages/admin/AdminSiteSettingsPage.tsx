import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useGetSiteSettings, useUpdateSiteSettings } from '../../hooks/useQueries';
import { Section, Container } from '../../components/brand/BrandPrimitives';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { SiteSettings } from '../../backend';

export default function AdminSiteSettingsPage() {
  const navigate = useNavigate();
  usePageMeta('Site Settings', 'Manage site content and settings');

  const settingsQuery = useGetSiteSettings();
  const updateSettingsMutation = useUpdateSiteSettings();

  const [formData, setFormData] = useState<SiteSettings>({
    backgroundImage: '',
    mapUrl: 'https://maps.app.goo.gl/J6bsG7n3H4yPBrPK9',
    contactDetails: '',
    certificationsContent: '',
    certificationsImage: '',
    aboutContent: '',
  });

  useEffect(() => {
    if (settingsQuery.data) {
      setFormData({
        backgroundImage: settingsQuery.data.backgroundImage || '',
        mapUrl: settingsQuery.data.mapUrl,
        contactDetails: settingsQuery.data.contactDetails,
        certificationsContent: settingsQuery.data.certificationsContent,
        certificationsImage: settingsQuery.data.certificationsImage || '',
        aboutContent: settingsQuery.data.aboutContent,
      });
    }
  }, [settingsQuery.data]);

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSettingsMutation.mutateAsync(formData);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error('Failed to save settings');
    }
  };

  if (settingsQuery.isLoading) {
    return (
      <Section className="py-12">
        <Container>
          <p className="text-center text-muted-foreground">Loading settings...</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="py-8">
      <Container className="max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/admin' })}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-serif font-bold">Site Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your website content and configuration
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 border rounded-lg p-6">
              <h2 className="text-xl font-semibold">Background Image</h2>
              <div className="space-y-2">
                <Label htmlFor="backgroundImage">Background Image URL</Label>
                <Input
                  id="backgroundImage"
                  value={formData.backgroundImage}
                  onChange={(e) => handleChange('backgroundImage', e.target.value)}
                  placeholder="/assets/generated/honeycomb-bg.dim_1600x900.png"
                  disabled={updateSettingsMutation.isPending}
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to use the default honeycomb pattern
                </p>
              </div>
            </div>

            <div className="space-y-4 border rounded-lg p-6">
              <h2 className="text-xl font-semibold">About Page</h2>
              <div className="space-y-2">
                <Label htmlFor="aboutContent">About Content</Label>
                <Textarea
                  id="aboutContent"
                  value={formData.aboutContent}
                  onChange={(e) => handleChange('aboutContent', e.target.value)}
                  placeholder="Enter about page content..."
                  rows={6}
                  disabled={updateSettingsMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-4 border rounded-lg p-6">
              <h2 className="text-xl font-semibold">Certifications Page</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certificationsContent">Certifications Content</Label>
                  <Textarea
                    id="certificationsContent"
                    value={formData.certificationsContent}
                    onChange={(e) => handleChange('certificationsContent', e.target.value)}
                    placeholder="Enter certifications content..."
                    rows={6}
                    disabled={updateSettingsMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificationsImage">Certifications Image URL</Label>
                  <Input
                    id="certificationsImage"
                    value={formData.certificationsImage}
                    onChange={(e) => handleChange('certificationsImage', e.target.value)}
                    placeholder="/assets/generated/quality-seal.dim_512x512.png"
                    disabled={updateSettingsMutation.isPending}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 border rounded-lg p-6">
              <h2 className="text-xl font-semibold">Contact Page</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactDetails">Contact Details</Label>
                  <Textarea
                    id="contactDetails"
                    value={formData.contactDetails}
                    onChange={(e) => handleChange('contactDetails', e.target.value)}
                    placeholder="Enter contact details (phone, email, address)..."
                    rows={4}
                    disabled={updateSettingsMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mapUrl">Map Location URL</Label>
                  <Input
                    id="mapUrl"
                    value={formData.mapUrl}
                    onChange={(e) => handleChange('mapUrl', e.target.value)}
                    placeholder="https://maps.app.goo.gl/..."
                    disabled={updateSettingsMutation.isPending}
                  />
                </div>
              </div>
            </div>

            {updateSettingsMutation.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to save settings. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {updateSettingsMutation.isSuccess && (
              <Alert className="border-green-500 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Settings saved successfully!
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/admin' })}
                disabled={updateSettingsMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateSettingsMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </Section>
  );
}
