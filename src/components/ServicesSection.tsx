import { Car, Shield, Truck, BadgeDollarSign, Wrench, FileCheck } from 'lucide-react';

const services = [
  {
    icon: BadgeDollarSign,
    title: 'Flexible Financing',
    desc: 'Tailored finance plans with competitive rates, approved in minutes.',
  },
  {
    icon: FileCheck,
    title: 'Trade-In Program',
    desc: 'Get top dollar for your current vehicle with instant valuations.',
  },
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    desc: 'Your dream car delivered to your doorstep, anywhere in the country.',
  },
  {
    icon: Shield,
    title: 'Warranty Coverage',
    desc: 'Comprehensive warranty options for complete peace of mind.',
  },
  {
    icon: Wrench,
    title: 'Full Inspection',
    desc: 'Every vehicle passes a rigorous 150+ point inspection before listing.',
  },
  {
    icon: Car,
    title: 'Test Drive Experience',
    desc: 'Book a personal test drive at our showroom or at your home.',
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">World-Class</span> Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From financing to delivery, we handle every detail so you can focus on the drive.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="group p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center mb-4 group-hover:from-primary group-hover:to-orange-600 transition-all duration-300">
                <s.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
