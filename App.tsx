
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ShoppingCart, Terminal, Menu, X, ArrowDown, Cpu, Wifi, Activity, HardDrive, FileCode, Shield, Lock, Skull, Crosshair, Globe, ChevronRight, Send } from 'lucide-react';
import { getProducts, getBundles, PRODUCTS_ALL } from './constants';
import { ProductCard } from './components/ProductCard';
import { CyberButton } from './components/CyberButton';
import { CartSidebar } from './components/CartSidebar';
import { ProductModal } from './components/ProductModal';
import { CheckoutModal } from './components/CheckoutModal';
import { CartItem, Product, Bundle, BundleTier, Language } from './types';
import { TRANSLATIONS } from './translations';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('it');
  const t = TRANSLATIONS[lang];
  const PRODUCTS = getProducts(lang);
  const BUNDLES = getBundles(lang);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('ghost_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Failed to load cart", e);
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [glitchActive, setGlitchActive] = useState(false);
  
  const [activeBundleId, setActiveBundleId] = useState<string>(BUNDLES[0].id);
  
  const [cryptoPrices, setCryptoPrices] = useState({ btc: 0, xmr: 0 });

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 400]);
  const shape1Y = useTransform(scrollY, [0, 1000], [0, 250]);
  const shape2Y = useTransform(scrollY, [0, 1000], [0, 600]);
  const textY = useTransform(scrollY, [0, 1000], [0, 150]);
  
  useEffect(() => {
    localStorage.setItem('ghost_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.kraken.com/0/public/Ticker?pair=XBTUSDT,XMRUSDT');
        const data = await response.json();
        
        if (data.result) {
          const btcData = data.result['XBTUSDT'] || data.result['XXBTZUSD'];
          const xmrData = data.result['XMRUSDT'] || data.result['XXMRZUSD'];

          const btcPrice = btcData ? parseFloat(btcData.c[0]) : 0;
          const xmrPrice = xmrData ? parseFloat(xmrData.c[0]) : 0;

          setCryptoPrices({ btc: btcPrice, xmr: xmrPrice });
        }
      } catch (error) {
        console.error("Crypto Ticker Error:", error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const BOOT_SEQUENCE = t.boot_sequence;

  useEffect(() => {
    // Reset boot sequence when language changes if still loading
    if(loading) {
        setBootLines([]);
        setProgress(0);
    }
  }, [lang]);

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < BOOT_SEQUENCE.length) {
        setBootLines(prev => [...prev, BOOT_SEQUENCE[currentLine]]);
        currentLine++;
        setProgress((currentLine / BOOT_SEQUENCE.length) * 100);
      } else {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 500);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [BOOT_SEQUENCE]); // Depend on boot_sequence to restart if lang changes during load (edge case)

  useEffect(() => {
    if (!loading || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01010101 GHOST PROTOCOL ANONYMITY LINUX KERNEL ROOT ACCESS";
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
        clearInterval(interval);
        window.removeEventListener('resize', handleResize);
    };
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleAddToCart = (item: Product | Bundle) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        const isProduct = 'description' in item;
        const image = isProduct 
          ? (item as Product).image 
          : "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=200&auto=format&fit=crop";

        const newItem: CartItem = {
          id: item.id,
          name: item.name,
          price: item.price,
          image: image,
          quantity: 1,
          type: isProduct ? 'product' : 'bundle'
        };
        return [...prev, newItem];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
     setIsCartOpen(false);
     setIsCheckoutOpen(true);
  };
  
  const handlePaymentSuccess = () => {
    setCartItems([]);
    localStorage.removeItem('ghost_cart');
    setIsCheckoutOpen(false);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
  };
  
  const handleCloseProduct = () => {
    setSelectedProduct(null);
  };

  // Helper to find image (looks in all products to ensure match across languages if needed)
  const findProductImage = (itemName: string): string | null => {
    const normalizedItem = itemName.toLowerCase();
    const product = PRODUCTS_ALL.find(p => {
      const normalizedName = p.name.toLowerCase();
      // Allow for fuzzy match across different product list iterations
      return normalizedItem.includes(normalizedName) || normalizedName.includes(normalizedItem);
    });
    return product ? product.image : null;
  };

  const toggleLang = () => {
    setLang(prev => prev === 'it' ? 'en' : 'it');
  };

  const ProductSlider = ({ products }: { products: Product[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 320; 
            current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };
    return (
        <div className="relative group/slider">
            <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/80 border border-cyber-green text-cyber-green p-2 md:opacity-0 md:group-hover/slider:opacity-100 transition-opacity hover:bg-cyber-green hover:text-black rounded-r"
            >
                {' < '}
            </button>
            <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/80 border border-cyber-green text-cyber-green p-2 md:opacity-0 md:group-hover/slider:opacity-100 transition-opacity hover:bg-cyber-green hover:text-black rounded-l"
            >
                {' > '}
            </button>
            <div 
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 pb-8 snap-x scrollbar-thin scrollbar-track-black scrollbar-thumb-cyber-dim px-1"
            >
                {products.map(product => (
                    <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-center">
                        <ProductCard 
                            product={product} 
                            onAddToCart={handleAddToCart}
                            onOpenModal={handleOpenProduct}
                            lang={lang}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
  };

  const hardwareIds = ['phone-graphene', 'pixel-pro', 'laptop-hardened', 'vpn-router', 'voice-changer'];
  const hardwareProducts = PRODUCTS.filter(p => hardwareIds.includes(p.id));
  const digitalProducts = PRODUCTS.filter(p => !hardwareIds.includes(p.id));
  
  const activeBundle = BUNDLES.find(b => b.id === activeBundleId) || BUNDLES[0];
  const isGhostActive = activeBundle.tier === BundleTier.FANTASMA;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-black text-cyber-green font-mono overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 opacity-20" />
        <div className="relative z-10 flex flex-col h-full p-8 md:p-12 max-w-4xl mx-auto justify-end pb-20">
            <div className="absolute top-[35%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8"
                >
                    <Terminal size={64} className="mx-auto text-cyber-green animate-pulse mb-4" />
                    <h1 className="text-4xl md:text-6xl font-bold tracking-widest animate-glitch">GHOST_PROTOCOL</h1>
                    <p className="text-cyber-dim mt-2 tracking-[0.5em] text-sm md:text-base">ESTABLISHING SECURE UPLINK</p>
                </motion.div>
                <div className="flex justify-center gap-8 mt-12 text-xs text-cyber-dim opacity-70">
                    <div className="flex items-center gap-2"><Cpu size={16} /><span>CORE: {(Math.random() * 100).toFixed(0)}%</span></div>
                    <div className="flex items-center gap-2"><Wifi size={16} /><span>NET: ENCRYPTED</span></div>
                    <div className="flex items-center gap-2"><Activity size={16} /><span>MEM: 16TB</span></div>
                </div>
            </div>
            <div className="font-mono text-sm md:text-base h-32 md:h-48 overflow-hidden flex flex-col justify-end border-l-2 border-cyber-dim pl-4 bg-black/50 backdrop-blur-sm p-4 rounded-r-lg shadow-[0_0_20px_rgba(0,255,65,0.1)]">
                {bootLines.map((line, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-1"
                    >
                        <span className="text-cyber-dim mr-2">[{new Date().toLocaleTimeString()}]</span>
                        <span className={index === bootLines.length - 1 ? "text-white font-bold" : "text-cyber-green"}>
                             {line}
                        </span>
                    </motion.div>
                ))}
                <div className="animate-cursor-blink text-cyber-green mt-1">_</div>
            </div>
            <div className="mt-6 w-full bg-cyber-dark border border-cyber-dim h-4 relative overflow-hidden">
                <motion.div 
                    className="h-full bg-cyber-green absolute top-0 left-0"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.5)_25%,rgba(0,0,0,0.5)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.5)_75%,rgba(0,0,0,0.5)_100%)] bg-[length:10px_10px] opacity-30" />
            </div>
            <div className="flex justify-between text-xs mt-2 text-cyber-dim">
                <span>SYSTEM INTEGRITY CHECK</span>
                <span>{Math.min(100, Math.floor(progress))}%</span>
            </div>
        </div>
        <div className="scanline opacity-20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-green font-mono selection:bg-cyber-green selection:text-black relative overflow-x-hidden">
      <div className="scanline opacity-20" />
      <div className="fixed inset-0 pointer-events-none z-50 animate-pulse-fast opacity-[0.02] bg-white mix-blend-overlay" />

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        lang={lang}
      />

      <ProductModal 
        isOpen={!!selectedProduct} 
        product={selectedProduct} 
        onClose={handleCloseProduct}
        onAddToCart={handleAddToCart}
        lang={lang}
      />
      
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={cartTotal}
        onSuccess={handlePaymentSuccess}
        lang={lang}
        cryptoPrices={cryptoPrices}
      />

      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/90 border-b border-cyber-dim backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <Terminal className="text-cyber-green animate-pulse" />
              <span className={`text-xl font-bold tracking-widest ${glitchActive ? 'translate-x-1 text-red-500' : 'text-white'}`}>
                GHOST_PROTOCOL
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-4 md:gap-6 border-l border-cyber-dim/30 pl-4 md:pl-6">
                <div className="flex items-center gap-1 text-[10px] text-cyber-alert animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-alert" />
                    LIVE_FEED
                </div>
                <div className="flex flex-col text-[10px] md:text-xs font-mono leading-tight">
                   <div className="flex items-center gap-2 text-gray-500">
                      <span>BTC</span>
                      <span className="text-cyber-green font-bold">${cryptoPrices.btc.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                   </div>
                </div>
                <div className="flex flex-col text-[10px] md:text-xs font-mono leading-tight">
                   <div className="flex items-center gap-2 text-gray-500">
                      <span>XMR</span>
                      <span className="text-cyber-green font-bold">${cryptoPrices.xmr.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                   </div>
                </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('gadget')} className="text-sm text-gray-400 hover:text-cyber-green hover:underline decoration-cyber-green underline-offset-4 transition-all">
                {t.nav_gadget}
            </button>
            <button onClick={() => scrollToSection('bundle')} className="text-sm text-gray-400 hover:text-cyber-green hover:underline decoration-cyber-green underline-offset-4 transition-all">
                {t.nav_bundle}
            </button>
            <button onClick={() => scrollToSection('info')} className="text-sm text-gray-400 hover:text-cyber-green hover:underline decoration-cyber-green underline-offset-4 transition-all">
                {t.nav_info}
            </button>
            
            <button 
                onClick={toggleLang}
                className="flex items-center gap-2 text-sm text-white hover:text-cyber-green border border-cyber-dim/30 px-2 py-1 bg-cyber-dark/30 hover:bg-cyber-dim/20 transition-all"
            >
                <Globe size={14} />
                <span>{lang.toUpperCase()}</span>
            </button>

            <div className="relative cursor-pointer group" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="text-white group-hover:text-cyber-green transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-cyber-green text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
          </div>

          <div className="flex md:hidden gap-4 items-center">
             <button onClick={toggleLang} className="text-xs text-white border border-cyber-dim px-2 py-1">{lang.toUpperCase()}</button>
             <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="text-white" />
                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-cyber-green text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{cartCount}</span>}
            </div>
            <button className="text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 z-30 bg-black/95 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <button onClick={() => scrollToSection('gadget')} className="text-2xl text-cyber-green font-bold uppercase">{t.nav_gadget}</button>
            <button onClick={() => scrollToSection('bundle')} className="text-2xl text-cyber-green font-bold uppercase">{t.nav_bundle}</button>
            <button onClick={() => scrollToSection('info')} className="text-2xl text-cyber-green font-bold uppercase">{t.nav_info}</button>
             <div className="mt-8 p-4 border border-cyber-dim/30 bg-cyber-dark/30 rounded w-64">
                <div className="text-xs text-cyber-dim mb-2 text-center">MARKET_DATA (LIVE)</div>
                <div className="flex justify-between items-center mb-2"><span>BTC/USDT</span><span className="text-cyber-green font-bold">${cryptoPrices.btc.toLocaleString()}</span></div>
                <div className="flex justify-between items-center"><span>XMR/USDT</span><span className="text-cyber-green font-bold">${cryptoPrices.xmr.toLocaleString()}</span></div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <motion.div className="absolute inset-0 z-0 opacity-20" style={{ y: backgroundY, backgroundImage: 'linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl max-h-2xl flex items-center justify-center pointer-events-none z-0 mix-blend-screen">
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-cyber-green blur-[80px]" />
           <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.15, 0.05] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full bg-cyber-dim blur-[100px]" />
        </div>
        <motion.div style={{ y: shape1Y }} className="absolute top-[10%] left-[5%] w-64 h-64 bg-cyber-green/5 rounded-full blur-3xl pointer-events-none" />
        <motion.div style={{ y: shape2Y }} className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-cyber-dim/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div style={{ y: textY }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <h2 className="text-cyber-dim text-lg mb-4 tracking-[0.5em] uppercase">{t.hero_security}</h2>
            <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 leading-tight">
              {t.hero_title_1} <br/>
              <span className={`text-cyber-green inline-block ${glitchActive ? 'translate-x-2 skew-x-12' : ''}`}>
                {t.hero_title_2}
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg mb-10 leading-relaxed">
              {t.hero_desc}
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <CyberButton onClick={() => scrollToSection('bundle')} variant="primary">{t.hero_btn_primary}</CyberButton>
              <CyberButton onClick={() => scrollToSection('gadget')} variant="secondary">{t.hero_btn_secondary}</CyberButton>
            </div>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-cyber-dim"><ArrowDown /></motion.div>
      </section>

      <section id="gadget" className="py-24 relative border-t border-cyber-dim/20">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-16 border-b border-cyber-dim pb-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">{t.gadget_title}</h2>
              <p className="text-cyber-dim">{' > '} {t.gadget_subtitle}</p>
            </div>
            <div className="hidden md:block text-xs text-gray-500 font-mono">STATUS: READY</div>
          </div>
          <div className="mb-12">
            <h3 className="text-xl text-white font-bold mb-6 flex items-center gap-2 border-l-4 border-cyber-green pl-3"><HardDrive size={24} className="text-cyber-green"/> {t.gadget_hardware}</h3>
            <ProductSlider products={hardwareProducts} />
          </div>
          <div>
            <h3 className="text-xl text-white font-bold mb-6 flex items-center gap-2 border-l-4 border-cyber-green pl-3"><FileCode size={24} className="text-cyber-green"/> {t.gadget_digital}</h3>
            <ProductSlider products={digitalProducts} />
          </div>
        </div>
      </section>

      <section id="bundle" className="py-12 md:py-24 bg-black relative overflow-hidden">
        <div className={`absolute inset-0 transition-colors duration-1000 ${isGhostActive ? 'bg-cyber-alert/5' : 'bg-cyber-green/5'}`} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.8)_1px,transparent_1px)] bg-[length:40px_40px] opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 border-b border-cyber-dim/30 pb-4">
            <div>
                <h2 className={`text-3xl md:text-5xl font-bold font-mono tracking-tighter mb-2 ${isGhostActive ? 'text-cyber-alert animate-glitch' : 'text-white'}`}>{t.bundle_title}</h2>
                <p className={`${isGhostActive ? 'text-cyber-alert' : 'text-cyber-green'} text-sm md:text-base font-mono`}>{' > '} {t.bundle_subtitle}</p>
            </div>
            {isGhostActive && <div className="text-cyber-alert font-bold animate-pulse uppercase tracking-widest border border-cyber-alert px-4 py-1 mt-4 md:mt-0">{t.bundle_threat}</div>}
          </div>

          <div className={`flex flex-col lg:flex-row border-2 min-h-[600px] transition-all duration-500 bg-black/80 backdrop-blur-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] ${isGhostActive ? 'border-cyber-alert shadow-[0_0_30px_rgba(255,0,60,0.15)]' : 'border-cyber-dim shadow-[0_0_30px_rgba(0,255,65,0.1)]'}`}>
             <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-cyber-dim/30 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible">
                {BUNDLES.map((bundle) => {
                    const isActive = activeBundleId === bundle.id;
                    const isGhost = bundle.tier === BundleTier.FANTASMA;
                    return (
                        <button key={bundle.id} onClick={() => setActiveBundleId(bundle.id)} className={`relative flex-shrink-0 lg:flex-shrink p-4 lg:p-6 text-left transition-all duration-300 group border-r lg:border-r-0 border-cyber-dim/20 lg:border-b ${isActive ? isGhost ? 'bg-cyber-alert text-black' : 'bg-cyber-green text-black' : 'hover:bg-cyber-dim/10 text-gray-400 hover:text-white'}`}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-xs opacity-70">LVL_{bundle.tier === BundleTier.FANTASMA ? 'X' : parseInt(bundle.price.toString()) % 10}</span>
                                {isActive && <ChevronRight size={14} className="animate-pulse" />}
                            </div>
                            <h3 className="font-bold font-mono text-sm lg:text-lg uppercase leading-tight">{bundle.name}</h3>
                            <div className={`text-[10px] mt-2 font-mono ${isActive ? 'text-black/70' : 'text-cyber-dim'}`}>{bundle.items.length} {t.bundle_modules}</div>
                            {isActive && <motion.div layoutId="activeIndicator" className={`absolute left-0 top-0 bottom-0 w-1 lg:w-2 ${isGhost ? 'bg-black' : 'bg-white'}`} />}
                        </button>
                    );
                })}
             </div>

             <div className="flex-1 relative overflow-hidden flex flex-col">
                <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${isGhostActive ? 'via-cyber-alert/5' : 'via-cyber-green/5'} to-transparent h-[10%] animate-scan-vertical pointer-events-none z-0`} />
                <AnimatePresence mode="wait">
                    <motion.div key={activeBundle.id} initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }} transition={{ duration: 0.3 }} className="flex-1 flex flex-col md:flex-row h-full relative z-10">
                        <div className="p-6 md:p-10 flex-1 flex flex-col">
                             <div className="mb-6">
                                <div className={`inline-flex items-center gap-2 px-2 py-1 text-xs border mb-4 font-mono ${isGhostActive ? 'border-cyber-alert text-cyber-alert' : 'border-cyber-green text-cyber-green'}`}>
                                    {isGhostActive ? <Skull size={12} /> : <Shield size={12} />}
                                    <span>{t.bundle_status}</span>
                                </div>
                                <h3 className={`text-4xl md:text-5xl font-black font-mono mb-2 text-white`}>{activeBundle.name}</h3>
                                <p className="text-gray-400 font-mono text-lg italic">"{activeBundle.tagline}"</p>
                             </div>

                             <div className="grid grid-cols-3 gap-4 mb-8 font-mono text-xs">
                                 <div><div className="text-gray-500 mb-1">ANONYMITY</div><div className="h-1 bg-gray-800 w-full"><motion.div initial={{ width: 0 }} animate={{ width: isGhostActive ? '100%' : '80%' }} className={`h-full ${isGhostActive ? 'bg-cyber-alert' : 'bg-cyber-green'}`} transition={{ delay: 0.2, duration: 1 }} /></div></div>
                                 <div><div className="text-gray-500 mb-1">ENCRYPTION</div><div className="h-1 bg-gray-800 w-full"><motion.div initial={{ width: 0 }} animate={{ width: isGhostActive ? '100%' : '60%' }} className={`h-full ${isGhostActive ? 'bg-cyber-alert' : 'bg-cyber-green'}`} transition={{ delay: 0.3, duration: 1 }} /></div></div>
                                 <div><div className="text-gray-500 mb-1">COUNTER-INTEL</div><div className="h-1 bg-gray-800 w-full"><motion.div initial={{ width: 0 }} animate={{ width: isGhostActive ? '100%' : '40%' }} className={`h-full ${isGhostActive ? 'bg-cyber-alert' : 'bg-cyber-green'}`} transition={{ delay: 0.4, duration: 1 }} /></div></div>
                             </div>

                             <div className="flex-1 mb-8 overflow-y-auto max-h-[200px] scrollbar-thin pr-2">
                                 <h4 className={`text-xs font-bold uppercase mb-4 flex items-center gap-2 ${isGhostActive ? 'text-cyber-alert' : 'text-cyber-green'}`}><Crosshair size={14} /> {t.bundle_loadout}</h4>
                                 <ul className="space-y-3">
                                     {activeBundle.items.map((item, i) => (
                                         <li key={i} className="flex items-center gap-3 group">
                                             <div className={`w-1 h-1 ${isGhostActive ? 'bg-cyber-alert' : 'bg-cyber-green'} group-hover:scale-150 transition-transform`} />
                                             <span className="text-gray-300 font-mono text-sm group-hover:text-white transition-colors">{item}</span>
                                         </li>
                                     ))}
                                 </ul>
                             </div>

                             <div className="mt-auto pt-6 border-t border-gray-800 flex items-center justify-between gap-4">
                                 <div>
                                     <div className="text-xs text-gray-500">{t.bundle_cost}</div>
                                     <div className={`text-3xl font-bold font-mono ${isGhostActive ? 'text-cyber-alert' : 'text-white'}`}>€{activeBundle.price.toFixed(0)}</div>
                                 </div>
                                 <CyberButton onClick={() => handleAddToCart(activeBundle)} variant={isGhostActive ? 'danger' : 'primary'}>{t.bundle_init}</CyberButton>
                             </div>
                        </div>

                        <div className="w-full md:w-1/3 bg-black/50 border-t md:border-t-0 md:border-l border-gray-800 p-6 flex flex-col justify-center items-center relative overflow-hidden">
                             <div className={`absolute inset-0 opacity-10 flex items-center justify-center ${isGhostActive ? 'text-cyber-alert' : 'text-cyber-green'}`}>{isGhostActive ? <Skull size={200} /> : <Lock size={200} />}</div>
                             <div className="relative z-10 grid grid-cols-2 gap-4 w-full">
                                 {activeBundle.items.slice(0, 4).map((item, i) => {
                                      const img = findProductImage(item);
                                      if(!img) return null;
                                      return (
                                          <div key={i} className={`aspect-square border ${isGhostActive ? 'border-cyber-alert/30' : 'border-cyber-dim/30'} bg-black p-1 relative group`}>
                                              <img src={img} alt={item} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all" />
                                              <div className={`absolute inset-0 ${isGhostActive ? 'bg-cyber-alert/10' : 'bg-cyber-green/10'} mix-blend-overlay`} />
                                          </div>
                                      )
                                 })}
                             </div>
                             {activeBundle.items.length > 4 && <div className="mt-4 text-xs text-gray-500 font-mono">+ {activeBundle.items.length - 4} {t.bundle_additional}</div>}
                        </div>
                    </motion.div>
                </AnimatePresence>
             </div>
          </div>
        </div>
      </section>

      <section id="info" className="py-20 border-t border-cyber-dim bg-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
            <div>
              <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2"><Terminal size={20} /> {t.footer_logs}</h3>
              <div className="space-y-2 text-cyber-dim font-mono text-xs opacity-70">
                <p>{' > '} 23:42:12 - Connection encrypted (AES-256)</p>
                <p>{' > '} 23:42:15 - Tracking cookies incinerated</p>
                <p>{' > '} 23:42:18 - User location masked [Node: Reykjavik]</p>
                <p>{' > '} 23:42:22 - GhostProtocol active</p>
              </div>
            </div>
            <div>
              <h3 className="text-white text-xl font-bold mb-6">{t.footer_mission}</h3>
              <p className="text-gray-400 leading-relaxed mb-4">{t.footer_mission_desc}</p>
              <div className="flex gap-4">
                <span className="text-cyber-green cursor-pointer hover:underline">PGP Key</span>
                <span className="text-cyber-green cursor-pointer hover:underline">Onion Site</span>
                <span className="text-cyber-green cursor-pointer hover:underline">Canary</span>
              </div>
            </div>
            <div className="bg-cyber-dark/50 p-6 border border-cyber-dim/30 hover:border-cyber-green/50 transition-colors group">
              <h3 className="text-white font-bold uppercase flex items-center gap-2">
                 <Send size={18} className="text-cyber-green" /> {t.footer_telegram}
              </h3>
              <p className="text-gray-500 mb-4 text-xs font-mono mt-2">{t.footer_telegram_desc}</p>
              <a href="https://t.me/ghost_protocol" target="_blank" rel="noopener noreferrer" className="block w-full">
                <button className="bg-cyber-dim/20 text-cyber-green border border-cyber-green w-full py-2 font-bold hover:bg-cyber-green hover:text-black transition-all uppercase flex items-center justify-center gap-2">
                   {t.footer_telegram_btn} <ChevronRight size={14}/>
                </button>
              </a>
            </div>
          </div>
          <div className="mt-16 text-center text-gray-600 text-xs font-mono"><p>GHOST_PROTOCOL © {new Date().getFullYear()} // ALL RIGHTS RESERVED // NO LOGS KEPT</p></div>
        </div>
      </section>
    </div>
  );
};

export default App;
