import { motion } from 'framer-motion';
import { Cpu, Server, Code, Bot, Shield, Database, Zap, LineChart, FileText, Users, ArrowRight, Rocket, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SectionTitle } from '@/components/SectionTitle';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { useCurrency } from '@/contexts/CurrencyContext';

const services = [
  {
    icon: Bot,
    title: 'AI Process Automation',
    slug: 'ai-process-automation',
    description: 'Design and implementation of AI-powered workflows to eliminate manual work, reduce errors, and improve speed across your entire operation.',
    features: [
      'Sales process automation',
      'Customer support triage & routing',
      'Internal reporting & analytics',
      'Finance & administrative automation',
      'Document processing & data entry',
    ],
  },
  {
    icon: Server,
    title: 'Business Systems & Infrastructure',
    slug: 'business-systems-infrastructure',
    description: 'Architecture, optimization, and oversight of business-critical systems to ensure reliability, security, and scalability as you grow.',
    features: [
      'Cloud & server architecture',
      'Network design & security',
      'System monitoring & reliability',
      'Scalability planning & optimization',
      'Disaster recovery & backup',
    ],
  },
  {
    icon: Code,
    title: 'Custom Software & Integrations',
    slug: 'custom-software-integrations',
    description: 'Custom-built software and system integrations perfectly aligned to your unique business workflows and requirements.',
    features: [
      'Internal tools & dashboards',
      'API integrations & connectors',
      'Data pipelines & ETL',
      'Automation backends',
      'Custom business applications',
    ],
  },
];

const rpaBots = [
  {
    name: 'Lead Qualification Bot',
    description: 'Automatically scores and routes incoming leads based on custom criteria.',
    useCases: ['CRM integration', 'Email parsing', 'Lead scoring'],
  },
  {
    name: 'Invoice Processing Bot',
    description: 'Extracts data from invoices and syncs to your accounting system.',
    useCases: ['PDF extraction', 'Data validation', 'ERP sync'],
  },
  {
    name: 'Customer Support Triage Bot',
    description: 'Routes support tickets to the right team and suggests responses.',
    useCases: ['Ticket classification', 'Priority assignment', 'Response templates'],
  },
  {
    name: 'Report Generation Bot',
    description: 'Compiles data from multiple sources into scheduled reports.',
    useCases: ['Multi-source data', 'Scheduled delivery', 'Custom formatting'],
  },
  {
    name: 'Data Entry Bot',
    description: 'Transfers data between systems eliminating manual copy-paste.',
    useCases: ['System sync', 'Batch processing', 'Error reduction'],
  },
  {
    name: 'Email Automation Bot',
    description: 'Sends personalized follow-ups and notifications based on triggers.',
    useCases: ['Trigger-based', 'Personalization', 'Scheduling'],
  },
];

const quickWinsFeatures = [
  'Identify your top 3 automation opportunities',
  'One fully functional automation deployed',
  'ROI analysis and documentation',
  'Training session for your team',
  'Integration with existing tools',
  '30-day support included',
];

const Services = () => {
  const { currency, formatPrice } = useCurrency();

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
              Services Built for <span className="gradient-text">Scale</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-10">
              Three integrated service areas that work together to transform your operations, eliminate waste, and drive continuous improvement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn-primary-glow px-8 py-4 rounded-lg font-semibold"
              >
                Get in Touch
              </Link>
              <Link
                to="/pricing"
                className="btn-outline-glow px-8 py-4 rounded-lg font-semibold"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badge */}
      <section className="py-8 border-y border-primary/10">
        <div className="container mx-auto px-6">
          <p className="text-center text-muted-foreground">
            Affordable AI & Systems Automation for <span className="text-primary">African businesses</span> — local expertise, no time-zone headaches
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="space-y-24">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                    <service.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                  </div>
                  <Link to={`/services/${service.slug}`}>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                      {service.title}
                    </h2>
                  </Link>
                  <p className="text-muted-foreground text-lg mb-8">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`service-card rounded-2xl p-8 glow-border ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="grid grid-cols-2 gap-6">
                    {[Zap, Shield, LineChart, Database].map((Icon, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="aspect-square rounded-xl bg-background/50 flex items-center justify-center border border-primary/10"
                      >
                        <Icon className="w-10 h-10 text-primary/60" strokeWidth={1} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Individual RPA Bots Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-circuit-pattern opacity-20" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <SectionTitle
                title="Individual RPA Bots"
                subtitle="Pre-built automation bots that can be customized for your specific needs. Deploy in days, not months."
                center={false}
              />
            </div>
            <CurrencySwitcher />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rpaBots.map((bot, index) => (
              <motion.div
                key={bot.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="service-card rounded-xl p-6 glow-border-hover"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {bot.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {bot.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {bot.useCases.map((useCase) => (
                    <span
                      key={useCase}
                      className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
                <div className="pt-4 border-t border-primary/10">
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <p className="text-xl font-bold text-foreground">
                    {currency === 'ZAR' ? 'R5,000 – R10,000' : '$275 – $550'}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-muted-foreground mb-4">
              Need a custom bot? We can build bespoke automation for your unique workflows.
            </p>
            <Link
              to="/contact"
              className="btn-outline-glow px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              Discuss Custom Bot
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Wins Package Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Quick Wins Package
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Not ready for a full retainer? Start with our Quick Wins Package — a focused engagement
                designed to deliver immediate value and prove ROI before committing to ongoing partnership.
              </p>
              <p className="text-muted-foreground mb-8">
                Perfect for businesses wanting to test the waters with automation or tackle a specific
                pain point quickly. We identify your highest-impact opportunity and deliver a working
                solution within weeks.
              </p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-foreground">
                  {currency === 'ZAR' ? 'R20,000' : '$1,100'}
                </span>
                <span className="text-muted-foreground">once-off</span>
              </div>
              <Link
                to="/contact"
                className="btn-primary-glow px-8 py-4 rounded-lg font-semibold inline-flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="service-card rounded-2xl p-8 glow-border"
            >
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                What's Included
              </h3>
              <ul className="space-y-4">
                {quickWinsFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm text-muted-foreground">
                  <span className="text-primary font-medium">Typical timeline:</span> 2-3 weeks from
                  kickoff to deployment. Includes discovery session, implementation, and handover.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-radial-glow opacity-50" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionTitle
            title="Not sure which service you need?"
            subtitle="Book a strategy call and we'll help you identify the right approach for your specific challenges."
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
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
