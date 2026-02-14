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
      <Section className="relative py-32 md:py-40 overflow-hidden bg-gradient-to-b from-muted/30 to-background">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/generated/beemedha-hero.dim_1920x1080.png"
            alt="Pure honey from nature"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-10 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-foreground leading-tight tracking-tight">
              Pure Honey, Straight from Nature
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground font-light leading-relaxed">
              Experience the authentic taste of 100% natural honey, ethically sourced and lab-tested for purity.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate({ to: '/products' })}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-10 py-7 font-bold rounded-xl shadow-soft-lg hover:shadow-premium transition-all"
              >
                Shop Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: '/products' })}
                className="text-xl px-10 py-7 font-bold border-2 rounded-xl hover:bg-primary/5 transition-all"
              >
                Explore Our Honey
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Trust Highlights */}
      <Section className="bg-muted/40">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <BrandCard className="text-center p-10 hover:scale-105 transition-transform">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-accent/15 flex items-center justify-center">
                  <Leaf className="h-10 w-10 text-accent" />
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">100% Natural</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Pure honey with no additives, preservatives, or artificial ingredients.
              </p>
            </BrandCard>

            <BrandCard className="text-center p-10 hover:scale-105 transition-transform">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">No Adulteration</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Guaranteed purity with rigorous quality checks at every step.
              </p>
            </BrandCard>

            <BrandCard className="text-center p-10 hover:scale-105 transition-transform">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Award className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Lab Tested</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Certified by independent laboratories for quality and authenticity.
              </p>
            </BrandCard>
          </div>
        </Container>
      </Section>

      {/* Featured Products Preview */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-tight">
              Our Premium Collection
            </h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our range of pure, natural honey varieties, each with its unique flavor and benefits.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Raw Forest Honey', img: '/assets/generated/raw-forest-honey.dim_800x800.png' },
              { name: 'Organic Wild Honey', img: '/assets/generated/organic-wild-honey.dim_800x800.png' },
              { name: 'Herbal Infused Honey', img: '/assets/generated/herbal-infused-honey.dim_800x800.png' },
              { name: 'Honey Comb', img: '/assets/generated/honey-comb.dim_800x800.png' },
            ].map((product) => (
              <BrandCard key={product.name} className="overflow-hidden group cursor-pointer hover:shadow-premium transition-all">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif font-bold text-xl">{product.name}</h3>
                </div>
              </BrandCard>
            ))}
          </div>
          <div className="text-center mt-16">
            <Button
              size="lg"
              onClick={() => navigate({ to: '/products' })}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 font-bold rounded-xl shadow-soft-lg hover:shadow-premium transition-all"
            >
              View All Products
            </Button>
          </div>
        </Container>
      </Section>

      {/* Quality Assurance */}
      <Section className="bg-muted/40">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-tight">
              Quality You Can Trust
            </h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Every jar of our honey undergoes strict quality control to ensure you receive only the best.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { title: 'Lab Certified', desc: 'Tested for purity and quality' },
              { title: 'No Additives', desc: 'Pure honey, nothing else' },
              { title: 'Ethically Sourced', desc: 'Supporting local beekeepers' },
              { title: 'Fresh Harvest', desc: 'Directly from the hive' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-primary/15 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
