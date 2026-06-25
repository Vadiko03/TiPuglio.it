import React from "react";
import { motion, AnimatePresence } from "motion/react";
import mascotteDonkey from "../assets/images/mascotte_donkey_1782382288881.jpg";
import logoTiPuglio from "../assets/images/logo_ti_puglio_1782382305178.jpg";

interface SplashIntroProps {
  onEnter: () => void;
}

export default function SplashIntro({ onEnter }: SplashIntroProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-pop-cream p-4 overflow-hidden relative">
      {/* Decorative Pop Art Background Elements */}
      <div className="absolute inset-0 opacity-15 pointer-events-none select-none">
        <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-pop-pink border-4 border-black pop-shadow" />
        <div className="absolute -bottom-20 -right-10 w-96 h-96 rounded-full bg-pop-cyan border-4 border-black pop-shadow" />
        <div className="absolute top-1/2 left-5/6 w-48 h-48 rounded-full bg-pop-yellow border-4 border-black pop-shadow" />
        {/* Halftone pattern grid */}
        <div className="w-full h-full bg-[radial-gradient(#000000_15%,transparent_16%)] [background-size:16px_16px]" />
      </div>

      <div className="relative flex flex-col items-center max-w-lg w-full text-center z-10">
        {/* Dynamic Comic Burst / Explosion behind the logo */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute -top-16 w-80 h-80 bg-pop-yellow border-4 border-black pop-shadow flex items-center justify-center pointer-events-none select-none"
          style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }}
        />

        {/* Mascot Entry */}
        <motion.div
          initial={{ y: 150, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 12, delay: 0.2 }}
          className="relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-white border-4 border-black pop-shadow overflow-hidden mb-6 group"
        >
          <img 
            src={mascotteDonkey} 
            alt="Mascotte Ciuchino" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transform transition-transform group-hover:scale-110 duration-200"
          />
        </motion.div>

        {/* Brand Logo Entry */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: -3 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
          className="bg-white border-4 border-black pop-shadow p-3 rotate-[-3deg] mb-6 max-w-sm"
        >
          <img 
            src={logoTiPuglio} 
            alt="Ti Puglio Logo" 
            referrerPolicy="no-referrer"
            className="h-20 md:h-24 w-auto object-contain mx-auto"
          />
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-pop-cyan text-black border-4 border-black px-4 py-2 font-display text-2xl md:text-3xl tracking-wide uppercase pop-shadow rotate-[2deg] mb-8"
        >
          Brace e Sapori di Puglia!
        </motion.div>

        {/* Interactive Enter Button */}
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.08, rotate: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="bg-pop-red text-white font-display text-3xl md:text-4xl py-4 px-12 border-4 border-black pop-shadow-lg cursor-pointer hover:bg-pop-orange transition-colors"
        >
          ENTRA NEL SITO!
        </motion.button>
      </div>
    </div>
  );
}
