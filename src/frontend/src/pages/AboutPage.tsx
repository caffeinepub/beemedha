import { Section, Container, BrandCard } from '../components/brand/BrandPrimitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGetSiteSettings } from '../hooks/useQueries';
import { Leaf, Award, Heart, Users } from 'lucide-react';

export default function AboutPage() {
  usePageMeta('About Us', 'Learn about Beemedha and our commitment to pure, natural honey products.');

  const settingsQuery = useGetSiteSettings();
  const aboutContent = settingsQuery.data?.aboutContent || '';

  const defaultContent = `Beemedha is dedicated to bringing you the finest, purest honey and bee products directly from nature. Our commitment to quality and sustainability ensures that every product we offer meets the highest standards.

We work closely with local beekeepers who share our passion for natural, unprocessed honey. Our products are carefully harvested and minimally processed to preserve their natural goodness and health benefits.`;

  const displayContent = aboutContent || defaultContent;

  return (
    <div>
      <Section className="py-12">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              About Beemedha
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pure honey, naturally crafted
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <BrandCard className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {displayContent}
                </p>
              </div>
            </BrandCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BrandCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-xl mb-2">100% Natural</h3>
                    <p className="text-muted-foreground">
                      Our honey is pure and unprocessed, preserving all the natural enzymes and nutrients.
                    </p>
                  </div>
                </div>
              </BrandCard>

              <BrandCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-xl mb-2">Premium Quality</h3>
                    <p className="text-muted-foreground">
                      Every batch is carefully tested to ensure it meets our high standards of excellence.
                    </p>
                  </div>
                </div>
              </BrandCard>

              <BrandCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-xl mb-2">Sustainably Sourced</h3>
                    <p className="text-muted-foreground">
                      We prioritize ethical beekeeping practices that protect bee populations and the environment.
                    </p>
                  </div>
                </div>
              </BrandCard>

              <BrandCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-xl mb-2">Community Focused</h3>
                    <p className="text-muted-foreground">
                      We support local beekeepers and contribute to the growth of sustainable beekeeping.
                    </p>
                  </div>
                </div>
              </BrandCard>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
