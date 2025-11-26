
import { Bundle, BundleTier, Product, Language } from './types';

const PRODUCTS_IT: Product[] = [
  {
    id: 'usb-tails',
    name: 'USB Ghost Key',
    description: 'Chiavetta USB criptata con OS Tails live. Nessuna traccia sul disco rigido ospite.',
    price: 49.99,
    icon: 'usb',
    image: 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?q=80&w=800&auto=format&fit=crop', 
    specs: ['32GB Criptati', 'Tails OS pre-flash', 'Pulsante Auto-Wipe']
  },
  {
    id: 'opsec-guide',
    name: 'Guida PDF OpSec Base',
    description: 'Manuale operativo essenziale per la sicurezza digitale personale e comportamentale.',
    price: 19.99,
    icon: 'file',
    image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=800&auto=format&fit=crop',
    specs: ['PDF Criptato', 'Checklist Sicurezza', 'Best Practices 2024']
  },
  {
    id: 'phone-graphene',
    name: 'Pixel Stealth',
    description: 'Smartphone Google Pixel de-googlizzato con GrapheneOS preinstallato e hardened.',
    price: 699.00,
    icon: 'smartphone',
    image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=800&auto=format&fit=crop',
    specs: ['GrapheneOS', 'Microfono disabilitabile', 'Sandbox Isole']
  },
  {
    id: 'pixel-pro',
    name: 'Pixel Stealth Pro',
    description: 'Versione potenziata con hardware tamper-proof e rimozione fisica fotocamere/microfoni su richiesta.',
    price: 999.00,
    icon: 'smartphone',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=800&auto=format&fit=crop',
    specs: ['Chip Titan M2', 'No-Mic Mod', 'Modalità Ram Disk']
  },
  {
    id: 'faraday-bag',
    name: 'Signal Block Bag',
    description: 'Custodia schermata militare. Blocca GPS, WiFi, GSM, 4G, 5G, RFID e NFC.',
    price: 35.00,
    icon: 'shield',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800&auto=format&fit=crop',
    specs: ['Doppio strato Faraday', 'Impermeabile', 'Anti-Tracking']
  },
  {
    id: 'faraday-backpack',
    name: 'Faraday Backpack',
    description: 'Zaino tattico completamente schermato per laptop e attrezzatura sensibile.',
    price: 129.00,
    icon: 'backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    specs: ['Capacità 25L', 'Sistema Molle', 'Blocco Segnale Totale']
  },
  {
    id: 'burner-sim',
    name: 'Anon-SIM Internazionale',
    description: 'SIM Card prepagata anonima funzionante in 120 paesi. Nessun KYC richiesto.',
    price: 80.00,
    icon: 'sim',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=800&auto=format&fit=crop',
    specs: ['No ID Req', 'Multi-Network', 'Solo Pagamento Crypto']
  },
  {
    id: 'yubikey',
    name: 'YubiKey 5 NFC',
    description: 'Chiave di sicurezza hardware per autenticazione a due fattori (2FA) e FIDO2.',
    price: 55.00,
    icon: 'key',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=800&auto=format&fit=crop',
    specs: ['Abilitata NFC', 'USB-A/C', 'Resistente Acqua']
  },
  {
    id: 'vpn-router',
    name: 'Router VPN Travel',
    description: 'Router portatile con OpenWRT e VPN WireGuard pre-configurata con Kill Switch.',
    price: 119.00,
    icon: 'wifi',
    image: 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?q=80&w=800&auto=format&fit=crop',
    specs: ['WireGuard Ready', 'Tor Bridge', 'Batteria Integrata']
  },
  {
    id: 'laptop-hardened',
    name: 'Laptop Linux Hardened',
    description: 'ThinkPad ricondizionato grado A con QubesOS o Tails. BIOS Open Source (Coreboot).',
    price: 1249.00,
    icon: 'laptop',
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop',
    specs: ['BIOS Coreboot', 'Intel ME Disabilitato', 'QubesOS']
  },
  {
    id: 'voice-changer',
    name: 'Voice Changer HW',
    description: 'Modulatore vocale hardware per chiamate sicure. Altera timbro e frequenza in tempo reale.',
    price: 149.00,
    icon: 'mic',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    specs: ['Processo Real-time', 'Nessuna Latenza', 'Jack 3.5mm I/O']
  }
];

const PRODUCTS_EN: Product[] = [
  {
    id: 'usb-tails',
    name: 'USB Ghost Key',
    description: 'Encrypted USB drive with live Tails OS. No trace left on host hard drive.',
    price: 49.99,
    icon: 'usb',
    image: 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?q=80&w=800&auto=format&fit=crop', 
    specs: ['32GB Encrypted', 'Tails OS pre-flash', 'Auto-Wipe Panic Button']
  },
  {
    id: 'opsec-guide',
    name: 'OpSec Guide PDF',
    description: 'Essential operational manual for personal digital and behavioral security.',
    price: 19.99,
    icon: 'file',
    image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=800&auto=format&fit=crop',
    specs: ['Encrypted PDF', 'Security Checklist', 'Best Practices 2024']
  },
  {
    id: 'phone-graphene',
    name: 'Pixel Stealth',
    description: 'De-googled Google Pixel smartphone with pre-installed and hardened GrapheneOS.',
    price: 699.00,
    icon: 'smartphone',
    image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=800&auto=format&fit=crop',
    specs: ['GrapheneOS', 'Mic Toggle', 'Sandboxed Isles']
  },
  {
    id: 'pixel-pro',
    name: 'Pixel Stealth Pro',
    description: 'Enhanced version with tamper-proof hardware and physical camera/mic removal on request.',
    price: 999.00,
    icon: 'smartphone',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=800&auto=format&fit=crop',
    specs: ['Titan M2 Chip', 'No-Mic Mod', 'Ram Disk Mode']
  },
  {
    id: 'faraday-bag',
    name: 'Signal Block Bag',
    description: 'Military-grade shielded pouch. Blocks GPS, WiFi, GSM, 4G, 5G, RFID, and NFC.',
    price: 35.00,
    icon: 'shield',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800&auto=format&fit=crop',
    specs: ['Double Faraday Layer', 'Waterproof', 'Anti-Tracking']
  },
  {
    id: 'faraday-backpack',
    name: 'Faraday Backpack',
    description: 'Tactical backpack fully shielded for laptops and sensitive equipment.',
    price: 129.00,
    icon: 'backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    specs: ['25L Capacity', 'Molle System', 'Total Signal Block']
  },
  {
    id: 'burner-sim',
    name: 'Anon-SIM International',
    description: 'Anonymous prepaid SIM Card working in 120 countries. No KYC required.',
    price: 80.00,
    icon: 'sim',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=800&auto=format&fit=crop',
    specs: ['No ID Req', 'Multi-Network', 'Crypto Payment Only']
  },
  {
    id: 'yubikey',
    name: 'YubiKey 5 NFC',
    description: 'Hardware security key for two-factor authentication (2FA) and FIDO2.',
    price: 55.00,
    icon: 'key',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=800&auto=format&fit=crop',
    specs: ['NFC Enabled', 'USB-A/C', 'Water Resistant']
  },
  {
    id: 'vpn-router',
    name: 'VPN Router Travel',
    description: 'Portable router with OpenWRT and pre-configured WireGuard VPN with Kill Switch.',
    price: 119.00,
    icon: 'wifi',
    image: 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?q=80&w=800&auto=format&fit=crop',
    specs: ['WireGuard Ready', 'Tor Bridge', 'Battery Powered']
  },
  {
    id: 'laptop-hardened',
    name: 'Hardened Linux Laptop',
    description: 'Refurbished Grade A ThinkPad with QubesOS or Tails. Open Source BIOS (Coreboot).',
    price: 1249.00,
    icon: 'laptop',
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop',
    specs: ['Coreboot BIOS', 'Intel ME Disabled', 'QubesOS']
  },
  {
    id: 'voice-changer',
    name: 'Voice Changer HW',
    description: 'Hardware voice modulator for secure calls. Alters timbre and frequency in real-time.',
    price: 149.00,
    icon: 'mic',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    specs: ['Real-time Process', 'No Latency', 'Jack 3.5mm I/O']
  }
];

const BUNDLES_IT: Bundle[] = [
  {
    id: 'b-base',
    tier: BundleTier.BASE,
    name: 'BASE PROTOCOL',
    tagline: 'Inizia a scomparire.',
    price: 79.99,
    features: ['Navigazione Anonima', 'Boot Sicuro', 'Email Criptata'],
    recommendedFor: 'Principianti Privacy',
    items: ['USB Ghost Key', 'Guida PDF OpSec Base']
  },
  {
    id: 'b-medio',
    tier: BundleTier.MEDIO,
    name: 'SHADOW PROTOCOL',
    tagline: 'Diventa difficile da tracciare.',
    price: 149.99,
    features: ['Schermatura Fisica', 'OS Portatile', 'Comunicazioni Sicure'],
    recommendedFor: 'Attivisti, Giornalisti',
    items: ['USB Ghost Key', 'Signal Block Bag', 'YubiKey 5 NFC']
  },
  {
    id: 'b-imp',
    tier: BundleTier.IMPRENDITORE,
    name: 'CEO PROTOCOL',
    tagline: 'Proteggi il tuo impero.',
    price: 899.00,
    features: ['Hardware Dedicato', 'Anti-Intercettazione', 'Anonimato Finanziario'],
    recommendedFor: 'CEO, VIP, Crypto Whales',
    items: ['Pixel Stealth (GrapheneOS)', 'Signal Block Bag', 'Router VPN Travel']
  },
  {
    id: 'b-ghost',
    tier: BundleTier.FANTASMA,
    name: 'GHOST PROTOCOL',
    tagline: 'Tu non esisti.',
    price: 1499.00,
    features: ['Identità Sintetica', 'Off-Grid Comms', 'Kit Sopravvivenza Digitale'],
    recommendedFor: 'Livello Massimo di Minaccia',
    items: ['Pixel Stealth Pro', 'Laptop Linux Hardened', 'Anon-SIM (1 anno)', 'Voice Changer HW', 'Faraday Backpack']
  }
];

const BUNDLES_EN: Bundle[] = [
  {
    id: 'b-base',
    tier: BundleTier.BASE,
    name: 'BASE PROTOCOL',
    tagline: 'Start disappearing.',
    price: 79.99,
    features: ['Anonymous Browsing', 'Secure Boot', 'Encrypted Email'],
    recommendedFor: 'Privacy Beginners',
    items: ['USB Ghost Key', 'OpSec Guide PDF']
  },
  {
    id: 'b-medio',
    tier: BundleTier.MEDIO,
    name: 'SHADOW PROTOCOL',
    tagline: 'Become hard to track.',
    price: 149.99,
    features: ['Physical Shielding', 'Portable OS', 'Secure Comms'],
    recommendedFor: 'Activists, Journalists',
    items: ['USB Ghost Key', 'Signal Block Bag', 'YubiKey 5 NFC']
  },
  {
    id: 'b-imp',
    tier: BundleTier.IMPRENDITORE,
    name: 'CEO PROTOCOL',
    tagline: 'Protect your empire.',
    price: 899.00,
    features: ['Dedicated Hardware', 'Anti-Interception', 'Financial Anonymity'],
    recommendedFor: 'CEO, VIP, Crypto Whales',
    items: ['Pixel Stealth', 'Signal Block Bag', 'VPN Router Travel']
  },
  {
    id: 'b-ghost',
    tier: BundleTier.FANTASMA,
    name: 'GHOST PROTOCOL',
    tagline: 'You do not exist.',
    price: 1499.00,
    features: ['Synthetic Identity', 'Off-Grid Comms', 'Digital Survival Kit'],
    recommendedFor: 'Maximum Threat Level',
    items: ['Pixel Stealth Pro', 'Hardened Linux Laptop', 'Anon-SIM International', 'Voice Changer HW', 'Faraday Backpack']
  }
];

export const getProducts = (lang: Language) => lang === 'it' ? PRODUCTS_IT : PRODUCTS_EN;
export const getBundles = (lang: Language) => lang === 'it' ? BUNDLES_IT : BUNDLES_EN;

// Backward compatibility for fuzzy matching if needed (though we should use localized names)
export const PRODUCTS_ALL = [...PRODUCTS_IT, ...PRODUCTS_EN];
