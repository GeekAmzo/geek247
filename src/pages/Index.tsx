import { motion } from 'framer-motion';
import { Brain, Bot, Layers, Lightbulb, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ServiceCard } from '@/components/ServiceCard';
import { SectionTitle } from '@/components/SectionTitle';

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

const processSteps = ['Discover', 'Design', 'Deploy', 'Evolve'];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 5
            }}
          />
        ))}

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 30, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Animated grid lines */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
              style={{ top: `${(i + 1) * 10}%` }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 0.5, 0] }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 5
              }}
            />
          ))}
        </div>

        {/* Rotating ring animation */}
        <motion.div
          className="absolute w-[600px] h-[600px] border border-primary/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] border border-cyan-500/10 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">

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

      {/* What Geek247 Does */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-radial-glow opacity-50" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionTitle
            title="What Geek247 Does"
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
