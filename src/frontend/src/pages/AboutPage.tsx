import { Section, Container, BrandCard } from '../components/brand/BrandPrimitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { Heart, Leaf, Users } from 'lucide-react';

export default function AboutPage() {
  usePageMeta('About Us', 'Learn about Beemedha\'s commitment to purity, ethical beekeeping, and sustainable harvesting methods.');

  return (
    <div>
      {/* Hero */}
      <Section className="bg-muted/30">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-serif font-bold">
              About Beemedha
            </h1>
            <p className="text-xl text-muted-foreground">
              Our journey began with a simple mission: to bring pure, unadulterated honey from nature to your table.
            </p>
          </div>
        </Container>
      </Section>

      {/* Our Story */}
      <Section>
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/assets/generated/beemedha-hero.dim_1920x1080.png"
                alt="Beemedha Story"
                className="rounded-lg shadow-premium"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold">Our Story</h2>
              </div>
              <p className="text-lg text-muted-foreground">
                Beemedha was founded on the belief that honey should be pure, natural, and ethically sourced. We work directly with local beekeepers who share our commitment to quality and sustainability.
              </p>
              <p className="text-lg text-muted-foreground">
                Every jar of Beemedha honey tells a story of dedication, care, and respect for nature. From the hive to your home, we ensure that our honey maintains its natural goodness and authentic flavor.
              </p>
              <p className="text-lg text-muted-foreground">
                Our commitment to purity means no heating, no filtering that removes beneficial enzymes, and absolutely no adulteration. What you get is honey as nature intended.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Ethical Beekeeping */}
      <Section className="bg-muted/30">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 md:order-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-accent" />
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold">Ethical Beekeeping</h2>
              </div>
              <p className="text-lg text-muted-foreground">
                We believe in treating our bees with the utmost respect. Our beekeeping practices prioritize the health and well-being of the colonies, ensuring they thrive in their natural environment.
              </p>
              <p className="text-lg text-muted-foreground">
                We never use harmful chemicals or antibiotics. Our beekeepers follow traditional, time-tested methods that have been passed down through generations, combined with modern knowledge of bee health and behavior.
              </p>
              <ul className="space-y-3 text-lg text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>No harmful pesticides or chemicals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>Bees are never harmed during harvesting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>Natural habitat preservation</span>
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/assets/generated/beemedha-badges.dim_512x512.png"
                alt="Ethical Beekeeping"
                className="rounded-lg shadow-premium"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Sustainable Harvesting */}
      <Section>
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/assets/generated/honeycomb-bg.dim_1600x900.png"
                alt="Sustainable Harvesting"
                className="rounded-lg shadow-premium"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold">Sustainable Harvesting</h2>
              </div>
              <p className="text-lg text-muted-foreground">
                Sustainability is at the heart of everything we do. We harvest honey in a way that ensures the long-term health of bee colonies and the ecosystems they support.
              </p>
              <p className="text-lg text-muted-foreground">
                Our harvesting methods are designed to leave enough honey for the bees to thrive through all seasons. We work with nature's rhythms, harvesting only when the time is right and the colonies are strong.
              </p>
              <ul className="space-y-3 text-lg text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Seasonal harvesting respecting natural cycles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Supporting local beekeeping communities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Protecting biodiversity and natural habitats</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section className="bg-muted/30">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at Beemedha.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BrandCard className="p-8 text-center">
              <h3 className="text-2xl font-serif font-semibold mb-3">Purity</h3>
              <p className="text-muted-foreground">
                We never compromise on quality. Every jar contains 100% pure, natural honey with no additives.
              </p>
            </BrandCard>
            <BrandCard className="p-8 text-center">
              <h3 className="text-2xl font-serif font-semibold mb-3">Transparency</h3>
              <p className="text-muted-foreground">
                We believe in complete transparency about our sourcing, testing, and production methods.
              </p>
            </BrandCard>
            <BrandCard className="p-8 text-center">
              <h3 className="text-2xl font-serif font-semibold mb-3">Sustainability</h3>
              <p className="text-muted-foreground">
                We are committed to practices that protect bees, support communities, and preserve nature.
              </p>
            </BrandCard>
          </div>
        </Container>
      </Section>
    </div>
  );
}
