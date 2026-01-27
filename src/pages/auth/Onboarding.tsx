import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, LayoutGrid, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function Onboarding() {
  const { profile } = useUserAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-circuit-pattern opacity-20" />
        <div className="absolute inset-0 bg-radial-glow" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center mb-12"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 border border-green-500/30">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Welcome{profile?.fullName ? `, ${profile.fullName}` : ''}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Your account has been created. What would you like to do next?
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                to="/portal/book-meeting"
                className="block h-full p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <CalendarDays className="w-7 h-7 text-primary" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  Book a Consultation
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Schedule a free consultation to discuss your needs and find the right services for your business.
                </p>
                <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Schedule meeting
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                to="/portal"
                className="block h-full p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <LayoutGrid className="w-7 h-7 text-primary" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  Go to Dashboard
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Browse available services, manage subscriptions, and set up your account from the customer portal.
                </p>
                <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Open dashboard
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
