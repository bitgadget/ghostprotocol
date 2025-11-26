
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Terminal, ShieldAlert } from 'lucide-react';
import { CyberButton } from './CyberButton';
import { TRANSLATIONS } from '../translations';
import { Language } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onSuccess: () => void;
  lang?: Language;
  cryptoPrices: { btc: number; xmr: number };
}

type CheckoutStep = 'shipping' | 'payment' | 'processing' | 'success';
type CryptoType = 'BTC' | 'XMR';

const TEST_WALLETS = {
  BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", // Test Bech32 Address
  XMR: "44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A" // Test Monero Address
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  total, 
  onSuccess, 
  lang = 'it',
  cryptoPrices 
}) => {
  const t = TRANSLATIONS[lang];
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>('BTC');
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
    country: ''
  });

  // Calculate crypto amounts
  const btcAmount = cryptoPrices.btc > 0 ? (total / cryptoPrices.btc).toFixed(6) : "0.000000";
  const xmrAmount = cryptoPrices.xmr > 0 ? (total / cryptoPrices.xmr).toFixed(4) : "0.0000";
  const payAmount = selectedCrypto === 'BTC' ? btcAmount : xmrAmount;
  const payAddress = TEST_WALLETS[selectedCrypto];

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStep('shipping');
      setLogs([]);
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(payAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startPaymentSimulation = () => {
    setStep('processing');
    const logMessages = [
      "INITIATING_BLOCKCHAIN_SCAN...",
      `SEARCHING_MEMPOOL FOR ${payAmount} ${selectedCrypto}...`,
      "TRANSACTION_DETECTED [TXID: 8f3...a1b]",
      "VERIFYING_SIGNATURE...",
      "BLOCK_CONFIRMATION: 1/3",
      "BLOCK_CONFIRMATION: 2/3",
      "BLOCK_CONFIRMATION: 3/3 [CONFIRMED]",
      "GENERATING_ONE_TIME_PAD...",
      "ORDER_ENCRYPTED.",
      "PAYMENT_VERIFIED."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logMessages.length) {
        setLogs(prev => [...prev, logMessages[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setStep('success');
        }, 1000);
      }
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-3xl bg-black border-2 border-cyber-green flex flex-col shadow-[0_0_0_1px_rgba(0,255,65,0.2)]"
          >
            {/* Tactical Corners */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-cyber-green z-20" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-cyber-green z-20" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-cyber-green z-20" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-cyber-green z-20" />

            {/* Header / Terminal Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-cyber-green bg-cyber-green/5">
              <div className="flex items-center gap-3">
                <Terminal size={18} className="text-cyber-green" />
                <span className="font-mono font-bold text-cyber-green tracking-widest text-sm uppercase">
                  EXEC_CHECKOUT_PROTOCOL_v2.0
                </span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="hidden md:flex text-[10px] font-mono text-cyber-dim gap-4">
                    <span>PID: {Math.floor(Math.random() * 9999)}</span>
                    <span>MEM: {Math.floor(Math.random() * 64)}MB</span>
                 </div>
                 <button onClick={onClose} className="text-cyber-green hover:bg-cyber-green hover:text-black transition-colors p-1">
                   <X size={20} />
                 </button>
              </div>
            </div>

            {/* Progress Bar (Visual) */}
            <div className="flex h-1 w-full bg-cyber-dark">
                <div className={`h-full bg-cyber-green transition-all duration-500 ease-out ${
                    step === 'shipping' ? 'w-1/4' : 
                    step === 'payment' ? 'w-2/4' : 
                    step === 'processing' ? 'w-3/4' : 'w-full'
                }`} />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 font-mono relative">
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[length:20px_20px] pointer-events-none" />

              {/* Step 1: Shipping - Terminal Form Style */}
              {step === 'shipping' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 relative z-10">
                  <div className="border-l-2 border-cyber-green pl-4">
                     <h3 className="text-xl text-white font-bold mb-1">{t.checkout_shipping_title}</h3>
                     <p className="text-xs text-cyber-dim uppercase tracking-widest">SECURE_DROP_POINT_CONFIGURATION</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {['name', 'address', 'city', 'zip', 'country'].map((field) => (
                        <div key={field} className="relative group">
                           <label className="text-[10px] text-cyber-green/70 uppercase mb-1 block">
                              {'>'} ENTER_{field.toUpperCase()}:
                           </label>
                           <div className="flex items-end gap-2">
                              <span className="text-cyber-green animate-pulse hidden group-focus-within:block text-xl">_</span>
                              <input 
                                type="text" 
                                name={field}
                                value={(formData as any)[field]}
                                onChange={handleInputChange}
                                className="w-full bg-transparent border-b border-cyber-dim/30 py-2 text-white font-mono text-lg focus:border-cyber-green focus:outline-none placeholder-gray-800 transition-colors rounded-none uppercase"
                                placeholder="[ NO_DATA ]"
                                autoComplete="off"
                              />
                           </div>
                        </div>
                    ))}
                  </div>

                  <div className="pt-8 flex justify-end">
                     <CyberButton onClick={() => setStep('payment')} className="w-full md:w-auto">
                        {t.checkout_next} {'>>'}
                     </CyberButton>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment - Tactical Selection */}
              {step === 'payment' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 relative z-10">
                   <div className="border-l-2 border-cyber-green pl-4 flex justify-between items-start">
                     <div>
                        <h3 className="text-xl text-white font-bold mb-1">{t.checkout_payment_title}</h3>
                        <p className="text-xs text-cyber-dim uppercase tracking-widest">ENCRYPTED_TRANSACTION_CHANNEL</p>
                     </div>
                     <div className="text-right">
                        <div className="text-[10px] text-gray-500">TOTAL_DUE</div>
                        <div className="text-2xl font-bold text-white">€{total.toFixed(2)}</div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {(['BTC', 'XMR'] as CryptoType[]).map((crypto) => (
                        <button 
                            key={crypto}
                            onClick={() => setSelectedCrypto(crypto)}
                            className={`relative p-6 border-2 transition-all group overflow-hidden ${
                                selectedCrypto === crypto 
                                ? 'border-cyber-green bg-cyber-green/10' 
                                : 'border-cyber-dim/20 bg-black hover:border-cyber-dim'
                            }`}
                        >
                            {selectedCrypto === crypto && (
                                <div className="absolute top-0 right-0 p-1 bg-cyber-green text-black">
                                    <Check size={12} strokeWidth={4} />
                                </div>
                            )}
                            <div className={`text-3xl font-bold mb-2 ${selectedCrypto === crypto ? 'text-white' : 'text-gray-600'}`}>{crypto}</div>
                            <div className="text-[10px] text-cyber-dim uppercase tracking-wider">
                                {crypto === 'BTC' ? 'PUBLIC_LEDGER' : 'PRIVATE_LEDGER'}
                            </div>
                        </button>
                    ))}
                  </div>

                  <div className="bg-cyber-dark/30 border border-cyber-dim/30 p-6 flex flex-col md:flex-row gap-6 items-center">
                     <div className="bg-white p-2 shrink-0 relative group cursor-crosshair">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedCrypto.toLowerCase()}:${payAddress}?amount=${payAmount}`} 
                          alt="QR" 
                          className="w-32 h-32 image-pixelated"
                        />
                        <div className="absolute inset-0 bg-cyber-green/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                     
                     <div className="flex-1 w-full space-y-4">
                        <div>
                            <div className="text-[10px] text-cyber-dim uppercase mb-1">TRANSFER_AMOUNT_EXACT</div>
                            <div className="text-xl text-white font-bold bg-black border border-cyber-dim/30 px-3 py-2 inline-block text-cyber-green">
                                {payAmount} <span className="text-xs ml-1 opacity-70">{selectedCrypto}</span>
                            </div>
                        </div>
                        
                        <div>
                            <div className="text-[10px] text-cyber-dim uppercase mb-1">TARGET_WALLET_ADDRESS</div>
                            <div 
                                onClick={handleCopy}
                                className="relative group cursor-pointer"
                            >
                               <div className="w-full bg-black border border-cyber-dim/30 p-3 text-[10px] md:text-xs text-gray-400 font-mono break-all hover:text-white hover:border-cyber-green transition-colors">
                                  {payAddress}
                               </div>
                               <div className="absolute right-0 top-0 bottom-0 px-3 bg-cyber-green flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs">
                                  {copied ? 'COPIED' : 'COPY'}
                               </div>
                            </div>
                        </div>
                     </div>
                  </div>

                  <div className="pt-4">
                     <CyberButton onClick={startPaymentSimulation} variant="primary" className="w-full justify-center">
                        CONFIRM_TRANSACTION_SENT
                     </CyberButton>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Processing - Raw Terminal */}
              {step === 'processing' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col relative z-10">
                   <div className="border-l-2 border-cyber-green pl-4 mb-6">
                     <h3 className="text-xl text-white font-bold mb-1 animate-pulse">{t.checkout_processing}</h3>
                     <p className="text-xs text-cyber-dim uppercase tracking-widest">ESTABLISHING_BLOCKCHAIN_UPLINK</p>
                  </div>
                   
                   <div className="flex-1 bg-black border border-cyber-dim/30 p-4 font-mono text-xs overflow-hidden relative">
                      <div className="absolute inset-0 bg-cyber-green/5 animate-pulse" />
                      {logs.map((log, i) => (
                        <div key={i} className="mb-2">
                           <span className="text-gray-600 mr-2">{(new Date().getTime() + i*231).toString().substr(-6)}</span>
                           <span className="text-cyber-green mr-2">{'>'}</span>
                           <span className="text-cyber-dim">{log}</span>
                        </div>
                      ))}
                      <div className="animate-cursor-blink text-cyber-green text-lg mt-2">_</div>
                   </div>
                </motion.div>
              )}

              {/* Step 4: Success - Dossier Stamp */}
              {step === 'success' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center relative z-10 text-center space-y-8">
                   <div className="relative">
                       <ShieldAlert size={80} className="text-cyber-green" strokeWidth={1} />
                       <div className="absolute inset-0 animate-ping opacity-50">
                           <ShieldAlert size={80} className="text-cyber-green" strokeWidth={1} />
                       </div>
                   </div>
                   
                   <div>
                       <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 glitch-text">{t.checkout_success_title}</h2>
                       <div className="inline-block border-2 border-cyber-green text-cyber-green px-4 py-1 text-sm font-bold tracking-[0.2em] transform -rotate-2">
                           {t.checkout_order_id}: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                       </div>
                   </div>
                   
                   <div className="max-w-md mx-auto bg-cyber-dark/30 p-6 border-l-2 border-cyber-green text-left">
                      <p className="text-gray-400 text-sm leading-relaxed font-mono">
                         {t.checkout_success_desc}
                      </p>
                      <div className="mt-4 flex gap-2 text-[10px] text-cyber-dim uppercase">
                         <span className="bg-cyber-dim/10 px-2 py-1">TRACE: NULL</span>
                         <span className="bg-cyber-dim/10 px-2 py-1">LOGS: WIPED</span>
                      </div>
                   </div>

                   <CyberButton onClick={onSuccess} variant="secondary" className="w-full md:w-auto">
                      {t.checkout_close}
                   </CyberButton>
                </motion.div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
