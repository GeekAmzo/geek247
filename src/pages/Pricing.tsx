import { motion } from 'framer-motion';
import { Check, ArrowRight, Clock, Target, Gauge } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SectionTitle } from '@/components/SectionTitle';

const pricingPlans = [
  {
    popular: true,
    name: 'AI & Systems Automation Retainer',
    description: 'Continuous optimization and improvement',
    price: 'R60,000 – R100,000',
    period: '/month',
    features: [
      'Ongoing AI automation implementation',
      'Process optimization and improvement',
      'Systems oversight and maintenance',
      'Monthly strategy sessions',
      'Priority support',
      'Continuous monitoring and improvements',
      'Quarterly business review',
    ],
  },
  {
    name: 'Build + Retain Engagement',
    description: 'Major build followed by ongoing optimization',
    price: 'R150,000 – R300,000',
    period: ' once-off',
    subPrice: 'then R50k – R80k/month',
    features: [
      'Comprehensive process audit and mapping',
      'Initial system build and deployment',
      'Team training and handover',
      'Transition to ongoing retainer',
      'Continuous improvement and support',
      'Monthly optimization sessions',
    ],
  },
  {
    name: 'Paid Process Audit',
    description: 'Deep dive into your operations',
    price: 'R25,000 – R50,000',
    period: ' once-off',
    features: [
      'Comprehensive operational review',
      'Automation opportunity identification',
      'ROI projections and roadmap',
      'Prioritized implementation plan',
      'Technology stack recommendations',
      'Detailed written report',
    ],
  },
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

const Pricing = () => {
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
              Clear, Outcome-Based <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-10">
              No hourly billing. No project-based pricing. Just predictable monthly investments that deliver compound value over time.
            </p>
            <a
              href="mailto:amrish@geek247.co.za"
              className="btn-primary-glow px-8 py-4 rounded-lg font-semibold inline-block"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>

      {/* Trust Badge */}
      <section className="py-8 border-y border-primary/10">
        <div className="container mx-auto px-6">
          <p className="text-center text-muted-foreground">
            Trusted by businesses doing <span className="text-primary">R10m-R200m</span> in annual revenue
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
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </div>
                <div className="mb-6">
                  <span className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                  {plan.subPrice && (
                    <p className="text-primary text-sm mt-1">{plan.subPrice}</p>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:amrish@geek247.co.za"
                  className={`w-full py-3 rounded-lg font-semibold text-center block transition-all ${
                    plan.popular
                      ? 'btn-primary-glow'
                      : 'btn-outline-glow'
                  }`}
                >
                  Get in Touch
                </a>
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
            title="Ready to Transform Your Operations?"
            subtitle="Let's discuss how we can help streamline your business with intelligent automation."
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <a
              href="mailto:amrish@geek247.co.za"
              className="btn-primary-glow px-8 py-4 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              Start a Conversation
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
