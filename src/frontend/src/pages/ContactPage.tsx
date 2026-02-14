import { useState } from 'react';
import { Section, Container, BrandCard } from '../components/brand/BrandPrimitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSubmitContactForm, useGetSiteSettings } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  usePageMeta('Contact Us', 'Get in touch with Beemedha for inquiries about our honey products.');

  const settingsQuery = useGetSiteSettings();
  const submitFormMutation = useSubmitContactForm();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await submitFormMutation.mutateAsync(formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Submit form error:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const contactDetails = settingsQuery.data?.contactDetails || '';
  const mapUrl = settingsQuery.data?.mapUrl || 'https://maps.app.goo.gl/J6bsG7n3H4yPBrPK9';

  return (
    <div>
      <Section className="py-12">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about our products? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <BrandCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-muted-foreground">
                      {contactDetails.includes('email') || contactDetails.includes('@') 
                        ? contactDetails.split('\n').find(line => line.includes('@')) || 'info@beemedha.com'
                        : 'info@beemedha.com'}
                    </p>
                  </div>
                </div>
              </BrandCard>

              <BrandCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <p className="text-muted-foreground">
                      {contactDetails.includes('phone') || /\d{10}/.test(contactDetails)
                        ? contactDetails.split('\n').find(line => /\d{10}/.test(line)) || '+91 1234567890'
                        : '+91 1234567890'}
                    </p>
                  </div>
                </div>
              </BrandCard>

              <BrandCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Location</h3>
                    <p className="text-muted-foreground mb-3">
                      {contactDetails && !contactDetails.includes('@') && !/\d{10}/.test(contactDetails)
                        ? contactDetails
                        : 'Karnataka, India'}
                    </p>
                    {mapUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                          View on Map
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </BrandCard>

              {contactDetails && (
                <BrandCard className="p-6 bg-muted/50">
                  <h3 className="font-semibold text-lg mb-3">Additional Information</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {contactDetails}
                  </p>
                </BrandCard>
              )}
            </div>

            {/* Contact Form */}
            <BrandCard className="p-8">
              <h2 className="text-2xl font-serif font-bold mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Your name"
                    disabled={submitFormMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your@email.com"
                    disabled={submitFormMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Tell us how we can help..."
                    rows={6}
                    disabled={submitFormMutation.isPending}
                  />
                </div>

                {submitFormMutation.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to send message. Please try again.
                    </AlertDescription>
                  </Alert>
                )}

                {submitFormMutation.isSuccess && (
                  <Alert className="border-green-500 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Message sent successfully! We'll get back to you soon.
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={submitFormMutation.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {submitFormMutation.isPending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </BrandCard>
          </div>
        </Container>
      </Section>
    </div>
  );
}
