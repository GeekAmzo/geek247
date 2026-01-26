import { motion } from 'framer-motion';
import { ArrowRight, Target, Zap, Shield, Bot, Server, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SectionTitle } from '@/components/SectionTitle';

const values = [
  {
    icon: Target,
    title: 'Precision',
    description: 'We build exactly what you need, nothing more, nothing less. Every system, every automation, every line of code serves a clear business purpose.',
  },
  {
    icon: Zap,
    title: 'Speed',
    description: 'We move fast without breaking things. Rapid iteration, continuous delivery, and quick wins that build momentum toward bigger goals.',
  },
  {
    icon: Shield,
    title: 'Reliability',
    description: 'Your business depends on these systems. We build for uptime, security, and stability—because downtime costs money and trust.',
  },
];

const expertise = [
  {
    icon: Bot,
    title: 'AI & Automation',
    description: "We've built automation workflows that save businesses hundreds of hours per month, from lead qualification to support triage to invoice processing.",
  },
  {
    icon: Server,
    title: 'Systems Architecture',
    description: 'Cloud infrastructure, database design, API integrations, and scalable backend systems that handle growth without breaking.',
  },
  {
    icon: Briefcase,
    title: 'Business Process',
    description: "We understand how businesses actually work. CRM, sales pipelines, support workflows, finance operations—we've optimized them all.",
  },
];

const About = () => {
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
              Built <span className="gradient-text">Different</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-10">
              We're not a typical development agency. We're systems thinkers who build automation and infrastructure for businesses that want to scale without chaos.
            </p>
            <Link
              to="/contact"
              className="btn-primary-glow px-8 py-4 rounded-lg font-semibold inline-block"
            >
              Get in Touch
            </Link>
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

      {/* Mission */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <SectionTitle title="Our Mission" center={false} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6 text-lg text-muted-foreground"
            >
              <p>
                Most businesses grow to a point where manual processes and disconnected systems become expensive bottlenecks.
              </p>
              <p>
                We exist to solve that problem—not with one-off projects, but with ongoing systems partnership that compounds value over time.
              </p>
              <p className="text-foreground">
                We build the infrastructure that lets you focus on growing your business instead of fighting operational fires.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-radial-glow opacity-30" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionTitle
            title="Core Values"
            subtitle="The principles that guide every decision we make"
          />
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="service-card rounded-xl p-8 glow-border-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                  <value.icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <SectionTitle
            title="What We're Good At"
            subtitle="Deep expertise across the full stack of business systems"
          />
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {expertise.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="service-card rounded-xl p-8 glow-border-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                  <item.icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Model */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-circuit-pattern opacity-20" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <SectionTitle
              title="Not a Vendor. A Partner."
              subtitle="We don't do one-off projects. We work on retainer as your ongoing systems partner—always learning, always improving, always aligned with your goals."
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="service-card rounded-2xl p-8 md:p-12 glow-border mt-12"
            >
              <p className="text-xl text-foreground mb-6">
                "We build systems that compound value over time. The longer we work together, the more we understand your business, and the more valuable our work becomes."
              </p>
              <p className="text-primary font-semibold">
                Continuous optimization, learning, and evolution — baked in.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-radial-glow opacity-50" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionTitle
            title="Let's Build Something Great"
            subtitle="Ready to transform your operations with intelligent automation?"
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

export default About;
