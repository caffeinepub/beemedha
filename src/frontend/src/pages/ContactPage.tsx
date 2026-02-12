import { useState } from 'react';
import { Section, Container, BrandCard } from '../components/brand/BrandPrimitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSubmitContactForm } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Phone, MapPin, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

export default function ContactPage() {
  usePageMeta('Contact Us', 'Get in touch with Beemedha for inquiries, orders, or support.');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  
  const submitMutation = useSubmitContactForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    try {
      await submitMutation.mutateAsync(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      <Section className="bg-muted/30 py-12">
        <Container>
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <BrandCard className="p-8">
                <h2 className="text-2xl font-serif font-bold mb-6">Send us a Message</h2>
                
                {submitted && (
                  <Alert className="mb-6 bg-accent/10 border-accent">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <AlertDescription className="text-accent-foreground">
                      Thank you for your message! We'll get back to you soon.
                    </AlertDescription>
                  </Alert>
                )}

                {submitMutation.isError && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to send message. Please try again.
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-2"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email / Phone *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="text"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-2"
                      placeholder="your@email.com or phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="mt-2 min-h-[150px]"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </BrandCard>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <BrandCard className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold mb-2">Email</h3>
                    <a href="mailto:info@beemedha.com" className="text-muted-foreground hover:text-primary transition-colors">
                      info@beemedha.com
                    </a>
                  </div>
                </div>
              </BrandCard>

              <BrandCard className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold mb-2">Phone</h3>
                    <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary transition-colors">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
              </BrandCard>

              <BrandCard className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold mb-2">Location</h3>
                    <p className="text-muted-foreground">
                      123 Honey Lane<br />
                      Natural Valley, NV 12345<br />
                      United States
                    </p>
                  </div>
                </div>
              </BrandCard>

              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <BrandCard className="p-8 hover:shadow-premium transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <SiWhatsapp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-semibold mb-1 group-hover:text-primary transition-colors">
                        WhatsApp Chat
                      </h3>
                      <p className="text-muted-foreground">
                        Click to chat with us instantly
                      </p>
                    </div>
                  </div>
                </BrandCard>
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Map */}
      <Section className="bg-muted/30">
        <Container>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-center">
            Visit Our Location
          </h2>
          <div className="rounded-lg overflow-hidden shadow-premium">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841!2d-73.98823492346!3d40.74844097138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU0LjQiTiA3M8KwNTknMTcuNiJX!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Beemedha Location"
            />
          </div>
        </Container>
      </Section>
    </div>
  );
}
