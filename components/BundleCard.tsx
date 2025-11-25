
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Package, Briefcase, User, AlertTriangle, Radio, ShieldAlert, Skull, FileText } from 'lucide-react';
import { Bundle, BundleTier } from '../types';
import { CyberButton } from './CyberButton';
import { PRODUCTS } from '../constants';

interface BundleCardProps {
  bundle: Bundle;
  onAddToCart: (bundle: Bundle) => void;
}

const getTierIcon = (tier: BundleTier) => {
  switch (tier) {
    case BundleTier.BASE: return <User size={40} />;
    case BundleTier.MEDIO: return <Package size={40} />;
    case BundleTier.IMPRENDITORE: return <Briefcase size={40} />;
    case BundleTier.FANTASMA: return <Skull size={40} />;
  }
};

// Helper function to find image based on item name (fuzzy match)
const findProductImage = (itemName: string): string | null => {
  // Normalize strings for comparison
  const normalizedItem = itemName.toLowerCase();
  
  const product = PRODUCTS.find(p => {
    const normalizedName = p.name.toLowerCase();
    // Check if one includes the other (e.g. "Pixel Stealth" in "Pixel Stealth (GrapheneOS)")
    return normalizedItem.includes(normalizedName) || normalizedName.includes(normalizedItem);
  });

  return product ? product.image : null;
};

// Fallback image for non-product items (like PDF guides)
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=200&auto=format&fit=crop"; 

export const BundleCard: React.FC<BundleCardProps> = ({ bundle, onAddToCart }) => {
  const isGhost = bundle.tier === BundleTier.FANTASMA;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  // --- RENDER PER IL TIER FANTASMA (RED ALERT MODE) ---
  if (isGhost) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="col-span-1 md:col-span-2 lg:col-span-3 w-full relative overflow-hidden bg-black border-4 border-cyber-alert mt-12 mb-8 group"
      >
        {/* Animated Background Noise */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="absolute inset-0 bg-cyber-alert/5 mix-blend-overlay animate-pulse" />
        
        {/* Vertical Scanning Laser */}
        <div className="absolute left-0 right-0 h-1 bg-cyber-alert/50 shadow-[0_0_20px_#ff003c] z-20 animate-scan-vertical pointer-events-none" />

        {/* Top Scrolling Marquee */}
        <div className="bg-cyber-alert text-black font-bold font-mono text-xs py-1 overflow-hidden relative z-30">
          <div className="animate-marquee whitespace-nowrap">
            WARNING: LEVEL 4 CLEARANCE REQUIRED // TOP SECRET // EYES ONLY // GHOST PROTOCOL ACTIVE // DO NOT ACKNOWLEDGE EXISTENCE // WARNING: LEVEL 4 CLEARANCE REQUIRED //
          </div>
        </div>

        <div className="p-8 lg:p-12 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Column 1: Identity & Warning */}
          <div className="border-r-0 lg:border-r border-cyber-alert/30 pr-0 lg:pr-8 text-center lg:text-left">
             <div className="flex justify-center lg:justify-start items-center gap-4 mb-4 text-cyber-alert animate-glitch">
                <Skull size={64} />
                <AlertTriangle size={48} />
             </div>
             <h2 className="text-5xl font-black text-white font-mono tracking-tighter mb-2 glitch-text" data-text={bundle.name}>
               {bundle.name}
             </h2>
             <div className="inline-block bg-cyber-alert text-black px-3 py-1 text-sm font-bold tracking-widest mb-4">
               THREAT_LEVEL: EXTREME
             </div>
             <p className="text-gray-400 font-mono text-lg">
               "{bundle.tagline}"
             </p>
             <p className="mt-4 text-xs text-cyber-alert/80 border border-cyber-alert/30 p-2">
               NOTA: L'acquisto di questo pacchetto cancella automaticamente la tua presenza dai database pubblici entro 48 ore.
             </p>
          </div>

          {/* Column 2: The Arsenal (Grid Layout with Images) */}
          <div className="col-span-1 lg:col-span-1">
             <h3 className="text-cyber-alert font-bold mb-6 flex items-center gap-2 border-b border-cyber-alert/30 pb-2">
               <ShieldAlert size={18} /> CLASSIFIED ARSENAL
             </h3>
             <ul className="grid grid-cols-1 gap-3">
               {bundle.items.map((item, i) => {
                 const imgUrl = findProductImage(item) || FALLBACK_IMAGE;
                 return (
                   <li key={i} className="flex items-center bg-black/50 border border-cyber-alert/30 p-2 hover:bg-cyber-alert/10 transition-colors">
                      <div className="w-12 h-12 mr-3 relative overflow-hidden shrink-0 border border-cyber-alert/50">
                        <img src={imgUrl} alt={item} className="w-full h-full object-cover grayscale opacity-70" />
                        <div className="absolute inset-0 bg-cyber-alert/20 mix-blend-multiply" />
                      </div>
                      <span className="text-sm text-gray-300 font-mono leading-tight">{item}</span>
                   </li>
                 );
               })}
             </ul>

             <div className="mt-8 space-y-2">
                <h4 className="text-xs text-cyber-alert uppercase tracking-widest mb-2">Capabilities</h4>
                {bundle.features.map((feat, i) => (
                   <div key={i} className="flex items-center justify-between text-xs text-gray-500 bg-cyber-alert/5 p-2 border-l-2 border-cyber-alert">
                      <span>{feat.toUpperCase()}</span>
                      <span className="text-cyber-alert font-bold">ACTIVE</span>
                   </div>
                ))}
             </div>
          </div>

          {/* Column 3: Action & Pricing */}
          <div className="flex flex-col items-center justify-center lg:pl-8 border-l-0 lg:border-l border-cyber-alert/30 h-full">
              <div className="text-center mb-8">
                 <p className="text-cyber-alert text-sm mb-1">TOTAL COST</p>
                 <div className="text-6xl font-black text-white font-mono tracking-tighter animate-pulse relative">
                    <span className="absolute -left-4 top-0 text-cyber-alert opacity-50 blur-[2px]">€{bundle.price}</span>
                    €{bundle.price.toFixed(0)}
                 </div>
                 <p className="text-xs text-gray-500 mt-2">PAYMENT: XMR / BTC ONLY</p>
              </div>
              
              <CyberButton onClick={() => onAddToCart(bundle)} variant="danger" className="w-full text-xl py-6 animate-pulse-fast">
                 INITIATE PROTOCOL
              </CyberButton>
          </div>

        </div>

        {/* Decorative corner markers */}
        <div className="absolute top-8 left-0 w-8 h-1 bg-cyber-alert" />
        <div className="absolute bottom-0 right-0 w-8 h-1 bg-cyber-alert" />
      </motion.div>
    );
  }

  // --- RENDER STANDARD PER ALTRI TIER ---
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      className={`relative flex flex-col p-8 bg-black/80 border border-cyber-dim hover:border-cyber-green transition-all duration-300 group hover:shadow-[0_0_15px_rgba(0,255,65,0.15)] h-full`}
    >
      <div className="flex items-center justify-between mb-6 border-b border-cyber-dim/30 pb-4">
        <div className="text-cyber-green group-hover:scale-110 transition-transform duration-300">
          {getTierIcon(bundle.tier)}
        </div>
        <div className="text-right">
          <h3 className="text-2xl font-bold font-mono text-white group-hover:text-cyber-green transition-colors">{bundle.name}</h3>
          <p className="text-xs text-cyber-dim font-mono tracking-widest uppercase">{bundle.tier}</p>
        </div>
      </div>

      <div className="mb-6 font-mono">
        <p className="text-lg text-gray-400 italic mb-2">"{bundle.tagline}"</p>
        <div className="flex items-center gap-2 text-xs text-cyber-dim bg-cyber-dim/10 p-2 rounded">
           <User size={12} />
           Target: {bundle.recommendedFor}
        </div>
      </div>

      <div className="flex-grow mb-8">
        <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
            <Package size={14} className="text-cyber-dim"/> Equipaggiamento
        </h4>

        {/* Visual Previews Row */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
           {bundle.items.map((item, idx) => {
              const imgUrl = findProductImage(item);
              if (!imgUrl) return null; // Skip if no product image found
              return (
                <div key={idx} className="w-10 h-10 rounded border border-cyber-dim bg-cyber-dark overflow-hidden shrink-0 group/img">
                   <img 
                    src={imgUrl} 
                    alt={item} 
                    className="w-full h-full object-cover grayscale opacity-60 group-hover/img:grayscale-0 group-hover/img:opacity-100 transition-all duration-300" 
                    title={item}
                   />
                </div>
              )
           })}
        </div>

        <motion.ul 
          className="space-y-2 mb-6 pl-4 border-l border-cyber-dim/20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {bundle.items.map((item, idx) => (
            <motion.li 
              key={idx} 
              variants={itemVariants}
              className="text-sm text-gray-300 font-mono flex items-start group-hover:text-white transition-colors"
            >
              <span className="text-cyber-dim mr-2 opacity-50">{' > '}</span> {item}
            </motion.li>
          ))}
        </motion.ul>

        <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
            <Radio size={14} className="text-cyber-dim"/> Capacità
        </h4>
        <motion.ul 
          className="space-y-1 pl-4 border-l border-cyber-dim/20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {bundle.features.map((feat, idx) => (
            <motion.li 
              key={idx} 
              variants={itemVariants}
              className="text-sm text-cyber-green/80 font-mono flex items-center"
            >
              <Check size={12} className="mr-2" /> {feat}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <div className="mt-auto pt-6 border-t border-cyber-dim/20 flex flex-col gap-4">
         <div className="flex justify-between items-end">
            <span className="text-xs text-gray-500 font-mono">COSTO OPERAZIONE</span>
            <span className="text-3xl font-bold font-mono text-white group-hover:text-cyber-green transition-colors">
              €{bundle.price.toFixed(2)}
            </span>
         </div>
         <CyberButton onClick={() => onAddToCart(bundle)} variant="primary" className="w-full justify-center">
            ACQUISTA
         </CyberButton>
      </div>
    </motion.div>
  );
};
