import { motion } from 'framer-motion';
import { ArrowRight, Search, FileText, Wrench, TrendingUp, RefreshCw } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SectionTitle } from '@/components/SectionTitle';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Discovery & Strategy Call',
    timeline: 'Week 1',
    description: 'We start with a deep-dive strategy call to understand your business, pain points, and goals. No sales pitch—just a genuine conversation about where you are and where you want to be.',
    deliverables: [
      'Complete operational assessment',
      'Identified bottlenecks and opportunities',
      'Clear understanding of priorities',
      'Mutual fit evaluation',
    ],
  },
  {
    number: '02',
    icon: FileText,
    title: 'Systems Audit & Roadmap',
    timeline: 'Week 2-3',
    description: 'We analyze your current systems, workflows, and tech stack. Then we create a detailed roadmap showing exactly what we\'ll build, in what order, and why.',
    deliverables: [
      'Complete systems audit report',
      'Prioritized implementation roadmap',
      'Cost-benefit analysis for each initiative',
      'Timeline with clear milestones',
    ],
  },
  {
    number: '03',
    icon: Wrench,
    title: 'Foundation Build',
    timeline: 'Month 1-2',
    description: 'We build the core infrastructure and critical automations first. This phase focuses on quick wins that deliver immediate value while laying the groundwork for long-term improvements.',
    deliverables: [
      'Core systems architecture in place',
      'First wave of automation live',
      'Initial integrations connected',
      'Team training on new systems',
    ],
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Expansion & Optimization',
    timeline: 'Month 3-6',
    description: 'With foundations solid, we expand automation coverage and optimize for performance. Each month adds more value as we learn your systems and find new opportunities.',
    deliverables: [
      'Expanded automation workflows',
      'Performance optimization',
      'Additional integrations',
      'Advanced reporting and analytics',
    ],
  },
  {
    number: '05',
    icon: RefreshCw,
    title: 'Continuous Improvement',
    timeline: 'Ongoing',
    description: 'Your operations never stop evolving, and neither do we. Monthly strategy sessions identify new opportunities, and we continuously refine and extend your systems.',
    deliverables: [
      'Monthly optimization cycles',
      'New automation opportunities',
      'System health monitoring',
      'Strategic business alignment',
    ],
  },
];

const HowItWorks = () => {
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
              How We <span className="gradient-text">Work</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-10">
              A proven 5-step process for transforming your operations from manual and chaotic to automated and scalable.
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

      {/* Process Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <SectionTitle
            title="The Process"
            subtitle="From initial conversation to continuous improvement, here's exactly how we work together"
          />

          <div className="relative mt-16">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent hidden md:block" />

            <div className="space-y-12 md:space-y-24">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`relative grid md:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={`${index % 2 === 1 ? 'md:order-2 md:text-left' : 'md:text-right'}`}>
                    <div className={`${index % 2 === 1 ? '' : 'md:ml-auto'} max-w-lg`}>
                      <div className={`flex items-center gap-4 mb-4 ${index % 2 === 1 ? '' : 'md:justify-end'}`}>
                        <span className="text-6xl font-display font-bold text-primary/20">
                          {step.number}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                          <step.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-primary text-sm font-medium">{step.timeline}</span>
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Card */}
                  <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                    <div className="service-card rounded-xl p-6 glow-border">
                      <h4 className="font-semibold text-foreground mb-4">Deliverables</h4>
                      <ul className="space-y-3">
                        {step.deliverables.map((deliverable) => (
                          <li key={deliverable} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-radial-glow opacity-50" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionTitle
            title="Ready to Start?"
            subtitle="Book a strategy call and let's discuss how we can transform your operations."
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

export default HowItWorks;
