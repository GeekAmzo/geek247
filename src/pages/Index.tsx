import { motion } from 'framer-motion';
import { Brain, Bot, Layers, Lightbulb, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ServiceCard } from '@/components/ServiceCard';
import { SectionTitle } from '@/components/SectionTitle';
import logo from '@/assets/logo.png';

const services = [
  {
    icon: Brain,
    title: 'Custom AI Development',
    description: 'Tailored machine learning and LLM-powered systems built for real-world use.',
  },
  {
    icon: Bot,
    title: 'AI Agents & Automation',
    description: 'Intelligent agents that work 24/7 across your tools, data, and workflows.',
  },
  {
    icon: Layers,
    title: 'Product & Platform Engineering',
    description: 'From MVP to enterprise-scale AI infrastructure.',
  },
  {
    icon: Lightbulb,
    title: 'AI Strategy & Integration',
    description: "We don't just build — we architect for longevity.",
  },
];

const processSteps = ['Discover', 'Design', 'Deploy', 'Continu8'];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-circuit-pattern opacity-30" />
        <div className="absolute inset-0 bg-radial-glow" />
        
        {/* Animated lines */}
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Infinity Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <svg
                viewBox="0 0 200 80"
                className="w-48 h-24 mx-auto"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(185, 100%, 50%)" />
                    <stop offset="50%" stopColor="hsl(200, 100%, 55%)" />
                    <stop offset="100%" stopColor="hsl(185, 100%, 50%)" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M60 40 C60 15, 25 15, 25 40 C25 65, 60 65, 60 40 C60 15, 95 15, 95 40 C95 65, 60 65, 60 40
                     M140 40 C140 15, 175 15, 175 40 C175 65, 140 65, 140 40 C140 15, 105 15, 105 40 C105 65, 140 65, 140 40"
                  stroke="url(#heroGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  filter="url(#heroGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                />
                {/* Small glowing dots */}
                <motion.circle
                  cx="25"
                  cy="40"
                  r="3"
                  fill="hsl(185, 100%, 70%)"
                  filter="url(#heroGlow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <motion.circle
                  cx="100"
                  cy="40"
                  r="3"
                  fill="hsl(185, 100%, 70%)"
                  filter="url(#heroGlow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                />
                <motion.circle
                  cx="175"
                  cy="40"
                  r="3"
                  fill="hsl(185, 100%, 70%)"
                  filter="url(#heroGlow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                />
              </svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            >
              AI That Never<br />
              <span className="gradient-text">Stops Learning.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-muted-foreground text-lg md:text-xl mb-10"
            >
              Custom AI systems • Automation • Intelligent Agents • Scalable Architectures
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="mailto:amrish@geek247.co.za"
                className="btn-primary-glow px-8 py-4 rounded-lg font-semibold text-base"
              >
                Start a Project
              </a>
              <Link
                to="/services"
                className="btn-outline-glow px-8 py-4 rounded-lg font-semibold text-base"
              >
                See Our Work
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom glow line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="absolute bottom-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        />
      </section>

      {/* What Continu8 Does */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-radial-glow opacity-50" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionTitle
            title="What Continu8 Does"
            subtitle="Building AI systems that transform how businesses operate"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {services.map((service, index) => (
              <ServiceCard key={service.title} {...service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-circuit-pattern opacity-20" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-8"
          >
            {processSteps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <span className={`font-display text-xl md:text-3xl font-medium ${
                  index === processSteps.length - 1 ? 'gradient-text text-glow' : 'text-foreground'
                }`}>
                  {step}
                </span>
                {index < processSteps.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-primary" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Decorative infinity at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-16"
        >
          <svg
            viewBox="0 0 300 120"
            className="w-80 h-32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="bottomGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M90 60 C90 25, 40 25, 40 60 C40 95, 90 95, 90 60 C90 25, 140 25, 140 60 C140 95, 90 95, 90 60
                 M210 60 C210 25, 260 25, 260 60 C260 95, 210 95, 210 60 C210 25, 160 25, 160 60 C160 95, 210 95, 210 60"
              stroke="hsl(185, 100%, 50%)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#bottomGlow)"
              opacity="0.6"
            />
          </svg>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Continuous optimization, learning, and evolution — <span className="text-primary">baked in.</span>
          </motion.p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
