import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Menu, Clock, Instagram, Facebook, Phone } from "lucide-react";
import logoTiPuglio from "../assets/images/logo_ti_puglio_1782382305178.jpg";

interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  currentSection: string;
  onNavigate: (section: string) => void;
}

export default function HamburgerMenu({ isOpen, onToggle, currentSection, onNavigate }: HamburgerMenuProps) {
  const menuItems = [
    { id: "menu", label: "Menù & Aperitivo", color: "bg-pop-yellow" },
    { id: "recensioni", label: "Recensioni Ospiti", color: "bg-pop-pink" },
    { id: "dove-siamo", label: "Dove Siamo", color: "bg-pop-cyan" },
    { id: "contatti", label: "Prenota Tavolo", color: "bg-pop-orange" },
  ];

  return (
    <>
      {/* Heavy Pop Art Menu Toggle Button - ALWAYS visible when menu is closed */}
      <div className="fixed top-6 left-6 z-40">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className="bg-pop-yellow text-black border-4 border-black p-3 pop-shadow rounded-none cursor-pointer flex items-center justify-center hover:bg-pop-cyan transition-colors"
          aria-label="Menu"
        >
          {isOpen ? <X size={28} className="stroke-[3]" /> : <Menu size={28} className="stroke-[3]" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop filter overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black z-30 cursor-pointer"
            />

            {/* Left Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 120 }}
              className="fixed top-0 left-0 bottom-0 w-[320px] sm:w-[380px] bg-pop-cream border-r-8 border-black z-30 flex flex-col p-6 overflow-y-auto"
            >
              {/* Logo block */}
              <div className="mt-16 mb-8 text-center">
                <div className="bg-white border-4 border-black pop-shadow p-2 px-4 inline-block rotate-[-2deg] select-none">
                  <div className="flex items-center justify-center gap-2">
                    <img 
                      src={logoTiPuglio} 
                      alt="Ti Puglio Logo" 
                      className="h-12 w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-display text-xl tracking-wide uppercase text-black">
                      Ristorante Ti Puglio
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation list */}
              <nav className="flex flex-col gap-4 mb-8">
                {menuItems.map((item) => {
                  const isActive = currentSection === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.05, x: 10, rotate: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onNavigate(item.id);
                        onToggle();
                      }}
                      className={`w-full text-left font-display text-2xl tracking-wide uppercase px-5 py-3 border-4 border-black pop-shadow cursor-pointer transition-all ${
                        isActive 
                          ? `${item.color} text-black translate-x-2` 
                          : "bg-white hover:bg-pop-cyan text-black"
                      }`}
                    >
                      {item.label}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Orari (Opening Hours) Block in Pop Art Card */}
              <div className="bg-white border-4 border-black pop-shadow p-4 mb-8 rotate-[1deg] relative">
                <div className="absolute -top-3 -right-3 bg-pop-pink text-white font-display text-sm uppercase px-2 py-1 border-2 border-black rotate-[5deg] tracking-wide pop-shadow-sm">
                  Orari!
                </div>
                <div className="flex items-center gap-2 mb-3 border-b-2 border-dashed border-black pb-1.5">
                  <Clock size={18} className="stroke-[3.5] text-pop-orange" />
                  <span className="font-comic font-bold text-base tracking-tight uppercase">Sempre Aperti!</span>
                </div>
                <div className="font-mono text-xs text-left leading-relaxed flex flex-col gap-2">
                  <div>
                    <span className="font-bold text-pop-red">APERITIVO:</span>
                    <br />
                    <span>Lun — Dom &nbsp;·&nbsp; 18:30 — 20:00</span>
                  </div>
                  <div>
                    <span className="font-bold text-pop-red">RISTORANTE:</span>
                    <br />
                    <span>Lun — Dom &nbsp;·&nbsp; 19:30 — 23:00</span>
                  </div>
                </div>
              </div>

              {/* Social and Info Block */}
              <div className="mt-auto flex flex-col gap-3">
                <div className="text-center font-comic font-bold text-sm uppercase tracking-wide text-pop-red">
                  Seguici &amp; Contattaci
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <motion.a
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    href="https://www.instagram.com/ti.puglio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-pop-pink border-4 border-black pop-shadow py-2.5 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Instagram size={22} className="stroke-[2.5] text-black" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    href="https://www.facebook.com/profile.php?id=61565410511633"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-pop-cyan border-4 border-black pop-shadow py-2.5 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Facebook size={22} className="stroke-[2.5] text-black" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    href="tel:+393516758787"
                    className="bg-pop-green border-4 border-black pop-shadow py-2.5 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Phone size={22} className="stroke-[2.5] text-black" />
                  </motion.a>
                </div>
                <div className="text-center font-mono text-[10px] text-gray-500 mt-2">
                  Ti Puglio &copy; 2026 · Infernetto (Roma)
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
