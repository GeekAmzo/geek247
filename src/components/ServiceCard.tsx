import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export const ServiceCard = ({ icon: Icon, title, description, index }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="service-card rounded-xl p-6 glow-border-hover transition-all duration-500"
    >
      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-5 border border-primary/20">
        <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
      </div>
      <h3 className="font-display font-semibold text-lg text-foreground mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};
