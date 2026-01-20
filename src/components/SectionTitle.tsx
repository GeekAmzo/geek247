import { motion } from 'framer-motion';

interface SectionTitleProps {
  label?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export const SectionTitle = ({ label, title, subtitle, center = true }: SectionTitleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`max-w-3xl ${center ? 'mx-auto text-center' : ''} mb-12`}
    >
      {label && (
        <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-3 block">
          {label}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
