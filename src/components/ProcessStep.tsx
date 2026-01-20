import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ProcessStepProps {
  step: string;
  isLast?: boolean;
  index: number;
}

export const ProcessStep = ({ step, isLast = false, index }: ProcessStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      viewport={{ once: true }}
      className="flex items-center gap-4"
    >
      <span className="font-display text-xl md:text-2xl font-medium text-foreground">
        {step}
      </span>
      {!isLast && (
        <ArrowRight className="w-6 h-6 text-primary" />
      )}
    </motion.div>
  );
};
