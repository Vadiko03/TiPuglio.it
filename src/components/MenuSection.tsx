import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RESTAURANT_MENU, APERITIVO_MENU, VINI_MENU } from "../data/menuData";
import { ALLERGENI, MenuItem } from "../types";
import { 
  Key, 
  Edit3, 
  Check, 
  X, 
  RotateCcw, 
  Lock, 
  Unlock, 
  Search, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import bgMenu from "../assets/images/bg_menu_1782382324254.jpg";
import { 
  subscribeMenuData, 
  updateMenuPrice, 
  resetMenuPrice,
  toggleHideDish,
  addCustomDish,
  deleteCustomDish,
  MenuCustomization
} from "../lib/firebase";

const ALL_CATEGORIES = [
  // Ristorante
  { id: "spec", name: "Specialità Pugliesi", type: "ristorante" },
  { id: "anti", name: "Antipasti", type: "ristorante" },
  { id: "prim", name: "Primi", type: "ristorante" },
  { id: "carn", name: "Carne", type: "ristorante" },
  { id: "bomb", name: "Bombette", type: "ristorante" },
  { id: "cont", name: "Contorni", type: "ristorante" },
  { id: "salu", name: "Salumi", type: "ristorante" },
  { id: "tara", name: "Taralli", type: "ristorante" },
  { id: "dolc", name: "Dolci", type: "ristorante" },
  { id: "amar", name: "Amari & Caffè", type: "ristorante" },
  // Aperitivo
  { id: "ap-latt", name: "Latticini", type: "aperitivo" },
  { id: "ap-tagl", name: "Taglieri", type: "aperitivo" },
  { id: "ap-affe", name: "Affettati", type: "aperitivo" },
  { id: "ap-sfiz", name: "Sfizi di Puglia", type: "aperitivo" },
  { id: "ap-fris", name: "Friselle", type: "aperitivo" },
  { id: "ap-maia", name: "Maialino Nero", type: "aperitivo" },
  // Cantina
  { id: "wine-calici", name: "Vini al Calice", type: "cantina" },
  { id: "wine-bottiglie", name: "Vini in Bottiglia", type: "cantina" },
  { id: "wine-cocktails", name: "Cocktails", type: "cantina" },
  { id: "wine-soft", name: "Soft Drinks & Birre", type: "cantina" },
];

export default function MenuSection() {
  const [activeMenuType, setActiveMenuType] = useState<"ristorante" | "aperitivo" | "cantina">("ristorante");
  const [selectedCategory, setSelectedCategory] = useState<string>("spec");
  const [hoveredAllergen, setHoveredAllergen] = useState<number | null>(null);

  // Dynamic menu state from Firestore
  const [menuCustomization, setMenuCustomization] = useState<MenuCustomization>(() => {
    try {
      const saved = localStorage.getItem("tipuglio_menu_customization");
      return saved ? JSON.parse(saved) : { prices: {}, hiddenItems: [], customItems: [] };
    } catch {
      return { prices: {}, hiddenItems: [], customItems: [] };
    }
  });

  // Owner authentication state
  const [isOwnerMode, setIsOwnerMode] = useState<boolean>(() => {
    return localStorage.getItem("tipuglio_owner_logged") === "true";
  });
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [ownerPassword, setOwnerPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  // Secret activation clicks tracking
  const secretClicksRef = useRef<number>(0);
  const secretTimerRef = useRef<any>(null);

  // Inline price edit state
  const [editingItemName, setEditingItemName] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add new dish modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newDishName, setNewDishName] = useState<string>("");
  const [newDishPrice, setNewDishPrice] = useState<string>("");
  const [newDishCategory, setNewDishCategory] = useState<string>("spec");
  const [newDishDescription, setNewDishDescription] = useState<string>("");
  const [newDishTag, setNewDishTag] = useState<string>("");
  const [newDishAllergens, setNewDishAllergens] = useState<number[]>([]);

  // Full price & menu manager modal
  const [showFullManager, setShowFullManager] = useState<boolean>(false);
  const [managerSearch, setManagerSearch] = useState<string>("");
  const [managerTypeFilter, setManagerTypeFilter] = useState<"all" | "ristorante" | "aperitivo" | "cantina">("all");

  // Subscribe to real-time menu data from Firestore
  useEffect(() => {
    const unsubscribe = subscribeMenuData((data) => {
      setMenuCustomization(data);
      try {
        localStorage.setItem("tipuglio_menu_customization", JSON.stringify(data));
      } catch (err) {
        console.error("Local storage error:", err);
      }
    });
    return () => unsubscribe();
  }, []);

  // Check URL parameters or keyboard shortcut for discreet owner login
  useEffect(() => {
    // 1. Check URL parameters e.g. ?titolare=true, ?admin=true, or #titolare
    const params = new URLSearchParams(window.location.search);
    if (params.get("titolare") !== null || params.get("admin") !== null || window.location.hash === "#titolare") {
      setShowLoginModal(true);
    }

    // 2. Keyboard shortcut: Alt + T or Ctrl + Shift + P
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === "t") || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "p")) {
        e.preventDefault();
        setShowLoginModal(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Secret triple click on footer/subtle area to open modal discreetly
  const handleSecretTrigger = () => {
    secretClicksRef.current += 1;
    if (secretTimerRef.current) clearTimeout(secretTimerRef.current);
    
    if (secretClicksRef.current >= 3) {
      secretClicksRef.current = 0;
      setShowLoginModal(true);
      setLoginError("");
      setOwnerPassword("");
    } else {
      secretTimerRef.current = setTimeout(() => {
        secretClicksRef.current = 0;
      }, 1000);
    }
  };

  // Owner authentication handler
  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPwd = ownerPassword.trim().toUpperCase();
    if (
      cleanPwd === "TIPUGLIO" || 
      cleanPwd === "TIPUGLIO2026" || 
      cleanPwd === "PUGLIA2026"
    ) {
      setIsOwnerMode(true);
      localStorage.setItem("tipuglio_owner_logged", "true");
      setShowLoginModal(false);
      setOwnerPassword("");
      setLoginError("");
      showToast("Accesso Titolare attivo: puoi modificare prezzi, nascondere piatti o aggiungerne di nuovi.");
    } else {
      setLoginError("Password errata. Riprova.");
    }
  };

  const handleOwnerLogout = () => {
    setIsOwnerMode(false);
    localStorage.removeItem("tipuglio_owner_logged");
    setEditingItemName(null);
    showToast("Modalità titolare disattivata.");
  };

  // Helpers for prices & custom items
  const getItemPrice = (item: MenuItem): string => {
    if (menuCustomization.prices[item.name]) {
      return menuCustomization.prices[item.name];
    }
    return item.price;
  };

  const isPriceModified = (item: MenuItem): boolean => {
    return (
      menuCustomization.prices[item.name] !== undefined && 
      menuCustomization.prices[item.name] !== item.price
    );
  };

  const isDishHidden = (item: MenuItem): boolean => {
    return menuCustomization.hiddenItems.includes(item.name);
  };

  // Handle price update
  const handleSaveInlinePrice = async (itemName: string) => {
    if (!editingPriceValue.trim()) return;
    setIsSaving(true);
    const newPrice = editingPriceValue.trim();

    // Optimistic local update
    const updatedPrices = { ...menuCustomization.prices, [itemName]: newPrice };
    setMenuCustomization(prev => ({ ...prev, prices: updatedPrices }));

    const success = await updateMenuPrice(itemName, newPrice);
    setIsSaving(false);
    setEditingItemName(null);

    if (success) {
      showToast(`Prezzo di "${itemName}" salvato e visibile online!`);
    } else {
      showToast(`Prezzo salvato in locale.`);
    }
  };

  // Reset price to default
  const handleResetPrice = async (itemName: string) => {
    setIsSaving(true);
    const updatedPrices = { ...menuCustomization.prices };
    delete updatedPrices[itemName];
    setMenuCustomization(prev => ({ ...prev, prices: updatedPrices }));

    await resetMenuPrice(itemName);
    setIsSaving(false);
    setEditingItemName(null);
    showToast(`Prezzo originale ripristinato per "${itemName}".`);
  };

  // Toggle dish visibility (Togliere o rimettere piatti)
  const handleToggleHide = async (dishName: string) => {
    const willHide = !menuCustomization.hiddenItems.includes(dishName);
    let updatedHidden: string[];
    if (willHide) {
      updatedHidden = [...menuCustomization.hiddenItems, dishName];
      showToast(`"${dishName}" è ora NASCOSTO ai clienti online.`);
    } else {
      updatedHidden = menuCustomization.hiddenItems.filter(n => n !== dishName);
      showToast(`"${dishName}" è di nuovo VISIBILE sul menù!`);
    }

    setMenuCustomization(prev => ({ ...prev, hiddenItems: updatedHidden }));
    await toggleHideDish(dishName, willHide);
  };

  // Add new custom dish
  const handleAddDishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim() || !newDishPrice.trim()) return;

    setIsSaving(true);
    const newDish: MenuItem = {
      id: `custom_${Date.now()}`,
      name: newDishName.trim(),
      price: newDishPrice.trim(),
      categoryId: newDishCategory,
      description: newDishDescription.trim() || undefined,
      tags: newDishTag.trim() ? [newDishTag.trim()] : undefined,
      allergens: newDishAllergens.length > 0 ? newDishAllergens : undefined,
      isCustom: true
    };

    const updatedCustom = [...menuCustomization.customItems, newDish];
    setMenuCustomization(prev => ({ ...prev, customItems: updatedCustom }));

    await addCustomDish(newDish);
    setIsSaving(false);
    setShowAddModal(false);

    // Reset form
    setNewDishName("");
    setNewDishPrice("");
    setNewDishDescription("");
    setNewDishTag("");
    setNewDishAllergens([]);

    showToast(`"${newDish.name}" aggiunto con successo al menù!`);
  };

  // Delete custom dish
  const handleDeleteCustomDish = async (dishName: string) => {
    if (!window.confirm(`Sei sicuro di voler eliminare definitivamente il piatto "${dishName}"?`)) {
      return;
    }
    const updatedCustom = menuCustomization.customItems.filter(i => i.name !== dishName);
    setMenuCustomization(prev => ({ ...prev, customItems: updatedCustom }));
    await deleteCustomDish(dishName);
    showToast(`"${dishName}" eliminato dal menù.`);
  };

  // Category navigation
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

  const activeCategoryBase = getActiveCategories().find(cat => cat.id === selectedCategory) || getActiveCategories()[0];

  // Combine base items with custom items belonging to this category
  const activeCategoryItems = [
    ...(activeCategoryBase?.items || []),
    ...menuCustomization.customItems.filter(item => item.categoryId === selectedCategory)
  ];

  // Filter items for regular customers (hide items in hiddenItems unless owner mode is on)
  const displayedItems = activeCategoryItems.filter(item => {
    if (isOwnerMode) return true; // Owner sees all, with indicators
    return !isDishHidden(item); // Customers don't see hidden items
  });

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

      {/* Real-time Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 z-50 bg-pop-yellow text-black border-4 border-black px-6 py-3 font-comic font-black text-sm uppercase pop-shadow-lg flex items-center gap-3 rotate-[-1deg]"
          >
            <Sparkles size={20} className="text-pop-red animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-8 relative">
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

        {/* ======================================================== */}
        {/* OWNER MODE ACTIVE TOOLBAR (ONLY VISIBLE ONCE LOGGED IN) */}
        {/* ======================================================== */}
        {isOwnerMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-pop-yellow border-4 border-black pop-shadow-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 rotate-[0.5deg]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pop-red border-2 border-black flex items-center justify-center pop-shadow-sm text-white font-black text-lg">
                👑
              </div>
              <div className="text-left">
                <div className="font-display text-base uppercase text-black flex items-center gap-2">
                  <span>GESTIONE TITOLARE ATTIVA</span>
                  <span className="text-[10px] bg-white border border-black px-1.5 py-0.5 font-mono font-bold">
                    ONLINE
                  </span>
                </div>
                <p className="font-comic text-xs text-gray-700 font-semibold">
                  Modifica prezzi con ✏️, nascondi piatti terminati con 👁️, o aggiungi nuovi piatti con ➕.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button
                onClick={() => {
                  setNewDishCategory(selectedCategory);
                  setShowAddModal(true);
                }}
                className="bg-pop-green text-black font-display text-xs uppercase px-3 py-2 border-3 border-black pop-shadow-sm hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={15} className="stroke-[3]" />
                <span>Aggiungi Piatto</span>
              </button>
              <button
                onClick={() => setShowFullManager(true)}
                className="bg-pop-cyan text-black font-display text-xs uppercase px-3 py-2 border-3 border-black pop-shadow-sm hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal size={14} />
                <span>Gestore Completo</span>
              </button>
              <button
                onClick={handleOwnerLogout}
                className="bg-pop-red text-white font-display text-xs uppercase px-3 py-2 border-3 border-black pop-shadow-sm hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Lock size={14} />
                <span>Esci</span>
              </button>
            </div>
          </motion.div>
        )}

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

          <div className="flex justify-between items-center border-b-4 border-black pb-2 mb-8 flex-wrap gap-3">
            <h3 className="font-display text-2xl md:text-3xl text-pop-red uppercase tracking-wide">
              {activeCategoryBase?.name}
            </h3>

            {isOwnerMode && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setNewDishCategory(selectedCategory);
                    setShowAddModal(true);
                  }}
                  className="bg-pop-green text-black font-comic font-black text-xs border-2 border-black px-2.5 py-1 pop-shadow-sm uppercase hover:bg-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus size={13} className="stroke-[3]" />
                  <span>Aggiungi Piatto Qui</span>
                </button>
              </div>
            )}
          </div>

          {displayedItems.length === 0 ? (
            <div className="text-center py-12 font-comic text-gray-500 font-semibold text-sm">
              Nessun piatto disponibile in questa categoria al momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {displayedItems.map((item, idx) => {
                const currentPrice = getItemPrice(item);
                const isModified = isPriceModified(item);
                const isHidden = isDishHidden(item);
                const isCurrentlyEditing = editingItemName === item.name;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    key={item.name}
                    className={`flex flex-col border-b-2 border-dashed border-black/15 pb-4 last:border-b-0 transition-all ${
                      isHidden 
                        ? "opacity-60 bg-gray-100 p-2.5 border-2 border-dashed border-gray-400" 
                        : isCurrentlyEditing 
                          ? "bg-pop-yellow/15 p-2 border-2 border-black pop-shadow-sm" 
                          : ""
                    }`}
                  >
                    <div className="flex justify-between items-baseline gap-2 flex-wrap sm:flex-nowrap">
                      {/* Item Name & Badges */}
                      <div className="font-comic font-bold text-base sm:text-lg flex flex-wrap items-center gap-1.5 text-black">
                        <span className={isHidden ? "line-through text-gray-500" : ""}>{item.name}</span>
                        
                        {item.tags?.map(tag => (
                          <span key={tag} className="text-sm font-normal bg-pop-yellow border-2 border-black px-1 py-0.5 rounded-none rotate-[-3deg] pop-shadow-sm font-mono leading-none">
                            {tag}
                          </span>
                        ))}

                        {item.isCustom && (
                          <span className="text-[9px] bg-pop-pink text-white font-mono font-bold px-1.5 py-0.5 border border-black uppercase">
                            Nuovo
                          </span>
                        )}

                        {isModified && (
                          <span className="text-[9px] bg-pop-cyan text-black font-mono font-bold px-1.5 py-0.5 border border-black uppercase">
                            Prezzo Aggiornato
                          </span>
                        )}

                        {isOwnerMode && isHidden && (
                          <span className="text-[9px] bg-gray-600 text-white font-mono font-bold px-1.5 py-0.5 uppercase">
                            Nascosto ai Clienti
                          </span>
                        )}
                      </div>

                      {/* Price & Owner Controls */}
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        {isCurrentlyEditing ? (
                          <div className="flex items-center gap-1 font-mono">
                            <input
                              type="text"
                              value={editingPriceValue}
                              onChange={(e) => setEditingPriceValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveInlinePrice(item.name);
                                if (e.key === "Escape") setEditingItemName(null);
                              }}
                              className="bg-white border-2 border-black px-2 py-0.5 text-sm font-bold text-pop-red w-28 text-right outline-none focus:ring-2 focus:ring-pop-orange"
                              placeholder="€ ..."
                              autoFocus
                              disabled={isSaving}
                            />
                            <button
                              onClick={() => handleSaveInlinePrice(item.name)}
                              disabled={isSaving}
                              className="bg-pop-green text-black border-2 border-black p-1 hover:bg-green-400 transition-colors cursor-pointer"
                              title="Salva Prezzo"
                            >
                              <Check size={14} className="stroke-[3]" />
                            </button>
                            {isModified && (
                              <button
                                onClick={() => handleResetPrice(item.name)}
                                disabled={isSaving}
                                className="bg-pop-yellow text-black border-2 border-black p-1 hover:bg-yellow-300 transition-colors cursor-pointer"
                                title="Ripristina prezzo originale"
                              >
                                <RotateCcw size={14} className="stroke-[3]" />
                              </button>
                            )}
                            <button
                              onClick={() => setEditingItemName(null)}
                              disabled={isSaving}
                              className="bg-pop-pink text-black border-2 border-black p-1 hover:bg-red-400 transition-colors cursor-pointer"
                              title="Annulla"
                            >
                              <X size={14} className="stroke-[3]" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-base md:text-lg text-pop-orange whitespace-nowrap">
                              {currentPrice}
                            </span>

                            {/* Owner Controls */}
                            {isOwnerMode && (
                              <div className="flex items-center gap-1">
                                {/* Edit Price */}
                                <button
                                  onClick={() => {
                                    setEditingItemName(item.name);
                                    setEditingPriceValue(getItemPrice(item));
                                  }}
                                  className="bg-pop-yellow text-black border-2 border-black p-1 hover:bg-pop-cyan transition-colors cursor-pointer pop-shadow-sm"
                                  title="Modifica Prezzo"
                                >
                                  <Edit3 size={12} className="stroke-[2.5]" />
                                </button>

                                {/* Toggle Hide/Show */}
                                <button
                                  onClick={() => handleToggleHide(item.name)}
                                  className={`border-2 border-black p-1 transition-colors cursor-pointer pop-shadow-sm ${
                                    isHidden 
                                      ? "bg-gray-400 text-black hover:bg-pop-green" 
                                      : "bg-white text-black hover:bg-gray-200"
                                  }`}
                                  title={isHidden ? "Rendi di nuovo visibile ai clienti" : "Nascondi questo piatto dal menù (esaurito/terminato)"}
                                >
                                  {isHidden ? <EyeOff size={12} className="text-pop-red" /> : <Eye size={12} />}
                                </button>

                                {/* Delete if custom */}
                                {item.isCustom && (
                                  <button
                                    onClick={() => handleDeleteCustomDish(item.name)}
                                    className="bg-pop-red text-white border-2 border-black p-1 hover:bg-black transition-colors cursor-pointer pop-shadow-sm"
                                    title="Elimina definitivamente questo piatto aggiunto"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Optional description */}
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
                          if (!allergen) return null;
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

                              {/* Tooltip Bubble */}
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
                );
              })}
            </div>
          )}

          {/* Footnotes & Secret Trigger in footer */}
          <div className="border-t-4 border-black pt-4 mt-8 flex flex-col sm:flex-row justify-between items-center text-xs font-comic font-bold text-gray-600 gap-2">
            <div>* Disponibilità soggetta al momento · Coperto: € 1,50</div>
            
            {/* Discreet secret trigger: 3 rapid clicks on this subtle copyright note triggers owner modal */}
            <div 
              onClick={handleSecretTrigger}
              className="cursor-pointer select-none text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
              title=""
            >
              © Ti Puglio Ristorante · Cucina Tipica
            </div>

            <div className="bg-pop-yellow text-black border-2 border-black px-2 py-1 rotate-[-1deg] pop-shadow-sm uppercase text-[10px] font-mono">
              Clicca sugli allergeni per info!
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: OWNER PASSWORD AUTH MODAL                        */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-black cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white border-4 border-black p-6 w-full max-w-sm pop-shadow-lg relative select-none z-10"
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-2 right-3 text-black font-display text-xl font-bold hover:scale-110 transition-transform cursor-pointer"
              >
                ✕
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-pop-yellow border-3 border-black pop-shadow-sm flex items-center justify-center mb-4">
                  <Key size={28} className="text-black" />
                </div>
                
                <h3 className="font-display text-xl uppercase text-black mb-1">ACCESSO RISERVATO TITOLARE</h3>
                <p className="font-comic text-xs text-gray-600 font-semibold mb-4 leading-normal">
                  Inserisci la parola d'ordine del titolare per gestire piatti e prezzi del menù.
                </p>

                <form onSubmit={handleOwnerLogin} className="w-full flex flex-col gap-3 font-comic">
                  <input
                    type="password"
                    required
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    placeholder="Parola d'ordine"
                    className="bg-pop-cream border-3 border-black p-2.5 font-bold outline-none text-center focus:bg-white text-base tracking-widest uppercase"
                    autoFocus
                  />

                  {loginError && (
                    <p className="text-pop-red font-bold text-[11px] uppercase tracking-wide">
                      ⚠️ {loginError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="bg-pop-cyan text-black font-display font-bold uppercase py-2.5 px-4 border-3 border-black pop-shadow-sm hover:bg-pop-yellow transition-colors cursor-pointer text-sm"
                  >
                    ENTRA NEL GESTORE
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 2: ADD NEW DISH (AGGIUNGI PIATTO)                   */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white border-4 border-black p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto pop-shadow-lg relative select-none z-10"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-2 right-3 text-black font-display text-xl font-bold hover:scale-110 transition-transform cursor-pointer"
              >
                ✕
              </button>

              <div className="text-left font-comic">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🍽️</span>
                  <h3 className="font-display text-2xl uppercase text-black">
                    Aggiungi Nuovo Piatto
                  </h3>
                </div>
                <p className="text-xs text-gray-600 font-semibold mb-6">
                  Il nuovo piatto verrà salvato su Firestore e mostrato subito online a tutti i clienti.
                </p>

                <form onSubmit={handleAddDishSubmit} className="flex flex-col gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase font-mono">Nome Piatto *</label>
                    <input
                      type="text"
                      required
                      value={newDishName}
                      onChange={(e) => setNewDishName(e.target.value)}
                      placeholder="Esempio: Orecchiette con Cime di Rapa e Acciughe"
                      className="bg-pop-cream border-2 border-black p-2 text-sm font-bold outline-none focus:bg-white"
                    />
                  </div>

                  {/* Price & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold uppercase font-mono">Prezzo *</label>
                      <input
                        type="text"
                        required
                        value={newDishPrice}
                        onChange={(e) => setNewDishPrice(e.target.value)}
                        placeholder="Esempio: € 13 oppure € 6 | € 12"
                        className="bg-pop-cream border-2 border-black p-2 text-sm font-bold outline-none focus:bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold uppercase font-mono">Categoria *</label>
                      <select
                        value={newDishCategory}
                        onChange={(e) => setNewDishCategory(e.target.value)}
                        className="bg-pop-cream border-2 border-black p-2 text-sm font-bold outline-none focus:bg-white"
                      >
                        {ALL_CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} ({cat.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Optional Description */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase font-mono">Descrizione o Ingredienti (Opzionale)</label>
                    <textarea
                      rows={2}
                      value={newDishDescription}
                      onChange={(e) => setNewDishDescription(e.target.value)}
                      placeholder="Esempio: Pasta fresca di semola, cime di rapa fresche ripassate e filetti di acciughe del Cantabrico"
                      className="bg-pop-cream border-2 border-black p-2 text-xs font-medium outline-none focus:bg-white"
                    />
                  </div>

                  {/* Optional Tag */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase font-mono">Tag o Etichetta Speciale (Opzionale)</label>
                    <input
                      type="text"
                      value={newDishTag}
                      onChange={(e) => setNewDishTag(e.target.value)}
                      placeholder="Esempio: 🌶️ oppure Novità oppure * (fuori menù)"
                      className="bg-pop-cream border-2 border-black p-2 text-xs font-bold outline-none focus:bg-white"
                    />
                  </div>

                  {/* Allergen Checkboxes */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-dashed border-gray-300">
                    <label className="text-xs font-bold uppercase font-mono">Allergeni Presenti</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 bg-gray-50 border border-gray-300">
                      {Object.values(ALLERGENI).map(alg => {
                        const isChecked = newDishAllergens.includes(alg.id);
                        return (
                          <label key={alg.id} className="flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewDishAllergens([...newDishAllergens, alg.id]);
                                } else {
                                  setNewDishAllergens(newDishAllergens.filter(id => id !== alg.id));
                                }
                              }}
                            />
                            <span>{alg.emoji} {alg.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 border-2 border-black font-display text-xs uppercase hover:bg-gray-100"
                    >
                      Annulla
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-pop-green text-black px-6 py-2 border-2 border-black pop-shadow-sm font-display text-xs uppercase hover:bg-green-400"
                    >
                      {isSaving ? "Salvataggio..." : "Salva e Pubblica Piatto"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 3: FULL MENU & PRICE MANAGER (GESTORE COMPLETO)     */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showFullManager && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFullManager(false)}
              className="absolute inset-0 bg-black cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border-4 border-black p-4 sm:p-6 w-full max-w-4xl max-h-[92vh] flex flex-col pop-shadow-lg relative select-none z-10"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b-3 border-black pb-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📋</span>
                    <h3 className="font-display text-xl sm:text-2xl uppercase text-black">
                      Gestore Completo Menù & Listino
                    </h3>
                  </div>
                  <p className="font-comic text-xs text-gray-600 font-semibold mt-0.5">
                    Modifica prezzi, nascondi piatti esauriti, o rimuovi creazioni. Ogni operazione è subito live online.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setNewDishCategory(selectedCategory);
                      setShowAddModal(true);
                    }}
                    className="bg-pop-green text-black font-display text-xs uppercase px-3 py-1.5 border-2 border-black pop-shadow-sm hover:bg-white flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} className="stroke-[3]" />
                    <span>Nuovo Piatto</span>
                  </button>

                  <button
                    onClick={() => setShowFullManager(false)}
                    className="text-black font-display text-2xl font-bold hover:scale-110 transition-transform cursor-pointer ml-2"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4 font-comic">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={managerSearch}
                    onChange={(e) => setManagerSearch(e.target.value)}
                    placeholder="Cerca piatto (es: Bombetta, Burrata, Primitivo...)"
                    className="w-full bg-pop-cream border-2 border-black pl-9 pr-3 py-2 text-xs font-bold outline-none focus:bg-white"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {(["all", "ristorante", "aperitivo", "cantina"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setManagerTypeFilter(cat)}
                      className={`px-3 py-1.5 text-xs font-bold border-2 border-black whitespace-nowrap uppercase cursor-pointer transition-colors ${
                        managerTypeFilter === cat
                          ? "bg-pop-dark text-white"
                          : "bg-white text-black hover:bg-pop-yellow"
                      }`}
                    >
                      {cat === "all" ? "Tutti" : cat === "ristorante" ? "Ristorante" : cat === "aperitivo" ? "Aperitivo" : "Cantina"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flattened items list */}
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 font-comic">
                {(() => {
                  const allItems: { item: MenuItem; categoryName: string; menuType: "ristorante" | "aperitivo" | "cantina" }[] = [];
                  
                  // Base items
                  RESTAURANT_MENU.forEach(c => c.items.forEach(i => allItems.push({ item: i, categoryName: c.name, menuType: "ristorante" })));
                  APERITIVO_MENU.forEach(c => c.items.forEach(i => allItems.push({ item: i, categoryName: c.name, menuType: "aperitivo" })));
                  VINI_MENU.forEach(c => c.items.forEach(i => allItems.push({ item: i, categoryName: c.name, menuType: "cantina" })));
                  
                  // Custom items
                  menuCustomization.customItems.forEach(i => {
                    const foundCat = ALL_CATEGORIES.find(c => c.id === i.categoryId);
                    allItems.push({
                      item: i,
                      categoryName: foundCat ? foundCat.name : "Personalizzato",
                      menuType: (foundCat?.type as any) || "ristorante"
                    });
                  });

                  const filtered = allItems.filter(entry => {
                    if (managerTypeFilter !== "all" && entry.menuType !== managerTypeFilter) return false;
                    if (!managerSearch.trim()) return true;
                    const q = managerSearch.toLowerCase();
                    return (
                      entry.item.name.toLowerCase().includes(q) || 
                      entry.categoryName.toLowerCase().includes(q) ||
                      (entry.item.description && entry.item.description.toLowerCase().includes(q))
                    );
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-12 text-gray-500 font-bold text-sm">
                        Nessun piatto trovato.
                      </div>
                    );
                  }

                  return filtered.map(({ item, categoryName }) => {
                    const currentPrice = getItemPrice(item);
                    const isModified = isPriceModified(item);
                    const isHidden = isDishHidden(item);
                    const isCurrentlyEditing = editingItemName === item.name;

                    return (
                      <div
                        key={item.name}
                        className={`border-2 border-black p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${
                          isHidden 
                            ? "bg-gray-100 opacity-60 border-dashed" 
                            : isModified 
                              ? "bg-pop-yellow/20" 
                              : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div className="text-left flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-bold text-sm text-black ${isHidden ? "line-through text-gray-500" : ""}`}>
                              {item.name}
                            </span>
                            <span className="text-[10px] bg-gray-200 border border-black/40 px-1.5 py-0.2 font-mono uppercase">
                              {categoryName}
                            </span>
                            {item.isCustom && (
                              <span className="text-[9px] bg-pop-pink text-white font-mono font-bold px-1.5 py-0.2 border border-black uppercase">
                                Creato
                              </span>
                            )}
                            {isModified && (
                              <span className="text-[9px] bg-pop-orange text-white font-mono font-bold px-1.5 py-0.2 border border-black uppercase">
                                Prezzo Modificato
                              </span>
                            )}
                            {isHidden && (
                              <span className="text-[9px] bg-gray-600 text-white font-mono font-bold px-1.5 py-0.2 uppercase">
                                Nascosto
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-[11px] text-gray-500 italic mt-0.5 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {isCurrentlyEditing ? (
                            <div className="flex items-center gap-1 font-mono">
                              <input
                                type="text"
                                value={editingPriceValue}
                                onChange={(e) => setEditingPriceValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveInlinePrice(item.name);
                                  if (e.key === "Escape") setEditingItemName(null);
                                }}
                                className="bg-white border-2 border-black px-2 py-1 text-xs font-bold text-pop-red w-28 text-right outline-none"
                                placeholder="€ ..."
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveInlinePrice(item.name)}
                                className="bg-pop-green text-black border-2 border-black p-1 hover:bg-green-400"
                                title="Salva Prezzo"
                              >
                                <Check size={14} className="stroke-[3]" />
                              </button>
                              {isModified && (
                                <button
                                  onClick={() => handleResetPrice(item.name)}
                                  className="bg-pop-yellow text-black border-2 border-black p-1 hover:bg-yellow-300"
                                  title="Ripristina prezzo originale"
                                >
                                  <RotateCcw size={14} className="stroke-[3]" />
                                </button>
                              )}
                              <button
                                onClick={() => setEditingItemName(null)}
                                className="bg-pop-pink text-black border-2 border-black p-1 hover:bg-red-400"
                                title="Annulla"
                              >
                                <X size={14} className="stroke-[3]" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-pop-orange">
                                {currentPrice}
                              </span>

                              <button
                                onClick={() => {
                                  setEditingItemName(item.name);
                                  setEditingPriceValue(getItemPrice(item));
                                }}
                                className="bg-pop-yellow text-black border-2 border-black px-2 py-1 text-xs font-display uppercase hover:bg-pop-cyan transition-colors flex items-center gap-1 cursor-pointer"
                                title="Modifica Prezzo"
                              >
                                <Edit3 size={11} />
                                <span>Prezzo</span>
                              </button>

                              {/* Toggle Hide */}
                              <button
                                onClick={() => handleToggleHide(item.name)}
                                className={`border-2 border-black px-2 py-1 text-xs font-display uppercase transition-colors cursor-pointer flex items-center gap-1 ${
                                  isHidden
                                    ? "bg-gray-300 text-black hover:bg-pop-green"
                                    : "bg-white text-black hover:bg-gray-100"
                                }`}
                                title={isHidden ? "Mostra sul sito" : "Nascondi dal sito"}
                              >
                                {isHidden ? <Eye size={11} /> : <EyeOff size={11} />}
                                <span>{isHidden ? "Mostra" : "Nascondi"}</span>
                              </button>

                              {/* Delete if custom */}
                              {item.isCustom && (
                                <button
                                  onClick={() => handleDeleteCustomDish(item.name)}
                                  className="bg-pop-red text-white border-2 border-black p-1.5 hover:bg-black transition-colors cursor-pointer"
                                  title="Elimina Piatto"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Modal Footer */}
              <div className="mt-4 pt-3 border-t-2 border-black flex justify-between items-center text-xs font-comic font-bold text-gray-600">
                <span className="text-[11px]">
                  💡 Suggerimento: Per accedere direttamente a questo pannello puoi aggiungere <code className="bg-gray-100 px-1 border border-gray-300">?titolare=true</code> all'indirizzo del sito.
                </span>
                <button
                  onClick={() => setShowFullManager(false)}
                  className="bg-black text-white font-display text-xs uppercase px-4 py-2 border-2 border-black hover:bg-gray-800 cursor-pointer"
                >
                  Chiudi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
