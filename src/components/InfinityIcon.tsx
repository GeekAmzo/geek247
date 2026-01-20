import { motion } from 'framer-motion';

export const InfinityIcon = ({ className = "w-32 h-32" }: { className?: string }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <svg
        viewBox="0 0 200 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow filter */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(185, 100%, 50%)" />
            <stop offset="50%" stopColor="hsl(200, 100%, 50%)" />
            <stop offset="100%" stopColor="hsl(185, 100%, 50%)" />
          </linearGradient>
        </defs>
        
        {/* Main infinity path */}
        <motion.path
          d="M50 50 C50 20, 20 20, 20 50 C20 80, 50 80, 50 50 C50 20, 80 20, 80 50 C80 80, 50 80, 50 50 
             M100 50 C100 20, 130 20, 130 50 C130 80, 100 80, 100 50 C100 20, 70 20, 70 50 C70 80, 100 80, 100 50"
          stroke="url(#infinityGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Animated pulse along the path */}
        <motion.circle
          r="4"
          fill="hsl(185, 100%, 70%)"
          filter="url(#glow)"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            offsetDistance: ["0%", "100%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            offsetPath: "path('M50 50 C50 20, 20 20, 20 50 C20 80, 50 80, 50 50 C50 20, 80 20, 80 50 C80 80, 50 80, 50 50')",
          }}
        />
      </svg>
    </motion.div>
  );
};
