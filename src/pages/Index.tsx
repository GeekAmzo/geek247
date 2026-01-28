import { motion } from 'framer-motion';
import { Brain, Bot, Layers, Lightbulb, ArrowRight, Cog } from 'lucide-react';
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
    icon: Cog,
    title: 'Legacy System Automation',
    description: 'Modernize hydraulics, motors, and industrial equipment with smart controls.',
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

// Electric bolt paths for hero animation
const electricBolts = [
  { path: 'M0,50 L20,45 L15,55 L40,50 L35,60 L60,55', delay: 0 },
  { path: 'M100,30 L80,35 L85,25 L60,30 L65,20 L40,25', delay: 0.5 },
  { path: 'M0,70 L25,65 L20,75 L50,70', delay: 1 },
  { path: 'M100,80 L75,75 L80,85 L55,80', delay: 1.5 },
];

const processSteps = ['Discover', 'Design', 'Deploy', 'Evolve'];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Logo with Electric Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-[500px] h-[500px] md:w-[700px] md:h-[700px]"
          >
            {/* Main logo image */}
            <motion.img
              src="/Geek247 Logo.png"
              alt=""
              className="w-full h-full object-contain opacity-[0.08]"
              animate={{
                filter: [
                  'drop-shadow(0 0 20px rgba(0, 200, 255, 0.3))',
                  'drop-shadow(0 0 40px rgba(0, 200, 255, 0.5))',
                  'drop-shadow(0 0 20px rgba(0, 200, 255, 0.3))',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Electric pulse rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute inset-0 border-2 border-cyan-400/20 rounded-full"
                style={{ margin: `${i * 40}px` }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.8, 1.1, 0.8],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Electric spark particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`spark-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 3 === 0 ? '#00d4ff' : i % 3 === 1 ? '#a855f7' : '#22d3ee',
              boxShadow: `0 0 ${4 + (i % 3) * 2}px currentColor`,
            }}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, Math.random() * -300 - 100],
              x: [null, (Math.random() - 0.5) * 100],
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 3
            }}
          />
        ))}

        {/* Electric bolt SVG animations */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="electricGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {electricBolts.map((bolt, i) => (
            <motion.path
              key={`bolt-${i}`}
              d={bolt.path}
              fill="none"
              stroke="url(#electricGradient)"
              strokeWidth="0.3"
              filter="url(#electricGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatDelay: 2 + Math.random() * 2,
                delay: bolt.delay,
                ease: "easeOut"
              }}
            />
          ))}
          <defs>
            <linearGradient id="electricGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </svg>

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-purple-500/15 blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            x: [0, 30, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Circuit trace lines */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`trace-${i}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              style={{
                top: `${10 + i * 12}%`,
                left: i % 2 === 0 ? '0' : '20%',
                right: i % 2 === 0 ? '20%' : '0',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: [0, 1, 1, 0],
                opacity: [0, 0.8, 0.8, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut"
              }}
            />
          ))}
          {/* Vertical traces */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`vtrace-${i}`}
              className="absolute w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent"
              style={{
                left: `${15 + i * 15}%`,
                top: i % 2 === 0 ? '0' : '30%',
                bottom: i % 2 === 0 ? '30%' : '0',
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{
                scaleY: [0, 1, 1, 0],
                opacity: [0, 0.6, 0.6, 0],
              }}
              transition={{
                duration: 1.5,
                delay: 1 + i * 0.4,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Rotating hexagon frames */}
        <motion.div
          className="absolute w-[550px] h-[550px] md:w-[650px] md:h-[650px]"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            border: '1px solid rgba(0, 212, 255, 0.1)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full border border-cyan-500/10" style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }} />
        </motion.div>
        <motion.div
          className="absolute w-[480px] h-[480px] md:w-[580px] md:h-[580px]"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full border border-purple-500/10" style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }} />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            >
              AI That Never<br />
              <motion.span
                className="gradient-text"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(0, 212, 255, 0.3)',
                    '0 0 40px rgba(0, 212, 255, 0.5)',
                    '0 0 20px rgba(0, 212, 255, 0.3)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Stops Learning.
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-muted-foreground text-lg md:text-xl mb-10"
            >
              Custom AI systems • Automation • Intelligent Agents • Legacy System Modernization
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/contact"
                className="btn-primary-glow px-8 py-4 rounded-lg font-semibold text-base"
              >
                Start a Project
              </Link>
              <Link
                to="/services"
                className="btn-outline-glow px-8 py-4 rounded-lg font-semibold text-base"
              >
                See Our Work
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom electric glow line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="absolute bottom-20 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, #00d4ff, #a855f7, #00d4ff, transparent)',
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
          }}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-12">
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
