import { motion } from 'framer-motion';
import { Check, ArrowRight, Clock, Target, Gauge, Globe, Users, Shield, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SectionTitle } from '@/components/SectionTitle';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PricingItem {
  label: string;
  zarPrice: string;
  usdPrice: string;
  period: string;
}

interface PricingPlan {
  name: string;
  description: string;
  tagline: string;
  pricing: PricingItem[];
  bundleDiscount?: string;
  features: string[];
  popular?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter Tier',
    description: 'For startups & micro-businesses',
    tagline: 'Quick wins to free up your time',
    pricing: [
      { label: 'Process Audit', zarPrice: 'R8,000 – R15,000', usdPrice: '$440 – $825', period: 'once-off' },
      { label: 'Initial Build', zarPrice: 'R40,000 – R80,000', usdPrice: '$2,200 – $4,400', period: 'once-off' },
      { label: 'Ongoing Retainer', zarPrice: 'R15,000 – R25,000', usdPrice: '$825 – $1,375', period: '/month' },
    ],
    features: [
      'Simple automation implementations',
      'Process audit and mapping',
      'Basic workflow optimization',
      'Email & chat support',
      'Monthly check-ins',
    ],
  },
  {
    popular: true,
    name: 'Growth Tier',
    description: 'For growing SMEs',
    tagline: 'Scale operations efficiently',
    pricing: [
      { label: 'Process Audit', zarPrice: 'R15,000 – R30,000', usdPrice: '$825 – $1,650', period: 'once-off' },
      { label: 'Initial Build', zarPrice: 'R80,000 – R150,000', usdPrice: '$4,400 – $8,250', period: 'once-off' },
      { label: 'Ongoing Retainer', zarPrice: 'R25,000 – R45,000', usdPrice: '$1,375 – $2,475', period: '/month' },
    ],
    bundleDiscount: '10–15% discount when committing to 6+ months',
    features: [
      'Advanced automation workflows',
      'Multi-system integrations',
      'Team training and handover',
      'Priority support',
      'Bi-weekly strategy sessions',
      'ROI tracking and reporting',
    ],
  },
  {
    name: 'Scale Tier',
    description: 'For mid-to-large businesses',
    tagline: 'Enterprise-grade transformation',
    pricing: [
      { label: 'Deep Dive Audit', zarPrice: 'R30,000 – R50,000', usdPrice: '$1,650 – $2,750', period: 'once-off' },
      { label: 'Custom Build', zarPrice: 'R150,000 – R250,000+', usdPrice: '$8,250 – $13,750+', period: 'once-off' },
      { label: 'Dedicated Retainer', zarPrice: 'R45,000 – R70,000+', usdPrice: '$2,475 – $3,850+', period: '/month' },
    ],
    bundleDiscount: '15–20% discount on annual commitment',
    features: [
      'Enterprise-grade solutions',
      'Custom software development',
      'Dedicated account manager',
      'Weekly strategy sessions',
      'Full system oversight',
      'Disaster recovery planning',
      'Quarterly business reviews',
    ],
  },
];

interface AddOn {
  name: string;
  zarPrice: string;
  usdPrice: string;
  link?: string;
}

const addOns: AddOn[] = [
  { name: 'Individual RPA Bots', zarPrice: 'R5,000 – R10,000/month per bot', usdPrice: '$275 – $550/month per bot', link: '/services#rpa-bots' },
  { name: 'Quick Wins Package', zarPrice: 'R20,000 once-off', usdPrice: '$1,100 once-off', link: '/services#quick-wins' },
];

const principles = [
  {
    icon: Target,
    title: 'Outcome-Based',
    description: 'We charge for results and value delivered, not hours worked.',
  },
  {
    icon: Clock,
    title: 'Retainer-Focused',
    description: 'Monthly retainers ensure continuous improvement, not one-off projects.',
  },
  {
    icon: Gauge,
    title: 'No Hourly Billing',
    description: 'Predictable monthly investment with unlimited strategic value.',
  },
];

const whyChooseUs = [
  {
    icon: Globe,
    title: 'Same-Continent Time Zones',
    description: 'No 3am calls or 24-hour wait times. Real-time collaboration during your business hours.',
  },
  {
    icon: Users,
    title: 'Cultural Alignment',
    description: 'We understand African business contexts, challenges, and opportunities.',
  },
  {
    icon: Briefcase,
    title: 'Direct Accountability',
    description: 'Faster iterations, clearer communication, and no offshore runaround.',
  },
  {
    icon: Shield,
    title: 'Full Compliance',
    description: 'POPIA and GDPR compliant. Your data stays protected.',
  },
];

const Pricing = () => {
  const { currency } = useCurrency();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-circuit-pattern opacity-20" />
        <div className="absolute inset-0 bg-radial-glow" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Automation Built for <span className="gradient-text">Africa</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-4">
              Local expertise. Same-continent support. No time-zone headaches.
            </p>
            <p className="text-primary text-lg md:text-xl mb-6">
              Beat offshore pricing with Johannesburg-based reliability.
            </p>
            <div className="flex justify-center mb-10">
              <CurrencySwitcher />
            </div>
            <Link
              to="/contact"
              className="btn-primary-glow px-8 py-4 rounded-lg font-semibold inline-block"
            >
              Book a Free Scoping Call
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Badge */}
      <section className="py-8 border-y border-primary/10">
        <div className="container mx-auto px-6">
          <p className="text-center text-muted-foreground">
            Affordable AI & Systems Automation for <span className="text-primary">African businesses</span> — better quality and communication than offshore outsourcing
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto border border-primary/20">
                  <principle.icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                  {principle.title}
                </h3>
                <p className="text-muted-foreground">
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <SectionTitle
              title="Our Packages"
              subtitle="Flexible tiers to suit every business stage — from startups to enterprises. All packages include clear ROI projections and African-focused support."
              center={false}
            />
            <CurrencySwitcher className="self-start md:self-auto" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className={`relative service-card rounded-2xl p-8 ${
                  plan.popular ? 'glow-border border-primary/40' : 'border border-primary/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-primary-foreground text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-primary text-sm font-medium mb-1">
                    {plan.description}
                  </p>
                  <p className="text-muted-foreground text-sm italic">
                    {plan.tagline}
                  </p>
                </div>
                <div className="mb-6 space-y-3">
                  {plan.pricing.map((item) => (
                    <div key={item.label} className="flex justify-between items-baseline">
                      <span className="text-muted-foreground text-sm">{item.label}</span>
                      <span className="text-foreground font-semibold text-sm">
                        {currency === 'ZAR' ? item.zarPrice : item.usdPrice}
                        <span className="text-muted-foreground font-normal text-xs ml-1">{item.period}</span>
                      </span>
                    </div>
                  ))}
                </div>
                {plan.bundleDiscount && (
                  <div className="mb-6 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-primary text-sm font-medium">
                      {plan.bundleDiscount}
                    </p>
                  </div>
                )}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`w-full py-3 rounded-lg font-semibold text-center block transition-all ${
                    plan.popular
                      ? 'btn-primary-glow'
                      : 'btn-outline-glow'
                  }`}
                >
                  Get in Touch
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-16 border-y border-primary/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h3 className="font-display text-2xl font-semibold text-foreground mb-6 text-center">
              Add-Ons
            </h3>
            <div className="space-y-4">
              {addOns.map((addon) => (
                <Link
                  key={addon.name}
                  to={addon.link || '/services'}
                  className="flex justify-between items-center p-4 rounded-lg bg-surface-darker border border-primary/10 hover:border-primary/30 transition-colors"
                >
                  <span className="text-foreground">{addon.name}</span>
                  <span className="text-primary font-semibold">
                    {currency === 'ZAR' ? addon.zarPrice : addon.usdPrice}
                  </span>
                </Link>
              ))}
            </div>
            <p className="text-center text-muted-foreground text-sm mt-6">
              {currency === 'USD'
                ? 'USD pricing available for businesses outside South Africa'
                : 'Switch to USD for pricing outside South Africa'
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <SectionTitle
            title="Why Choose Us Over Offshore Outsourcing?"
            subtitle="Get better quality, faster communication, and support African expertise"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto border border-primary/20">
                  <item.icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-radial-glow opacity-50" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionTitle
            title="Ready to Automate?"
            subtitle="Book a free 30-minute scoping call. We'll review your processes and show potential ROI — no obligation."
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link
              to="/contact"
              className="btn-primary-glow px-8 py-4 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              Book a Free Scoping Call
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
