import { Section, Container, BrandCard } from '../components/brand/BrandPrimitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { Award, CheckCircle, FileCheck, Shield } from 'lucide-react';

export default function CertificationsPage() {
  usePageMeta('Certifications & Quality', 'Learn about our quality assurance, lab testing, and organic certifications.');

  return (
    <div>
      <Section className="bg-muted/30 py-12">
        <Container>
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold">
              Certifications & Quality Assurance
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our commitment to purity and quality is backed by rigorous testing and certifications.
            </p>
          </div>
        </Container>
      </Section>

      {/* Quality Seal */}
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <img
              src="/assets/generated/quality-seal.dim_512x512.png"
              alt="Beemedha Quality Seal"
              className="w-48 h-48 mx-auto"
            />
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              Certified Pure & Natural
            </h2>
            <p className="text-xl text-muted-foreground">
              Every jar of Beemedha honey carries our seal of quality, representing our unwavering commitment to purity and excellence.
            </p>
          </div>
        </Container>
      </Section>

      {/* Lab Testing */}
      <Section className="bg-muted/30">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/assets/generated/beemedha-badges.dim_512x512.png"
                alt="Lab Testing"
                className="rounded-lg shadow-premium"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold">Lab Testing</h2>
              </div>
              <p className="text-lg text-muted-foreground">
                Every batch of Beemedha honey undergoes comprehensive laboratory testing by independent, accredited facilities to ensure the highest standards of purity and quality.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Purity Analysis</h3>
                    <p className="text-muted-foreground">
                      Testing for adulterants, added sugars, and artificial substances to guarantee 100% pure honey.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Microbiological Testing</h3>
                    <p className="text-muted-foreground">
                      Ensuring our honey is free from harmful bacteria and meets food safety standards.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Chemical Residue Testing</h3>
                    <p className="text-muted-foreground">
                      Screening for pesticides, antibiotics, and other chemical residues.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Organic Certifications */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold">Organic Certifications</h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our organic honey products are certified by recognized organic certification bodies.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BrandCard className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Organic Certified</h3>
              <p className="text-muted-foreground">
                Our organic honey varieties are certified to meet strict organic farming and production standards.
              </p>
            </BrandCard>
            <BrandCard className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Quality Standards</h3>
              <p className="text-muted-foreground">
                Compliant with international food safety and quality management standards.
              </p>
            </BrandCard>
            <BrandCard className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Ethical Sourcing</h3>
              <p className="text-muted-foreground">
                Certified ethical beekeeping practices that prioritize bee welfare and environmental sustainability.
              </p>
            </BrandCard>
          </div>
        </Container>
      </Section>

      {/* Trust Badges */}
      <Section className="bg-muted/30">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Trust & Quality Seals
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our commitment to transparency and quality is reflected in our certifications and seals.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <img
              src="/assets/generated/quality-seal.dim_512x512.png"
              alt="Quality Seal"
              className="w-32 h-32 opacity-80 hover:opacity-100 transition-opacity"
            />
            <img
              src="/assets/generated/beemedha-badges.dim_512x512.png"
              alt="Certification Badges"
              className="w-32 h-32 opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </Container>
      </Section>
    </div>
  );
}
