import { useState, useEffect } from 'react';
import { useGetLogo, useUpdateLogo } from '../../hooks/useQueries';
import { logoToUrl, revokeLogoUrl } from '../../utils/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Section, Container, BrandCard } from '../../components/brand/BrandPrimitives';
import { usePageMeta } from '../../hooks/usePageMeta';
import { Upload, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogoPage() {
  usePageMeta('Manage Logo', 'Upload and manage your site logo.');

  const { data: logo, isLoading: logoLoading } = useGetLogo();
  const updateLogoMutation = useUpdateLogo();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentLogoUrl = logoToUrl(logo);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        revokeLogoUrl(previewUrl);
      }
    };
  }, [previewUrl]);

  // Clean up current logo URL on unmount
  useEffect(() => {
    return () => {
      if (currentLogoUrl) {
        revokeLogoUrl(currentLogoUrl);
      }
    };
  }, [currentLogoUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      if (previewUrl) {
        revokeLogoUrl(previewUrl);
        setPreviewUrl(null);
      }
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WebP, or SVG).');
      setSelectedFile(null);
      if (previewUrl) {
        revokeLogoUrl(previewUrl);
        setPreviewUrl(null);
      }
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError('File size must be less than 2MB.');
      setSelectedFile(null);
      if (previewUrl) {
        revokeLogoUrl(previewUrl);
        setPreviewUrl(null);
      }
      return;
    }

    setSelectedFile(file);

    // Create preview
    if (previewUrl) {
      revokeLogoUrl(previewUrl);
    }
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setError(null);

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Upload to backend
      await updateLogoMutation.mutateAsync({
        mimeType: selectedFile.type,
        data: uint8Array,
      });

      toast.success('Logo updated successfully!');

      // Clear selection and preview
      setSelectedFile(null);
      if (previewUrl) {
        revokeLogoUrl(previewUrl);
        setPreviewUrl(null);
      }

      // Reset file input
      const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to upload logo';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <Section className="bg-muted/30 py-12">
        <Container>
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold">
              Manage Logo
            </h1>
            <p className="text-xl text-muted-foreground">
              Upload and manage your site logo that appears in the header.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Current Logo */}
            <BrandCard className="p-6">
              <h2 className="text-2xl font-serif font-bold mb-4">Current Logo</h2>
              {logoLoading ? (
                <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : currentLogoUrl ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-full max-w-md h-48 flex items-center justify-center bg-muted rounded-lg p-4">
                    <img
                      src={currentLogoUrl}
                      alt="Current logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This logo is displayed in the header of your website.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 bg-muted rounded-lg space-y-2">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No logo uploaded yet</p>
                  <p className="text-sm text-muted-foreground">
                    The default logo will be displayed until you upload a custom one.
                  </p>
                </div>
              )}
            </BrandCard>

            {/* Upload New Logo */}
            <BrandCard className="p-6">
              <h2 className="text-2xl font-serif font-bold mb-4">Upload New Logo</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="logo-upload" className="text-base font-medium">
                    Select Image File
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Supported formats: JPEG, PNG, GIF, WebP, SVG (max 2MB)
                  </p>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                    onChange={handleFileChange}
                    disabled={updateLogoMutation.isPending}
                    className="cursor-pointer"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {selectedFile && !error && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>File Selected</AlertTitle>
                    <AlertDescription>
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </AlertDescription>
                  </Alert>
                )}

                {previewUrl && (
                  <div>
                    <Label className="text-base font-medium mb-2 block">Preview</Label>
                    <div className="w-full max-w-md h-48 flex items-center justify-center bg-muted rounded-lg p-4 mx-auto">
                      <img
                        src={previewUrl}
                        alt="Logo preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || !!error || updateLogoMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {updateLogoMutation.isPending ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-pulse" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </>
                  )}
                </Button>
              </div>
            </BrandCard>

            {/* Info Card */}
            <BrandCard className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <ImageIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Logo Guidelines</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Use a square or horizontal logo for best results</li>
                    <li>Recommended size: 200x200 pixels or larger</li>
                    <li>Transparent background (PNG) works best</li>
                    <li>The logo will be displayed at approximately 48x48 pixels in the header</li>
                    <li>Changes take effect immediately across the entire site</li>
                  </ul>
                </div>
              </div>
            </BrandCard>
          </div>
        </Container>
      </Section>
    </div>
  );
}
