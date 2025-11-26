
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ShoppingCart, Terminal, Menu, X, ArrowDown, Cpu, Wifi, Activity, HardDrive, FileCode, TrendingUp, Shield, Lock, Skull, Zap, ChevronRight, Crosshair } from 'lucide-react';
import { PRODUCTS, BUNDLES } from './constants';
import { ProductCard } from './components/ProductCard';
import { CyberButton } from './components/CyberButton';
import { CartSidebar } from './components/CartSidebar';
import { ProductModal } from './components/ProductModal';
import { CartItem, Product, Bundle, BundleTier } from './types';

const BOOT_SEQUENCE = [
  "INITIALIZING GHOST_PROTOCOL KERNEL v4.0.2...",
  "CHECKING INTEGRITY... [ OK ]",
  "LOADING MODULES: CRYPTO_ENGINE... [ OK ]",
  "LOADING MODULES: NETWORK_OBFUSCATION... [ OK ]",
  "BYPASSING ISP THROTTLING...",
  "ESTABLISHING TOR CIRCUIT... SUCCESS",
  "MASKING IP ADDRESS... [ 192.168.X.X ] -> [ HIDDEN ]",
  "MOUNTING ENCRYPTED FILE SYSTEM...",
  "SCANNING FOR SURVEILLANCE DEVICES... NEGATIVE",
  "USER AUTHENTICATION: BYPASSED",
  "ACCESSING MAINFRAME...",
  "SYSTEM READY."
];

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // State for Modal
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load cart from local storage on initial render
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
  
  // Selected Bundle State for the new Terminal UI
  const [activeBundleId, setActiveBundleId] = useState<string>(BUNDLES[0].id);
  
  // Crypto Ticker State
  const [cryptoPrices, setCryptoPrices] = useState({ btc: 0, xmr: 0 });

  // Parallax Scroll Hooks
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 400]);
  const shape1Y = useTransform(scrollY, [0, 1000], [0, 250]);
  const shape2Y = useTransform(scrollY, [0, 1000], [0, 600]);
  const textY = useTransform(scrollY, [0, 1000], [0, 150]);
  
  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('ghost_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch Crypto Prices from Kraken
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Fetch BTC (XBT) and Monero (XMR) in USDT
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
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);
  
  // Loading State
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Boot Sequence Logic
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
    }, 250); // Add a line every 250ms roughly

    return () => clearInterval(interval);
  }, []);

  // Matrix Rain Effect for Loading Screen
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


  // Random glitch effect for main app
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [loading]);

  // Cart Functions
  const handleAddToCart = (item: Product | Bundle) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        // Determine type and image
        const isProduct = 'description' in item;
        // For bundles, use a fallback image or the first item's image if possible
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
    alert("SYSTEM MESSAGE: Secure crypto gateway initialized. Scanning wallet...");
    // Reset cart after checkout (simulation)
    setTimeout(() => {
       setCartItems([]);
       localStorage.removeItem('ghost_cart');
       setIsCartOpen(false);
       alert("SYSTEM MESSAGE: Transaction Verified. Assets transferred to hidden drop location.");
    }, 2000);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Modal Functions
  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
  };
  
  const handleCloseProduct = () => {
    setSelectedProduct(null);
  };

  // Helper function to find image based on item name (fuzzy match)
  const findProductImage = (itemName: string): string | null => {
    const normalizedItem = itemName.toLowerCase();
    const product = PRODUCTS.find(p => {
      const normalizedName = p.name.toLowerCase();
      return normalizedItem.includes(normalizedName) || normalizedName.includes(normalizedItem);
    });
    return product ? product.image : null;
  };

  // Helper Component for Horizontal Slider
  const ProductSlider = ({ products }: { products: Product[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 320; // Approx card width
            current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative group/slider">
            {/* Scroll Buttons - Visible on hover/mobile */}
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
                        />
                    </div>
                ))}
            </div>
        </div>
    );
  };

  // Categorize Products
  const hardwareIds = ['phone-graphene', 'pixel-pro', 'laptop-hardened', 'vpn-router', 'voice-changer'];
  const hardwareProducts = PRODUCTS.filter(p => hardwareIds.includes(p.id));
  const digitalProducts = PRODUCTS.filter(p => !hardwareIds.includes(p.id));
  
  // Active Bundle Data
  const activeBundle = BUNDLES.find(b => b.id === activeBundleId) || BUNDLES[0];
  const isGhostActive = activeBundle.tier === BundleTier.FANTASMA;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-black text-cyber-green font-mono overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 opacity-20" />
        
        <div className="relative z-10 flex flex-col h-full p-8 md:p-12 max-w-4xl mx-auto justify-end pb-20">
            {/* Center Logo Area - Optimized for Mobile (Higher up) */}
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
                
                {/* Simulated Hardware Stats */}
                <div className="flex justify-center gap-8 mt-12 text-xs text-cyber-dim opacity-70">
                    <div className="flex items-center gap-2">
                        <Cpu size={16} />
                        <span>CORE: {(Math.random() * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wifi size={16} />
                        <span>NET: ENCRYPTED</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Activity size={16} />
                        <span>MEM: 16TB</span>
                    </div>
                </div>
            </div>

            {/* Boot Log - Reduced height on mobile */}
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

            {/* Progress Bar */}
            <div className="mt-6 w-full bg-cyber-dark border border-cyber-dim h-4 relative overflow-hidden">
                <motion.div 
                    className="h-full bg-cyber-green absolute top-0 left-0"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                />
                {/* Striped overlay on bar */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.5)_25%,rgba(0,0,0,0.5)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.5)_75%,rgba(0,0,0,0.5)_100%)] bg-[length:10px_10px] opacity-30" />
            </div>
            <div className="flex justify-between text-xs mt-2 text-cyber-dim">
                <span>SYSTEM INTEGRITY CHECK</span>
                <span>{Math.min(100, Math.floor(progress))}%</span>
            </div>
        </div>
        
        {/* CRT Overlay on Loading */}
        <div className="scanline opacity-20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-green font-mono selection:bg-cyber-green selection:text-black relative overflow-x-hidden">
      
      {/* CRT Scanline Overlay */}
      <div className="scanline opacity-20" />
      <div className="fixed inset-0 pointer-events-none z-50 animate-pulse-fast opacity-[0.02] bg-white mix-blend-overlay" />

      {/* Components Overlay */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <ProductModal 
        isOpen={!!selectedProduct} 
        product={selectedProduct} 
        onClose={handleCloseProduct}
        onAddToCart={handleAddToCart}
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/90 border-b border-cyber-dim backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <Terminal className="text-cyber-green animate-pulse" />
              <span className={`text-xl font-bold tracking-widest ${glitchActive ? 'translate-x-1 text-red-500' : 'text-white'}`}>
                GHOST_PROTOCOL
              </span>
            </div>
            
            {/* Real-time Crypto Ticker */}
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['GADGET', 'BUNDLE', 'INFO'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-sm text-gray-400 hover:text-cyber-green hover:underline decoration-cyber-green underline-offset-4 transition-all"
              >
                {item}
              </button>
            ))}
            <div 
              className="relative cursor-pointer group"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="text-white group-hover:text-cyber-green transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-cyber-green text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden gap-4 items-center">
            <div 
                className="relative cursor-pointer"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-cyber-green text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
            </div>
            <button className="text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 z-30 bg-black/95 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {['GADGET', 'BUNDLE', 'INFO'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-2xl text-cyber-green font-bold uppercase"
              >
                {item}
              </button>
            ))}
             <div className="mt-8 p-4 border border-cyber-dim/30 bg-cyber-dark/30 rounded w-64">
                <div className="text-xs text-cyber-dim mb-2 text-center">MARKET_DATA (LIVE)</div>
                <div className="flex justify-between items-center mb-2">
                    <span>BTC/USDT</span>
                    <span className="text-cyber-green font-bold">${cryptoPrices.btc.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>XMR/USDT</span>
                    <span className="text-cyber-green font-bold">${cryptoPrices.xmr.toLocaleString()}</span>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Layer 0: Deep Parallax Background */}
        <motion.div 
            className="absolute inset-0 z-0 opacity-20"
            style={{ 
                y: backgroundY,
                backgroundImage: 'linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }} 
        />
        
        {/* Pulsing Green Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl max-h-2xl flex items-center justify-center pointer-events-none z-0 mix-blend-screen">
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-cyber-green blur-[80px]"
          />
           <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full bg-cyber-dim blur-[100px]"
          />
        </div>
        
        {/* Layer 1: Floating Elements (Parallax) */}
        <motion.div 
           style={{ y: shape1Y }}
           className="absolute top-[10%] left-[5%] w-64 h-64 bg-cyber-green/5 rounded-full blur-3xl pointer-events-none" 
        />
        <motion.div 
           style={{ y: shape2Y }}
           className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-cyber-dim/10 rounded-full blur-3xl pointer-events-none" 
        />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            style={{ y: textY }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-cyber-dim text-lg mb-4 tracking-[0.5em] uppercase">Security Level: Maximum</h2>
            <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 leading-tight">
              DIVENTA <br/>
              <span className={`text-cyber-green inline-block ${glitchActive ? 'translate-x-2 skew-x-12' : ''}`}>
                INVISIBILE
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg mb-10 leading-relaxed">
              Il mondo ti osserva. I nostri strumenti ti restituiscono l'ombra. 
              Hardware e software progettati per l'anonimato totale in un'era di sorveglianza di massa.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <CyberButton onClick={() => scrollToSection('bundle')} variant="primary">
                INIZIA PROTOCOLLO
              </CyberButton>
              <CyberButton onClick={() => scrollToSection('gadget')} variant="secondary">
                SFOGLIA ARSENALE
              </CyberButton>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-cyber-dim"
        >
          <ArrowDown />
        </motion.div>
      </section>

      {/* Gadgets Section */}
      <section id="gadget" className="py-24 relative border-t border-cyber-dim/20">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-16 border-b border-cyber-dim pb-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">ARSENALE TATTICO</h2>
              <p className="text-cyber-dim">{' > '} Equipaggiamento singolo per operazioni mirate.</p>
            </div>
            <div className="hidden md:block text-xs text-gray-500 font-mono">
              STATUS: READY
            </div>
          </div>
          
          {/* HARDWARE ROW */}
          <div className="mb-12">
            <h3 className="text-xl text-white font-bold mb-6 flex items-center gap-2 border-l-4 border-cyber-green pl-3">
              <HardDrive size={24} className="text-cyber-green"/> HARDWARE
            </h3>
            <ProductSlider products={hardwareProducts} />
          </div>

          {/* DIGITAL & GEAR ROW */}
          <div>
            <h3 className="text-xl text-white font-bold mb-6 flex items-center gap-2 border-l-4 border-cyber-green pl-3">
              <FileCode size={24} className="text-cyber-green"/> DIGITAL & FIELD GEAR
            </h3>
            <ProductSlider products={digitalProducts} />
          </div>

        </div>
      </section>

      {/* NEW BUNDLES SECTION - TACTICAL TERMINAL */}
      <section id="bundle" className="py-12 md:py-24 bg-black relative overflow-hidden">
        {/* Dynamic Background based on Tier */}
        <div className={`absolute inset-0 transition-colors duration-1000 ${isGhostActive ? 'bg-cyber-alert/5' : 'bg-cyber-green/5'}`} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.8)_1px,transparent_1px)] bg-[length:40px_40px] opacity-20 pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 border-b border-cyber-dim/30 pb-4">
            <div>
                <h2 className={`text-3xl md:text-5xl font-bold font-mono tracking-tighter mb-2 ${isGhostActive ? 'text-cyber-alert animate-glitch' : 'text-white'}`}>
                    PROTOCOLLI DI SICUREZZA
                </h2>
                <p className={`${isGhostActive ? 'text-cyber-alert' : 'text-cyber-green'} text-sm md:text-base font-mono`}>
                    {' > '} SELECT CLEARANCE LEVEL // SYSTEM_READY
                </p>
            </div>
            {isGhostActive && (
                 <div className="text-cyber-alert font-bold animate-pulse uppercase tracking-widest border border-cyber-alert px-4 py-1 mt-4 md:mt-0">
                    Warning: Threat Level Extreme
                 </div>
            )}
          </div>

          {/* TERMINAL UI CONTAINER */}
          <div className={`flex flex-col lg:flex-row border-2 min-h-[600px] transition-all duration-500 bg-black/80 backdrop-blur-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] ${isGhostActive ? 'border-cyber-alert shadow-[0_0_30px_rgba(255,0,60,0.15)]' : 'border-cyber-dim shadow-[0_0_30px_rgba(0,255,65,0.1)]'}`}>
             
             {/* LEFT SIDE: SELECTOR MENU */}
             <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-cyber-dim/30 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible">
                {BUNDLES.map((bundle) => {
                    const isActive = activeBundleId === bundle.id;
                    const isGhost = bundle.tier === BundleTier.FANTASMA;
                    
                    return (
                        <button
                            key={bundle.id}
                            onClick={() => setActiveBundleId(bundle.id)}
                            className={`relative flex-shrink-0 lg:flex-shrink p-4 lg:p-6 text-left transition-all duration-300 group border-r lg:border-r-0 border-cyber-dim/20 lg:border-b ${
                                isActive 
                                    ? isGhost ? 'bg-cyber-alert text-black' : 'bg-cyber-green text-black'
                                    : 'hover:bg-cyber-dim/10 text-gray-400 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-xs opacity-70">LVL_{bundle.tier === BundleTier.FANTASMA ? 'X' : parseInt(bundle.price.toString()) % 10}</span>
                                {isActive && <ChevronRight size={14} className="animate-pulse" />}
                            </div>
                            <h3 className="font-bold font-mono text-sm lg:text-lg uppercase leading-tight">{bundle.name}</h3>
                            <div className={`text-[10px] mt-2 font-mono ${isActive ? 'text-black/70' : 'text-cyber-dim'}`}>
                                {bundle.items.length} MODULES INSTALLED
                            </div>
                            
                            {/* Active Indicator Line */}
                            {isActive && (
                                <motion.div 
                                    layoutId="activeIndicator"
                                    className={`absolute left-0 top-0 bottom-0 w-1 lg:w-2 ${isGhost ? 'bg-black' : 'bg-white'}`}
                                />
                            )}
                        </button>
                    );
                })}
             </div>

             {/* RIGHT SIDE: MAIN DISPLAY */}
             <div className="flex-1 relative overflow-hidden flex flex-col">
                {/* CRT Scanline within terminal */}
                <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${isGhostActive ? 'via-cyber-alert/5' : 'via-cyber-green/5'} to-transparent h-[10%] animate-scan-vertical pointer-events-none z-0`} />

                {/* Content Transition Wrapper */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeBundle.id}
                        initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col md:flex-row h-full relative z-10"
                    >
                        {/* DETAILS COLUMN */}
                        <div className="p-6 md:p-10 flex-1 flex flex-col">
                             <div className="mb-6">
                                <div className={`inline-flex items-center gap-2 px-2 py-1 text-xs border mb-4 font-mono ${isGhostActive ? 'border-cyber-alert text-cyber-alert' : 'border-cyber-green text-cyber-green'}`}>
                                    {isGhostActive ? <Skull size={12} /> : <Shield size={12} />}
                                    <span>PROTOCOL STATUS: ACTIVE</span>
                                </div>
                                <h3 className={`text-4xl md:text-5xl font-black font-mono mb-2 ${isGhostActive ? 'text-white' : 'text-white'}`}>
                                    {activeBundle.name}
                                </h3>
                                <p className="text-gray-400 font-mono text-lg italic">
                                    "{activeBundle.tagline}"
                                </p>
                             </div>

                             {/* STATS VISUALIZER */}
                             <div className="grid grid-cols-3 gap-4 mb-8 font-mono text-xs">
                                 <div>
                                     <div className="text-gray-500 mb-1">ANONYMITY</div>
                                     <div className="h-1 bg-gray-800 w-full">
                                         <motion.div 
                                            initial={{ width: 0 }} 
                                            animate={{ width: isGhostActive ? '100%' : '80%' }} 
                                            className={`h-full ${isGhostActive ? 'bg-cyber-alert' : 'bg-cyber-green'}`} 
                                            transition={{ delay: 0.2, duration: 1 }}
                                         />
                                     </div>
                                 </div>
                                 <div>
                                     <div className="text-gray-500 mb-1">ENCRYPTION</div>
                                     <div className="h-1 bg-gray-800 w-full">
                                         <motion.div 
                                            initial={{ width: 0 }} 
                                            animate={{ width: isGhostActive ? '100%' : '60%' }} 
                                            className={`h-full ${isGhostActive ? 'bg-cyber-alert' : 'bg-cyber-green'}`} 
                                            transition={{ delay: 0.3, duration: 1 }}
                                         />
                                     </div>
                                 </div>
                                 <div>
                                     <div className="text-gray-500 mb-1">COUNTER-INTEL</div>
                                     <div className="h-1 bg-gray-800 w-full">
                                         <motion.div 
                                            initial={{ width: 0 }} 
                                            animate={{ width: isGhostActive ? '100%' : '40%' }} 
                                            className={`h-full ${isGhostActive ? 'bg-cyber-alert' : 'bg-cyber-green'}`} 
                                            transition={{ delay: 0.4, duration: 1 }}
                                         />
                                     </div>
                                 </div>
                             </div>

                             {/* ITEMS LIST */}
                             <div className="flex-1 mb-8 overflow-y-auto max-h-[200px] scrollbar-thin pr-2">
                                 <h4 className={`text-xs font-bold uppercase mb-4 flex items-center gap-2 ${isGhostActive ? 'text-cyber-alert' : 'text-cyber-green'}`}>
                                     <Crosshair size={14} /> Mission Loadout
                                 </h4>
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
                                     <div className="text-xs text-gray-500">TOTAL COST</div>
                                     <div className={`text-3xl font-bold font-mono ${isGhostActive ? 'text-cyber-alert' : 'text-white'}`}>
                                         €{activeBundle.price.toFixed(0)}
                                     </div>
                                 </div>
                                 <CyberButton 
                                    onClick={() => handleAddToCart(activeBundle)} 
                                    variant={isGhostActive ? 'danger' : 'primary'}
                                 >
                                     INITIALIZE
                                 </CyberButton>
                             </div>
                        </div>

                        {/* VISUAL COLUMN (Desktop only image preview of bundle contents) */}
                        <div className="w-full md:w-1/3 bg-black/50 border-t md:border-t-0 md:border-l border-gray-800 p-6 flex flex-col justify-center items-center relative overflow-hidden">
                             {/* Floating Background Icons */}
                             <div className={`absolute inset-0 opacity-10 flex items-center justify-center ${isGhostActive ? 'text-cyber-alert' : 'text-cyber-green'}`}>
                                 {isGhostActive ? <Skull size={200} /> : <Lock size={200} />}
                             </div>
                             
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
                             {activeBundle.items.length > 4 && (
                                 <div className="mt-4 text-xs text-gray-500 font-mono">
                                     + {activeBundle.items.length - 4} ADDITIONAL ASSETS
                                 </div>
                             )}
                        </div>
                    </motion.div>
                </AnimatePresence>
             </div>
          </div>
        </div>
      </section>

      {/* Info / Footer Section */}
      <section id="info" className="py-20 border-t border-cyber-dim bg-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
            
            <div>
              <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                <Terminal size={20} /> SYSTEM_LOGS
              </h3>
              <div className="space-y-2 text-cyber-dim font-mono text-xs opacity-70">
                <p>{' > '} 23:42:12 - Connection encrypted (AES-256)</p>
                <p>{' > '} 23:42:15 - Tracking cookies incinerated</p>
                <p>{' > '} 23:42:18 - User location masked [Node: Reykjavik]</p>
                <p>{' > '} 23:42:22 - GhostProtocol active</p>
              </div>
            </div>

            <div>
              <h3 className="text-white text-xl font-bold mb-6">MISSION</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Non vendiamo solo hardware. Vendiamo la libertà di non essere un datapoint. 
                Ogni dispositivo è testato, sanitizzato e preparato in ambiente air-gapped.
              </p>
              <div className="flex gap-4">
                <span className="text-cyber-green cursor-pointer hover:underline">PGP Key</span>
                <span className="text-cyber-green cursor-pointer hover:underline">Onion Site</span>
                <span className="text-cyber-green cursor-pointer hover:underline">Canary</span>
              </div>
            </div>

            <div className="bg-cyber-dark/50 p-6 border border-cyber-dim/30">
              <h3 className="text-white font-bold uppercase">Newsletter Criptata</h3>
              <p className="text-gray-500 mb-4 text-xs">Ricevi aggiornamenti su nuove vulnerabilità 0-day e patch di sicurezza.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="email@proton.me" 
                  className="bg-black border border-cyber-dim text-white p-2 w-full focus:outline-none focus:border-cyber-green text-sm"
                />
                <button className="bg-cyber-green text-black px-4 font-bold hover:bg-white transition-colors">
                  SUB
                </button>
              </div>
            </div>

          </div>
          
          <div className="mt-16 text-center text-gray-600 text-xs font-mono">
            <p>GHOST_PROTOCOL © {new Date().getFullYear()} // ALL RIGHTS RESERVED // NO LOGS KEPT</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
