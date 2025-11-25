
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Usb, Smartphone, Cpu, Lock, Crosshair, Laptop, Wifi, Mic, Backpack, Key, FileText } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
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

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative group border border-cyber-dim bg-cyber-black flex flex-col h-full hover:border-cyber-green hover:shadow-[0_0_20px_rgba(0,255,65,0.2)] transition-all duration-300 overflow-hidden"
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-green opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-green opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-green opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-green opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header Info */}
      <div className="flex justify-between items-center p-3 border-b border-cyber-dim/30 bg-cyber-dark/50">
         <div className="flex items-center gap-2 text-cyber-dim group-hover:text-cyber-green transition-colors">
            {getIcon(product.icon)}
            <span className="text-xs font-mono tracking-wider">SEC_CLASS_A</span>
         </div>
         <div className="text-[10px] text-cyber-dim border border-cyber-dim/50 px-1 font-mono">
            ID: {product.id.toUpperCase().substring(0, 6)}
         </div>
      </div>
      
      {/* Image Container with Cyberpunk Effects */}
      <div className="relative w-full h-48 overflow-hidden bg-black">
        {/* The Image */}
        <div className="absolute inset-0">
             <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover opacity-70 grayscale contrast-125 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out"
             />
        </div>
        
        {/* Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
        
        {/* Green Tint Overlay (fades out on hover) */}
        <div className="absolute inset-0 bg-cyber-green/20 mix-blend-multiply pointer-events-none group-hover:bg-transparent transition-colors duration-300" />
        
        {/* Crosshair Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <Crosshair className="text-cyber-green/50 w-24 h-24 animate-[spin_3s_linear_infinite]" strokeWidth={1} />
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow relative z-10 bg-cyber-black">
        <h3 className="text-xl font-bold mb-2 text-white font-mono group-hover:text-cyber-green transition-colors">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-4 font-mono leading-relaxed flex-grow border-l-2 border-cyber-dim/30 pl-3 group-hover:border-cyber-green transition-colors">
            {product.description}
        </p>
        
        <ul className="text-xs text-cyber-dim mb-6 space-y-1 font-mono">
          {product.specs.map((spec, i) => (
            <li key={i} className="flex items-center">
              <span className="mr-2 text-[10px]">></span> {spec}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-cyber-dim/20 border-dashed">
          <span className="text-lg font-bold text-white font-mono">€{product.price.toFixed(2)}</span>
          <button 
            onClick={() => onAddToCart(product)}
            className="group/btn relative overflow-hidden bg-cyber-dim/20 hover:bg-cyber-green text-cyber-green hover:text-black px-4 py-2 text-sm font-mono uppercase transition-all duration-300 skew-x-[-10deg]"
          >
            <span className="inline-block skew-x-[10deg] font-bold">Add_to_Cart</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
