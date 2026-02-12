import { Section, Container } from '../components/brand/BrandPrimitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { Separator } from '@/components/ui/separator';

export default function PrivacyPolicyPage() {
  usePageMeta('Privacy Policy', 'Read our privacy policy and learn how we protect your data.');

  return (
    <div>
      <Section className="bg-muted/30 py-12">
        <Container>
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold">
              Privacy Policy
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
                <h2 className="text-3xl font-serif font-bold mb-4">Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At Beemedha, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Name and contact information (email address, phone number, mailing address)</li>
                  <li>Payment information (processed securely through our payment providers)</li>
                  <li>Order history and preferences</li>
                  <li>Communications with us through contact forms or email</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders and our products</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our website and customer service</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Information Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Object to processing of your personal information</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. You can control cookies through your browser settings.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <p className="text-muted-foreground mt-4">
                  Email: privacy@beemedha.com<br />
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
