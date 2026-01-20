import { motion } from 'framer-motion';
import { Cpu, Server, Code, Bot, Shield, Database, Zap, LineChart, FileText, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SectionTitle } from '@/components/SectionTitle';

const services = [
  {
    icon: Bot,
    title: 'AI Process Automation',
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

const Services = () => {
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
              <a
                href="mailto:amrish@geek247.co.za"
                className="btn-primary-glow px-8 py-4 rounded-lg font-semibold"
              >
                Get in Touch
              </a>
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
            Trusted by businesses doing <span className="text-primary">R10m-R200m</span> in annual revenue
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
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {service.title}
                  </h2>
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
            <a
              href="mailto:amrish@geek247.co.za"
              className="btn-primary-glow px-8 py-4 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
