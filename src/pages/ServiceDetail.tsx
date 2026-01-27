import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FeatureList } from '@/components/FeatureList';
import { FaqSection } from '@/components/FaqSection';
import { ServicePriceDisplay } from '@/components/ServicePriceDisplay';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { useService } from '@/hooks/useServices';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { CheckoutDialog } from '@/components/checkout/CheckoutDialog';

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: service, isLoading, error } = useService(slug);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 container mx-auto px-6">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 container mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The service you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/services"
            className="btn-primary-glow px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-circuit-pattern opacity-20" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="container mx-auto px-6 relative z-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {service.title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mb-8">
              {service.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <ServicePriceDisplay
                zarMinCents={service.pricingZarMinCents}
                zarMaxCents={service.pricingZarMaxCents}
                usdMinCents={service.pricingUsdMinCents}
                usdMaxCents={service.pricingUsdMaxCents}
                billingInterval={service.billingInterval}
                size="lg"
              />
              <CurrencySwitcher />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      {service.longDescription && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="prose prose-invert max-w-3xl">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {service.longDescription}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {(service.featuresIncluded.length > 0 || service.featuresNotIncluded.length > 0) && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              {service.featuresIncluded.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="service-card rounded-2xl p-8 glow-border"
                >
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    What's Included
                  </h2>
                  <FeatureList features={service.featuresIncluded} variant="included" />
                </motion.div>
              )}

              {service.featuresNotIncluded.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="service-card rounded-2xl p-8"
                >
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Not Included
                  </h2>
                  <FeatureList features={service.featuresNotIncluded} variant="excluded" />
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {service.faqs.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="max-w-2xl mx-auto">
              <FaqSection faqs={service.faqs} />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-radial-glow opacity-50" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Subscribe to {service.title} and start transforming your operations today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCheckoutOpen(true)}
              className="btn-primary-glow px-8 py-4 rounded-lg font-semibold inline-flex items-center gap-2 justify-center"
            >
              Subscribe Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/contact"
              className="btn-outline-glow px-8 py-4 rounded-lg font-semibold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        service={service}
      />

      <Footer />
    </div>
  );
};

export default ServiceDetail;
