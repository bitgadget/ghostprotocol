import React from 'react';
import { motion } from 'framer-motion';

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

export const CyberButton: React.FC<CyberButtonProps> = ({ children, onClick, variant = 'primary', className = '' }) => {
  const baseStyles = "relative px-6 py-3 font-mono text-lg uppercase tracking-widest transition-all duration-200 clip-path-polygon group overflow-hidden";
  
  const variants = {
    primary: "bg-cyber-black border border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-black",
    secondary: "bg-transparent border border-cyber-dim text-cyber-dim hover:border-cyber-green hover:text-cyber-green",
    danger: "bg-cyber-black border border-cyber-alert text-cyber-alert hover:bg-cyber-alert hover:text-white"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {/* Glitch overlay effect on hover */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-75" />
    </motion.button>
  );
};