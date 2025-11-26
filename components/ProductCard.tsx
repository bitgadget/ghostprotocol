
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Usb, Smartphone, Cpu, Lock, Laptop, Wifi, Mic, Backpack, Key, FileText, Eye, ShoppingCart } from 'lucide-react';
import { Product, Language } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenModal?: (product: Product) => void;
  lang?: Language;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'usb': return <Usb size={18} />;
    case 'smartphone': return <Smartphone size={18} />;
    case 'shield': return <Shield size={18} />;
    case 'sim': return <Cpu size={18} />;
    case 'laptop': return <Laptop size={18} />;
    case 'wifi': return <Wifi size={18} />;
    case 'mic': return <Mic size={18} />;
    case 'backpack': return <Backpack size={18} />;
    case 'key': return <Key size={18} />;
    case 'file': return <FileText size={18} />;
    default: return <Lock size={18} />;
  }
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onOpenModal, lang = 'it' }) => {
  const addText = lang === 'it' ? 'AGGIUNGI' : 'ADD';
  const viewText = lang === 'it' ? 'Vedi Specifiche' : 'View Specs';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative group border border-cyber-dim bg-cyber-black flex flex-col h-full hover:border-cyber-green hover:shadow-[0_0_20px_rgba(0,255,65,0.2)] transition-all duration-300 overflow-hidden transform-gpu"
    >
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-green opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-green opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-green opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-green opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex justify-between items-center p-3 border-b border-cyber-dim/30 bg-cyber-dark/50">
         <div className="flex items-center gap-2 text-cyber-dim group-hover:text-cyber-green transition-colors">
            {getIcon(product.icon)}
            <span className="text-xs font-mono tracking-wider">SEC_CLASS_A</span>
         </div>
         <div className="text-[10px] text-cyber-dim border border-cyber-dim/50 px-1 font-mono">
            ID: {product.id.toUpperCase().substring(0, 6)}
         </div>
      </div>
      
      <div 
        className="relative w-full h-48 overflow-hidden bg-black cursor-pointer"
        onClick={() => onOpenModal && onOpenModal(product)}
      >
        <div className="absolute inset-0">
             <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover opacity-100 group-hover:scale-110 transition-all duration-500 ease-out will-change-transform"
             />
        </div>
        
        {/* Subtle texture overlay, removed green tint and mix-blend mode for original colors */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(0,0,0,0.06),rgba(0,0,0,0.02),rgba(0,0,0,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-50" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-[1px]">
            <div className="border border-cyber-green px-4 py-2 bg-black/80 text-cyber-green font-mono text-xs flex items-center gap-2 uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <Eye size={14} /> {viewText}
            </div>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow relative z-10 bg-cyber-black">
        <h3 className="text-xl font-bold mb-2 text-white font-mono group-hover:text-cyber-green transition-colors cursor-pointer" onClick={() => onOpenModal && onOpenModal(product)}>{product.name}</h3>
        <p className="text-gray-400 text-sm mb-4 font-mono leading-relaxed flex-grow border-l-2 border-cyber-dim/30 pl-3 group-hover:border-cyber-green transition-colors">
            {product.description}
        </p>
        
        <ul className="text-xs text-cyber-dim mb-6 space-y-1 font-mono">
          {product.specs.slice(0, 2).map((spec, i) => (
            <li key={i} className="flex items-center">
              <span className="mr-2 text-[10px] text-cyber-dim opacity-50">{' > '}</span> {spec}
            </li>
          ))}
          {product.specs.length > 2 && (
             <li className="flex items-center text-cyber-dim/50 italic">
               <span className="mr-2 text-[10px]">+</span> {product.specs.length - 2} more modules...
             </li>
          )}
        </ul>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-cyber-dim/20 border-dashed gap-2">
          <span className="text-lg font-bold text-white font-mono">€{product.price.toFixed(2)}</span>
          
          <div className="flex gap-2">
            <button 
                onClick={() => onOpenModal && onOpenModal(product)}
                className="p-2 border border-cyber-dim text-cyber-dim hover:text-white hover:border-white transition-colors"
                title="View Details"
            >
                <Eye size={18} />
            </button>
            <button 
                onClick={() => onAddToCart(product)}
                className="group/btn relative overflow-hidden bg-cyber-dim/20 hover:bg-cyber-green text-cyber-green hover:text-black px-3 py-2 text-sm font-mono uppercase transition-all duration-300 flex items-center gap-2"
            >
                <ShoppingCart size={16} />
                <span className="font-bold">{addText}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
