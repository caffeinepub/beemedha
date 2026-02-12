import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Section, Container, BrandCard } from '../components/brand/BrandPrimitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { CheckCircle, Leaf, Award } from 'lucide-react';

export default function HomePage() {
  usePageMeta('Home', 'Pure honey, straight from nature. 100% natural, lab-tested, and ethically sourced honey products.');
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <Section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/generated/beemedha-hero.dim_1920x1080.png"
            alt="Pure honey from nature"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-tight">
              Pure Honey, Straight from Nature
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Experience the authentic taste of 100% natural honey, ethically sourced and lab-tested for purity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate({ to: '/products' })}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 font-semibold"
              >
                Shop Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: '/products' })}
                className="text-lg px-8 py-6 font-semibold border-2"
              >
                Explore Our Honey
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Trust Highlights */}
      <Section className="bg-muted/30">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BrandCard className="text-center p-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-accent" />
                </div>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">100% Natural</h3>
              <p className="text-muted-foreground">
                Pure honey with no additives, preservatives, or artificial ingredients.
              </p>
            </BrandCard>

            <BrandCard className="text-center p-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">No Adulteration</h3>
              <p className="text-muted-foreground">
                Guaranteed purity with rigorous quality checks at every step.
              </p>
            </BrandCard>

            <BrandCard className="text-center p-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">Lab Tested</h3>
              <p className="text-muted-foreground">
                Certified by independent laboratories for quality and authenticity.
              </p>
            </BrandCard>
          </div>
        </Container>
      </Section>

      {/* Featured Products Preview */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Our Premium Collection
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our range of pure, natural honey varieties, each with its unique flavor and benefits.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Raw Forest Honey', img: '/assets/generated/raw-forest-honey.dim_800x800.png' },
              { name: 'Organic Wild Honey', img: '/assets/generated/organic-wild-honey.dim_800x800.png' },
              { name: 'Herbal Infused Honey', img: '/assets/generated/herbal-infused-honey.dim_800x800.png' },
              { name: 'Honey Comb', img: '/assets/generated/honey-comb.dim_800x800.png' },
            ].map((product) => (
              <BrandCard key={product.name} className="overflow-hidden group cursor-pointer">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-serif font-semibold text-lg">{product.name}</h3>
                </div>
              </BrandCard>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate({ to: '/products' })}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              View All Products
            </Button>
          </div>
        </Container>
      </Section>

      {/* Quality Assurance */}
      <Section className="bg-muted/30">
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <img
              src="/assets/generated/quality-seal.dim_512x512.png"
              alt="Quality Seal"
              className="w-32 h-32 mx-auto"
            />
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              Certified Quality & Purity
            </h2>
            <p className="text-xl text-muted-foreground">
              Every jar of Beemedha honey is tested and certified by independent laboratories. We are committed to transparency and providing you with the purest honey nature has to offer.
            </p>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: '/certifications' })}
              className="font-semibold border-2"
            >
              View Our Certifications
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
