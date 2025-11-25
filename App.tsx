
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ShoppingCart, Terminal, Menu, X, ArrowDown, Cpu, Wifi, Activity } from 'lucide-react';
import { PRODUCTS, BUNDLES } from './constants';
import { ProductCard } from './components/ProductCard';
import { BundleCard } from './components/BundleCard';
import { CyberButton } from './components/CyberButton';
import { CartSidebar } from './components/CartSidebar';
import { CartItem, Product, Bundle } from './types';

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
  
  // Loading State
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Boot Sequence Logic
  useEffect(() => {
    let currentLine = 0;
    const totalDuration = 3500; // 3.5 seconds total load
    const lineInterval = totalDuration / BOOT_SEQUENCE.length;

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

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-black text-cyber-green font-mono overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 opacity-20" />
        
        <div className="relative z-10 flex flex-col h-full p-8 md:p-12 max-w-4xl mx-auto justify-end pb-20">
            {/* Center Logo Area */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">
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

            {/* Boot Log */}
            <div className="font-mono text-sm md:text-base h-48 overflow-hidden flex flex-col justify-end border-l-2 border-cyber-dim pl-4 bg-black/50 backdrop-blur-sm p-4 rounded-r-lg shadow-[0_0_20px_rgba(0,255,65,0.1)]">
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

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/90 border-b border-cyber-dim backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal className="text-cyber-green animate-pulse" />
            <span className={`text-xl font-bold tracking-widest ${glitchActive ? 'translate-x-1 text-red-500' : 'text-white'}`}>
              GHOST_PROTOCOL
            </span>
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
              <p className="text-cyber-dim">&gt; Equipaggiamento singolo per operazioni mirate.</p>
            </div>
            <div className="hidden md:block text-xs text-gray-500 font-mono">
              STATUS: READY
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Bundles Section */}
      <section id="bundle" className="py-24 bg-cyber-dark relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,143,17,0.15),transparent)] pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">PROTOCOLLI DI SICUREZZA</h2>
            <p className="text-cyber-green text-lg max-w-2xl mx-auto">&gt; Seleziona il tuo livello di copertura. Bundle pre-configurati per la massima efficienza operativa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BUNDLES.map(bundle => (
              <BundleCard key={bundle.id} bundle={bundle} onAddToCart={handleAddToCart} />
            ))}
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
                <p>&gt; 23:42:12 - Connection encrypted (AES-256)</p>
                <p>&gt; 23:42:15 - Tracking cookies incinerated</p>
                <p>&gt; 23:42:18 - User location masked [Node: Reykjavik]</p>
                <p>&gt; 23:42:22 - GhostProtocol active</p>
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
              <h3 className="text-white font-bold mb-4 uppercase">Newsletter Criptata</h3>
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
