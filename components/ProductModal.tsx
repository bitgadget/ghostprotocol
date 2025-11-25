
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, ShieldCheck, Terminal, Cpu, Activity } from 'lucide-react';
import { Product } from '../types';
import { CyberButton } from './CyberButton';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
          
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full h-full md:w-[90vw] md:max-w-5xl md:h-[85vh] bg-cyber-black border border-cyber-green shadow-[0_0_50px_rgba(0,255,65,0.15)] flex flex-col md:flex-row overflow-hidden md:rounded-sm z-10"
          >
             {/* Desktop Only: Decorative Corner Accents */}
             <div className="hidden md:block absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-cyber-green pointer-events-none z-20" />
             <div className="hidden md:block absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-cyber-green pointer-events-none z-20" />
             
             {/* Close Button - Sticky on mobile to ensure visibility */}
             <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-50 bg-black/80 text-cyber-dim hover:text-cyber-alert border border-cyber-dim p-2 hover:rotate-90 duration-300 backdrop-blur-sm rounded-full md:rounded-none"
             >
                <X size={24} />
             </button>

             {/* Image Area 
                 Mobile: Top 35% height
                 Desktop: Left 50% width, Full height
             */}
             <div className="w-full h-[35vh] md:w-1/2 md:h-full shrink-0 relative bg-black overflow-hidden group border-b md:border-b-0 md:border-r border-cyber-dim/30">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0"
                />
                
                {/* Visual Effects */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[length:32px_32px] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-green/10 to-transparent h-[20%] animate-scan-vertical pointer-events-none" />
                
                <div className="absolute bottom-4 left-4 bg-black/80 border border-cyber-dim px-3 py-1 text-[10px] md:text-xs font-mono text-cyber-green backdrop-blur-sm">
                   IMG_SOURCE: ENCRYPTED // 1024x1024
                </div>
             </div>

             {/* Content Area 
                 Scrollable independently
             */}
             <div className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto scrollbar-thin bg-cyber-black relative">
                
                <div className="mb-2 flex items-center gap-2 text-cyber-dim text-[10px] md:text-xs font-mono tracking-widest border-b border-cyber-dim/20 pb-2">
                    <Terminal size={14} />
                    <span>PRODUCT_DB_ID: {product.id.toUpperCase()}</span>
                </div>

                <h2 className="text-2xl md:text-4xl font-bold font-mono text-white mb-4 uppercase leading-tight tracking-tight">
                    {product.name}
                </h2>

                <div className="flex flex-wrap items-center gap-4 mb-6 md:mb-8">
                    <span className="text-2xl md:text-3xl text-cyber-green font-bold font-mono">€{product.price.toFixed(2)}</span>
                    <span className="bg-cyber-dim/10 text-cyber-dim px-2 py-1 text-xs border border-cyber-dim/30">
                        STOCK: AVAILABLE
                    </span>
                </div>

                <div className="prose prose-invert prose-sm mb-8 font-mono text-gray-400 border-l-2 border-cyber-dim/30 pl-4">
                    <p className="mb-4">{product.description}</p>
                    <p className="text-xs md:text-sm">
                        Dispositivo certificato per operazioni in ambiente ostile. 
                        Tutti i metadati sono stati rimossi. Hardware sottoposto a sanitizzazione forense prima della spedizione.
                    </p>
                </div>

                {/* Specs Grid */}
                <div className="mb-8">
                    <h3 className="text-white font-bold uppercase text-sm mb-4 flex items-center gap-2">
                        <Cpu size={16} className="text-cyber-green" /> Technical Specifications
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                        {product.specs.map((spec, i) => (
                            <div key={i} className="flex justify-between items-center bg-cyber-dark/30 p-3 border border-cyber-dim/20 hover:border-cyber-green/50 transition-colors">
                                <span className="text-gray-400 text-xs md:text-sm font-mono">{spec}</span>
                                <Activity size={14} className="text-cyber-dim shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Action - Pushed to bottom of scroll if content is short, otherwise scrolls with content */}
                <div className="mt-auto pt-6 border-t border-cyber-dim/20 flex flex-col gap-4">
                    <CyberButton 
                        onClick={() => {
                            onAddToCart(product);
                            onClose();
                        }} 
                        variant="primary" 
                        className="w-full justify-center py-4 text-lg"
                    >
                        <span className="flex items-center gap-3">
                            <ShoppingCart /> AGGIUNGI AL CARRELLO
                        </span>
                    </CyberButton>
                    
                    <div className="flex justify-center items-center gap-2 text-[10px] text-gray-500 font-mono pb-4 md:pb-0">
                        <ShieldCheck size={12} />
                        VERIFIED SECURE ORIGIN // END-TO-END ENCRYPTED
                    </div>
                </div>

             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
