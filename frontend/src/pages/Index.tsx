import { Link } from 'react-router-dom';
import { QrCode, UtensilsCrossed, Users, ArrowRight, Smartphone, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
        <div className="relative container py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <QrCode className="w-4 h-4" />
              QR-Based Restaurant Ordering
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Seamless Dining,
              <br />
              <span className="text-primary">Effortless Ordering</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Scan the QR code at your table, browse the menu, and place orders instantly. 
              No app downloads, no login required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/menu?restaurant=1&table=5">
                <Button size="xl" className="gap-2">
                  <Smartphone className="w-5 h-5" />
                  Try Demo Menu
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button variant="outline" size="xl" className="gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Staff Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="container py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Scan & Order
            </h3>
            <p className="text-muted-foreground">
              Customers scan the table QR code and instantly access the menu. 
              No downloads or sign-ups needed.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <UtensilsCrossed className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Easy Menu Management
            </h3>
            <p className="text-muted-foreground">
              Restaurant staff can update menus in real-time. 
              Add items, update prices, or import via CSV.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Order Dashboard
            </h3>
            <p className="text-muted-foreground">
              Track all orders in real-time. Update status, manage queues, 
              and keep customers informed.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card py-16">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Scan QR', desc: 'Scan the QR code on your table' },
              { step: '2', title: 'Browse Menu', desc: 'View items, filter by preferences' },
              { step: '3', title: 'Place Order', desc: 'Add to cart, enter phone & table' },
              { step: '4', title: 'Get Notified', desc: 'Track your order status in real-time' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 text-center">
        <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background rounded-3xl p-8 md:p-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to modernize your restaurant?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Connect your Django backend to this frontend and start accepting digital orders today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/menu?restaurant=1&table=5">
              <Button size="lg">View Customer Demo</Button>
            </Link>
            <Link to="/admin/login">
              <Button variant="outline" size="lg">View Admin Demo</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Restaurant Ordering System • Frontend Demo</p>
          <p className="mt-1">Connect to your Django backend to go live</p>
        </div>
      </footer>
    </div>
  );
}
