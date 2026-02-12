import { Section, Container } from '../components/brand/BrandPrimitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { Separator } from '@/components/ui/separator';

export default function TermsPage() {
  usePageMeta('Terms & Conditions', 'Read our terms and conditions for using our website and services.');

  return (
    <div>
      <Section className="bg-muted/30 py-12">
        <Container>
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold">
              Terms & Conditions
            </h1>
            <p className="text-xl text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="space-y-8 text-foreground">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Agreement to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using the Beemedha website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our website or services.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Use of Website</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You agree to use our website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Harassing or causing distress or inconvenience to any person</li>
                  <li>Transmitting obscene or offensive content</li>
                  <li>Disrupting the normal flow of dialogue within our website</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Product Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions, pricing, or other content on our website is accurate, complete, reliable, current, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Orders and Payment</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing or product information, or suspected fraudulent activity. Payment must be received before orders are processed and shipped.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Shipping and Delivery</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We will make every effort to deliver products within the estimated timeframe. However, delivery times are estimates and not guaranteed. We are not liable for any delays in delivery caused by circumstances beyond our reasonable control.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Returns and Refunds</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Due to the nature of our food products, we have specific return and refund policies. Please contact us within 7 days of receiving your order if you have any concerns about product quality or if you received a damaged or incorrect item. We will work with you to resolve the issue promptly.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on this website, including text, graphics, logos, images, and software, is the property of Beemedha and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without express written permission.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the fullest extent permitted by law, Beemedha shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our website or products.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Beemedha operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website following the posting of changes constitutes your acceptance of such changes.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms & Conditions, please contact us at:
                </p>
                <p className="text-muted-foreground mt-4">
                  Email: legal@beemedha.com<br />
                  Phone: +1 (234) 567-890<br />
                  Address: 123 Honey Lane, Natural Valley, NV 12345
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
