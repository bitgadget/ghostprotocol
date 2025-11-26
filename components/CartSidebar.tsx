
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingCart, CreditCard, ShieldCheck } from 'lucide-react';
import { CartItem, Language } from '../types';
import { CyberButton } from './CyberButton';
import { TRANSLATIONS } from '../translations';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  lang?: Language;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout,
  lang = 'it'
}) => {
  const t = TRANSLATIONS[lang];
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-cyber-black border-l border-cyber-green/50 z-[60] shadow-[-20px_0_50px_rgba(0,255,65,0.1)] flex flex-col"
          >
            <div className="p-6 border-b border-cyber-dim/30 flex justify-between items-center bg-cyber-dark/50">
              <div className="flex items-center gap-3 text-cyber-green">
                <ShoppingCart className="animate-pulse" />
                <h2 className="text-xl font-mono font-bold tracking-widest">{t.cart_title}</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-cyber-alert transition-colors"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-cyber-dim opacity-50 space-y-4">
                  <ShoppingCart size={64} strokeWidth={1} />
                  <p className="font-mono text-lg">{t.cart_empty}</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex gap-4 p-4 bg-black/40 border border-cyber-dim/30 hover:border-cyber-green/50 transition-colors group relative overflow-hidden"
                  >
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyber-dim/20 group-hover:bg-cyber-green transition-colors" />
                    <div className="w-20 h-20 bg-cyber-dark shrink-0 overflow-hidden border border-cyber-dim/20">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-mono text-white text-sm font-bold line-clamp-1">{item.name}</h3>
                          <button onClick={() => onRemoveItem(item.id)} className="text-cyber-dim hover:text-cyber-alert transition-colors p-1"><Trash2 size={16} /></button>
                        </div>
                        <p className="text-xs text-cyber-dim uppercase tracking-wider">{item.type}</p>
                      </div>

                      <div className="flex justify-between items-end">
                         <div className="flex items-center gap-3 bg-cyber-dark/50 px-2 py-1 border border-cyber-dim/20">
                            <button onClick={() => onUpdateQuantity(item.id, -1)} className="text-gray-400 hover:text-white" disabled={item.quantity <= 1}><Minus size={14} /></button>
                            <span className="font-mono text-white w-4 text-center">{item.quantity}</span>
                            <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-gray-400 hover:text-white"><Plus size={14} /></button>
                         </div>
                         <span className="font-mono text-cyber-green font-bold">€{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-cyber-dim/30 bg-black/90 space-y-4">
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between text-gray-400"><span>{t.cart_subtotal}</span><span>€{total.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-400"><span>{t.cart_fee}</span><span className="text-cyber-green">{t.cart_included}</span></div>
                <div className="flex justify-between text-xl text-white font-bold pt-2 border-t border-cyber-dim/20"><span>{t.cart_total}</span><span>€{total.toFixed(2)}</span></div>
              </div>

              <CyberButton 
                onClick={items.length > 0 ? onCheckout : undefined} 
                variant={items.length > 0 ? "primary" : "secondary"}
                className={`w-full justify-center ${items.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center gap-2"><CreditCard size={18} /> {t.cart_checkout}</span>
              </CyberButton>
              
              <div className="text-center">
                <span className="text-[10px] text-cyber-dim flex items-center justify-center gap-1">
                   <ShieldCheck size={10} /> {t.cart_secure}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
