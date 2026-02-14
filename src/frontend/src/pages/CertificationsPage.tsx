import { Section, Container, BrandCard } from '../components/brand/BrandPrimitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGetSiteSettings } from '../hooks/useQueries';
import { Award, CheckCircle, Shield } from 'lucide-react';

export default function CertificationsPage() {
  usePageMeta('Certifications', 'Our quality certifications and standards.');

  const settingsQuery = useGetSiteSettings();
  const certificationsContent = settingsQuery.data?.certificationsContent || '';
  const certificationsImage = settingsQuery.data?.certificationsImage || '';

  const defaultContent = `At Beemedha, quality and safety are our top priorities. Our products meet rigorous quality standards and are regularly tested to ensure purity and authenticity.

We are committed to maintaining the highest standards in honey production and processing, ensuring that every jar of honey you receive is of premium quality.`;

  const displayContent = certificationsContent || defaultContent;

  return (
    <div>
      <Section className="py-12">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Our Certifications
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quality you can trust
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {certificationsImage && (
              <div className="flex justify-center">
                <img
                  src={certificationsImage}
                  alt="Quality Certifications"
                  className="max-w-md w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}

            <BrandCard className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {displayContent}
                </p>
              </div>
            </BrandCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BrandCard className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-serif font-semibold text-xl mb-2">Quality Certified</h3>
                <p className="text-sm text-muted-foreground">
                  Our products meet international quality standards
                </p>
              </BrandCard>

              <BrandCard className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-serif font-semibold text-xl mb-2">Lab Tested</h3>
                <p className="text-sm text-muted-foreground">
                  Every batch is tested for purity and authenticity
                </p>
              </BrandCard>

              <BrandCard className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-serif font-semibold text-xl mb-2">Safety Assured</h3>
                <p className="text-sm text-muted-foreground">
                  Strict hygiene and safety protocols followed
                </p>
              </BrandCard>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
