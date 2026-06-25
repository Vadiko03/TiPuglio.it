import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import SplashIntro from "./components/SplashIntro";
import HamburgerMenu from "./components/HamburgerMenu";
import MenuSection from "./components/MenuSection";
import ReviewsSection from "./components/ReviewsSection";
import DoveSiamoSection from "./components/DoveSiamoSection";
import ContattiSection from "./components/ContattiSection";
import logoTiPuglio from "./assets/images/logo_ti_puglio_1782382305178.jpg";

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentSection, setCurrentSection] = useState<string>("menu");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const renderActiveSection = () => {
    switch (currentSection) {
      case "menu":
        return <MenuSection key="menu" />;
      case "recensioni":
        return <ReviewsSection key="recensioni" />;
      case "dove-siamo":
        return <DoveSiamoSection key="dove-siamo" />;
      case "contatti":
        return <ContattiSection key="contatti" />;
      default:
        return <MenuSection key="menu" />;
    }
  };

  return (
    <div className="min-h-screen bg-pop-cream text-black font-sans relative overflow-x-hidden selection:bg-pop-pink selection:text-white">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.1,
              transition: { duration: 0.6, ease: "easeInOut" }
            }}
            className="fixed inset-0 z-50"
          >
            <SplashIntro onEnter={() => setShowSplash(false)} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen"
          >
            {/* Sticky Navigation Header with Pop Art Style */}
            <header className="sticky top-0 z-30 bg-white border-b-4 border-black pop-shadow-sm px-6 py-4 flex items-center justify-between">
              {/* Left spacer for the hamburger menu absolute button */}
              <div className="w-14 h-10" />

              {/* Centered Small Logo & Title */}
              <motion.div
                whileHover={{ scale: 1.03, rotate: -1 }}
                onClick={() => setCurrentSection("menu")}
                className="bg-white border-3 border-black pop-shadow px-3 sm:px-4 py-1.5 cursor-pointer flex items-center gap-1.5 sm:gap-2.5 rotate-[-1deg] select-none"
              >
                <img 
                  src={logoTiPuglio} 
                  alt="Ti Puglio Logo" 
                  className="h-8 sm:h-10 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="font-display text-lg sm:text-2xl tracking-wide text-black uppercase">
                  Ristorante Ti Puglio
                </span>
              </motion.div>

              {/* Right CTA for WhatsApp Booking */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentSection("contatti")}
                className="bg-pop-red text-white font-display text-sm tracking-wide uppercase px-4 py-2 border-3 border-black pop-shadow-sm cursor-pointer hover:bg-pop-orange transition-colors"
              >
                Prenota Tavolo!
              </motion.button>
            </header>

            {/* Left Drawer Hamburguer Menu */}
            <HamburgerMenu
              isOpen={isMenuOpen}
              onToggle={() => setIsMenuOpen(!isMenuOpen)}
              currentSection={currentSection}
              onNavigate={(section) => setCurrentSection(section)}
            />

            {/* Active Section Content with Transition */}
            <main className="flex-1 w-full relative">
              <AnimatePresence mode="wait">
                {renderActiveSection()}
              </AnimatePresence>
            </main>

            {/* Sticky Floating Action Button (WhatsApp Quick Call) */}
            <div className="fixed bottom-6 right-6 z-40">
              <motion.a
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                href="https://wa.me/393516758787?text=Ciao!%20Vorrei%20prenotare%20un%20tavolo"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pop-green text-black border-4 border-black p-4 pop-shadow flex items-center justify-center hover:bg-pop-yellow transition-colors relative group"
                title="Prenota su WhatsApp!"
              >
                {/* Pop Art Speech Tooltip bubble */}
                <div className="absolute right-full mr-3 bg-white text-black border-2 border-black font-comic font-bold text-xs uppercase px-2.5 py-1.5 pop-shadow rounded-none opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity whitespace-nowrap rotate-[-2deg]">
                  Scrivici su WhatsApp!
                  {/* Speech bubble tail pointer */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-l-6 border-l-black" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-[calc(full-1px)] w-0 h-0 border-t-5 border-t-transparent border-b-5 border-b-transparent border-l-5 border-l-white" />
                </div>
                
                {/* Simple responsive SVG WhatsApp Icon */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
