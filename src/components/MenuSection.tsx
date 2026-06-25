import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RESTAURANT_MENU, APERITIVO_MENU, VINI_MENU } from "../data/menuData";
import { ALLERGENI, MenuItem } from "../types";
import { Info, HelpCircle } from "lucide-react";
import bgMenu from "../assets/images/bg_menu_1782382324254.jpg";

export default function MenuSection() {
  const [activeMenuType, setActiveMenuType] = useState<"ristorante" | "aperitivo" | "cantina">("ristorante");
  const [selectedCategory, setSelectedCategory] = useState<string>("spec");
  const [hoveredAllergen, setHoveredAllergen] = useState<number | null>(null);

  // Set default category when menu type changes
  const handleMenuTypeChange = (type: "ristorante" | "aperitivo" | "cantina") => {
    setActiveMenuType(type);
    if (type === "ristorante") setSelectedCategory("spec");
    else if (type === "aperitivo") setSelectedCategory("ap-latt");
    else setSelectedCategory("wine-calici");
  };

  const getActiveCategories = () => {
    if (activeMenuType === "ristorante") return RESTAURANT_MENU;
    if (activeMenuType === "aperitivo") return APERITIVO_MENU;
    return VINI_MENU;
  };

  const activeCategoryData = getActiveCategories().find(cat => cat.id === selectedCategory) || getActiveCategories()[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 20 }}
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start bg-cover bg-center"
      style={{ backgroundImage: `url(${bgMenu})` }}
    >
      {/* Pop Art Overlay */}
      <div className="absolute inset-0 bg-pop-cream/50 pointer-events-none select-none" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        {/* Dynamic Section Header */}
        <div className="text-center mb-10 relative">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: -2 }}
            className="bg-pop-pink text-white font-display text-4xl sm:text-5xl md:text-6xl px-8 py-3 border-4 border-black pop-shadow-lg inline-block uppercase tracking-wider"
          >
            IL NOSTRO MENÙ!
          </motion.div>
          <div className="bg-pop-yellow text-black border-4 border-black font-comic font-bold text-xs uppercase px-4 py-1.5 pop-shadow mt-4 inline-block rotate-[1deg]">
            Sapori Autentici della Valle d'Itria
          </div>
        </div>

        {/* Level 1 Menu Tabs (Ristorante, Aperitivo, Cantina) */}
        <div className="flex flex-wrap gap-3 justify-center mb-8 w-full max-w-lg">
          {(["ristorante", "aperitivo", "cantina"] as const).map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMenuTypeChange(type)}
              className={`flex-1 font-display text-lg tracking-wider py-2.5 px-6 border-3 border-black uppercase transition-colors pop-shadow-sm cursor-pointer ${
                activeTabStyle(type)
              }`}
            >
              {type === "ristorante" ? "Ristorante" : type === "aperitivo" ? "Aperitivo" : "Cantina & Bar"}
            </motion.button>
          ))}
        </div>

        {/* Level 2 Sub-Tabs (Specific Categories) */}
        <div className="flex flex-wrap gap-2 justify-content-center justify-center max-w-4xl mb-8">
          {RESTAURANT_MENU_NAV[activeMenuType].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`pop-border-sm px-3 py-1.5 font-comic text-xs font-semibold uppercase tracking-wider transition-all pop-shadow-sm hover:bg-pop-cyan hover:text-black cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-pop-dark text-white"
                  : "bg-white text-black"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Items Container */}
        <div className="bg-white border-4 border-black pop-shadow-lg w-full p-6 sm:p-8 md:p-10 relative">
          {/* Subtle Halftone Corner Decorations */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(#000000_15%,transparent_16%)] [background-size:10px_16px] opacity-15 pointer-events-none rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[radial-gradient(#000000_15%,transparent_16%)] [background-size:10px_16px] opacity-15 pointer-events-none rounded-bl-lg" />

          <h3 className="font-display text-2xl md:text-3xl text-pop-red border-b-4 border-black pb-2 mb-8 uppercase tracking-wide">
            {activeCategoryData?.name}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {activeCategoryData?.items.map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                key={item.name}
                className="flex flex-col border-b-2 border-dashed border-black/15 pb-4 last:border-b-0"
              >
                <div className="flex justify-between items-baseline gap-2">
                  <div className="font-comic font-bold text-base sm:text-lg flex flex-wrap items-center gap-1.5 text-black">
                    <span>{item.name}</span>
                    {/* Tags like piccante or subjective options */}
                    {item.tags?.map(tag => (
                      <span key={tag} className="text-sm font-normal bg-pop-yellow border-2 border-black px-1 py-0.5 rounded-none rotate-[-3deg] pop-shadow-sm font-mono leading-none">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="font-mono font-bold text-base md:text-lg text-pop-orange whitespace-nowrap">
                    {item.price}
                  </div>
                </div>

                {/* Optional wine description */}
                {item.description && (
                  <p className="font-comic text-xs text-gray-500 italic mt-1 leading-normal font-medium">
                    {item.description}
                  </p>
                )}

                {/* Allergen Interactive Tags */}
                {item.allergens && item.allergens.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 items-center relative">
                    <span className="font-mono text-[10px] uppercase font-bold text-gray-400">Allergeni:</span>
                    {item.allergens.map((algId) => {
                      const allergen = ALLERGENI[algId];
                      return (
                        <div
                          key={algId}
                          onMouseEnter={() => setHoveredAllergen(algId)}
                          onMouseLeave={() => setHoveredAllergen(null)}
                          onClick={() => setHoveredAllergen(hoveredAllergen === algId ? null : algId)}
                          className="relative inline-flex items-center gap-1 bg-pop-cream border-2 border-black px-1.5 py-0.5 text-xs font-bold cursor-help hover:bg-pop-pink transition-colors font-mono select-none"
                        >
                          <span>{allergen.emoji}</span>
                          <span>{algId}</span>

                          {/* Comic Book style Speech/Tooltip Bubble */}
                          <AnimatePresence>
                            {hoveredAllergen === algId && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-black border-2 border-black p-2.5 pop-shadow z-30 w-48 text-left rounded-none font-comic normal-case leading-relaxed"
                              >
                                <div className="font-bold flex items-center gap-1.5 text-xs text-pop-red mb-0.5 border-b border-black pb-0.5">
                                  <span>{allergen.emoji}</span>
                                  <span>{allergen.name}</span>
                                </div>
                                <div className="text-[10px] text-gray-700 font-semibold leading-snug">
                                  {allergen.description}
                                </div>
                                {/* Speech bubble tail */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-black" />
                                <div className="absolute top-[calc(full-1px)] left-1/2 -translate-x-1/2 w-0 h-0 border-l-7 border-l-transparent border-r-7 border-r-transparent border-t-7 border-t-white" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Footnotes */}
          <div className="border-t-4 border-black pt-4 mt-8 flex flex-col sm:flex-row justify-between items-center text-xs font-comic font-bold text-gray-600 gap-2">
            <div>* Disponibilità soggetta al momento · Coperto: € 1,50</div>
            <div className="bg-pop-yellow text-black border-2 border-black px-2 py-1 rotate-[-1deg] pop-shadow-sm uppercase text-[10px] font-mono">
              Clicca sugli allergeni per info!
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  function activeTabStyle(type: string) {
    if (activeMenuType === type) {
      if (type === "ristorante") return "bg-pop-yellow text-black";
      if (type === "aperitivo") return "bg-pop-pink text-black";
      return "bg-pop-cyan text-black";
    }
    return "bg-white text-black hover:bg-pop-cream";
  }
}

// Helpers for Sub-Tabs mapping
const RESTAURANT_MENU_NAV = {
  ristorante: [
    { id: "spec", name: "Specialità" },
    { id: "anti", name: "Antipasti" },
    { id: "prim", name: "Primi" },
    { id: "carn", name: "Carne" },
    { id: "bomb", name: "Bombette" },
    { id: "cont", name: "Contorni" },
    { id: "salu", name: "Salumi" },
    { id: "tara", name: "Taralli" },
    { id: "dolc", name: "Dolci" },
    { id: "amar", name: "Amari" }
  ],
  aperitivo: [
    { id: "ap-latt", name: "Latticini" },
    { id: "ap-tagl", name: "Taglieri" },
    { id: "ap-affe", name: "Affettati" },
    { id: "ap-sfiz", name: "Sfizi di Puglia" },
    { id: "ap-fris", name: "Friselle" },
    { id: "ap-maia", name: "Maialino Nero" }
  ],
  cantina: [
    { id: "wine-calici", name: "Al Calice" },
    { id: "wine-bottiglie", name: "In Bottiglia" },
    { id: "wine-cocktails", name: "Cocktails" },
    { id: "wine-soft", name: "Soft & Birre" }
  ]
};
