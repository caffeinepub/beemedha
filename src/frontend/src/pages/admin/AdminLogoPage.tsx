import { useState } from 'react';
import { Section, Container } from '../../components/brand/BrandPrimitives';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useGetLogo, useUpdateLogo } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { logoToUrl } from '../../utils/logo';

export default function AdminLogoPage() {
  usePageMeta('Web Owner Dashboard', 'Upload and manage your site logo.');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const logoQuery = useGetLogo();
  const updateMutation = useUpdateLogo();

  const currentLogo = logoQuery.data;
  const currentLogoUrl = currentLogo ? logoToUrl(currentLogo) : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      e.target.value = '';
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      await updateMutation.mutateAsync({
        mimeType: selectedFile.type,
        data: uint8Array,
      });

      toast.success('Logo updated successfully');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update logo';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  return (
    <div>
      <Section className="bg-muted/30 py-12">
        <Container>
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
              Manage Logo
            </h1>
            <p className="text-muted-foreground">
              Upload and manage your site logo.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="py-12">
        <Container>
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Current Logo</CardTitle>
                <CardDescription>
                  This logo is displayed in the header across your site
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentLogoUrl ? (
                  <div className="flex justify-center p-8 bg-muted rounded-lg">
                    <img
                      src={currentLogoUrl}
                      alt="Current logo"
                      className="max-h-32 w-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No logo uploaded yet
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Upload New Logo</CardTitle>
                <CardDescription>
                  Select an image file to replace the current logo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Recommended: PNG or SVG format with transparent background. Maximum file size: 2MB.
                  </AlertDescription>
                </Alert>

                <div>
                  <Label htmlFor="logo">Select Logo File</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                </div>

                {previewUrl && (
                  <div>
                    <Label>Preview</Label>
                    <div className="mt-2 flex justify-center p-8 bg-muted rounded-lg">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-32 w-auto object-contain"
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || updateMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {updateMutation.isPending ? 'Uploading...' : 'Upload Logo'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  );
}
