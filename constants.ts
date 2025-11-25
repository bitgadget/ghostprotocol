
import { Bundle, BundleTier, Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'usb-tails',
    name: 'USB Ghost Key',
    description: 'Chiavetta USB criptata con OS Tails live. Nessuna traccia sul disco rigido ospite.',
    price: 49.99,
    icon: 'usb',
    image: 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?q=80&w=800&auto=format&fit=crop', 
    specs: ['32GB Encrypted', 'Tails OS pre-flash', 'Auto-Wipe Panic Button']
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
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?q=80&w=800&auto=format&fit=crop',
    specs: ['Titan M2 Chip', 'No-Mic Mod', 'Ram Disk Mode']
  },
  {
    id: 'faraday-bag',
    name: 'Signal Block Bag',
    description: 'Custodia schermata militare. Blocca GPS, WiFi, GSM, 4G, 5G, RFID e NFC.',
    price: 35.00,
    icon: 'shield',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800&auto=format&fit=crop',
    specs: ['Doppio strato Faraday', 'Waterproof', 'Anti-Tracking']
  },
  {
    id: 'faraday-backpack',
    name: 'Faraday Backpack',
    description: 'Zaino tattico completamente schermato per laptop e attrezzatura sensibile.',
    price: 129.00,
    icon: 'backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    specs: ['25L Capacity', 'Molle System', 'Total Signal Block']
  },
  {
    id: 'burner-sim',
    name: 'Anon-SIM Internazionale',
    description: 'SIM Card prepagata anonima funzionante in 120 paesi. Nessun KYC richiesto.',
    price: 80.00,
    icon: 'sim',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=800&auto=format&fit=crop',
    specs: ['No ID Req', 'Multi-Network', 'Crypto Payment Only']
  },
  {
    id: 'yubikey',
    name: 'YubiKey 5 NFC',
    description: 'Chiave di sicurezza hardware per autenticazione a due fattori (2FA) e FIDO2.',
    price: 55.00,
    icon: 'key',
    image: 'https://images.unsplash.com/photo-1606229338636-3b2721869877?q=80&w=800&auto=format&fit=crop',
    specs: ['NFC Enabled', 'USB-A/C', 'Water Resistant']
  },
  {
    id: 'vpn-router',
    name: 'Router VPN Travel',
    description: 'Router portatile con OpenWRT e VPN WireGuard pre-configurata con Kill Switch.',
    price: 119.00,
    icon: 'wifi',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?q=80&w=800&auto=format&fit=crop',
    specs: ['WireGuard Ready', 'Tor Bridge', 'Battery Powered']
  },
  {
    id: 'laptop-hardened',
    name: 'Laptop Linux Hardened',
    description: 'ThinkPad ricondizionato grado A con QubesOS o Tails. BIOS Open Source (Coreboot).',
    price: 1249.00,
    icon: 'laptop',
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop',
    specs: ['Coreboot BIOS', 'Intel ME Disabled', 'QubesOS']
  },
  {
    id: 'voice-changer',
    name: 'Voice Changer HW',
    description: 'Modulatore vocale hardware per chiamate sicure. Altera timbro e frequenza in tempo reale.',
    price: 149.00,
    icon: 'mic',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    specs: ['Real-time Process', 'No Latency', 'Jack 3.5mm I/O']
  }
];

export const BUNDLES: Bundle[] = [
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
