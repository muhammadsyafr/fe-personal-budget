import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : {}}
      className={`
        bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 
        rounded-2xl p-5 shadow-xl
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`
        bg-slate-800/30 backdrop-blur-lg border border-slate-700/30 
        rounded-2xl p-4
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
