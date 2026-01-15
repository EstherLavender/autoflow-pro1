import { Car, Droplets, MapPin, Sparkles, ArrowRight, Shield, Smartphone, Gift, Users, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: Smartphone,
    title: 'Book in 2 Taps',
    description: 'Get your car washed from anywhere in Nairobi with just a few taps',
  },
  {
    icon: MapPin,
    title: 'Mobile or Location',
    description: 'Choose a nearby car wash or get a detailer to come to you',
  },
  {
    icon: Shield,
    title: 'M-Pesa Payment',
    description: 'Pay seamlessly with M-Pesa. No cash, no hassle',
  },
  {
    icon: Gift,
    title: 'Earn Free Washes',
    description: 'Every 10th wash is FREE with our loyalty rewards',
  },
];

const stats = [
  { value: '10K+', label: 'Cars Washed' },
  { value: '50+', label: 'Locations' },
  { value: '98%', label: 'Happy Customers' },
  { value: 'KES 300', label: 'Starting Price' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="container py-4" style={{ background: 'var(--gradient-hero)' }}>
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
              <Droplets className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">TRACK WASH</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="hero" onClick={() => navigate('/login')}>
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        {/* Hero Background Image with Lazy Loading */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/herobg.JPG" 
            alt="Car wash background"
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
          {/* Dark overlay for text readability */}
          <div 
            className="absolute inset-0" 
            style={{ background: 'var(--gradient-hero)' }}
          />
        </div>
        
        {/* Hero Content */}
        <div className="container pt-16 pb-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            <span>Nairobi's #1 Car Wash Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-slide-up">
            Your Car, Sparkling{' '}
            <span className="text-gradient">Clean</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Book a car wash like you book a ride. Find nearby car washes, track your service, 
            pay with M-Pesa, and earn free washes. Safi sana!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button variant="hero" size="xl" onClick={() => navigate('/login')}>
              Wash My Car
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="hero-outline" size="xl" onClick={() => navigate('/login')}>
              I'm a Car Wash Owner
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="text-center animate-slide-up"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Preview */}
      <section className="container pb-24">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Droplets, title: 'Basic Wash', desc: 'Quick exterior wash - KES 300', price: 300 },
            { icon: Car, title: 'Full Detailing', desc: 'Interior & exterior deep clean - KES 1,500', price: 1500 },
            { icon: Users, title: 'Mobile Service', desc: 'We come to you - KES 800+', price: 800 },
          ].map((item, index) => (
            <Card 
              key={item.title} 
              variant="elevated" 
              className="text-center animate-slide-up"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <CardContent className="pt-8 pb-6">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-card border-y border-border py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why TRACK WASH?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We make car care easy, affordable, and rewarding for every Nairobian.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                variant="interactive" 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24">
        <Card variant="elevated" className="max-w-3xl mx-auto overflow-hidden">
          <div className="p-8 md:p-12 text-center" style={{ background: 'var(--gradient-primary)' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Ready to Get Your Car Washed?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Join thousands of happy car owners in Nairobi. Book your first wash today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg" 
                className="font-semibold"
                onClick={() => navigate('/login')}
              >
                Book Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-primary-foreground/70 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Pay with M-Pesa
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> 10th Wash Free
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Droplets className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">TRACK WASH</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Track Wash. Nairobi's favorite car wash platform.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
