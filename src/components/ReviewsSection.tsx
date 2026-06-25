import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Review, fetchReviews, submitReview, approveReview, deleteReview } from "../lib/firebase";
import { Star, MessageSquare, Send, CheckCircle2, User, Clock, Shield, Lock, Unlock, LogOut, Key } from "lucide-react";
import bgReviews from "../assets/images/bg_recensioni_1782382341314.jpg";
import mascotteDonkey from "../assets/images/mascotte_donkey_1782382288881.jpg";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  
  // Track user-submitted review IDs to show them as "in moderation" specifically to this visitor
  const [userSubmittedIds, setUserSubmittedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("tipuglio_user_reviews") || "[]");
    } catch {
      return [];
    }
  });
  
  // Store the rating of the last submitted review to customize the confirmation message
  const [lastSubmittedRating, setLastSubmittedRating] = useState<number>(5);

  // Form State
  const [name, setName] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState<string>("");
  const [meta, setMeta] = useState<string>("Cliente");

  // Staff moderation states
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem("tipuglio_admin_logged") === "true";
  });
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [adminError, setAdminError] = useState<string>("");
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "tipuglio2026" || adminPassword === "puglia2026") {
      setIsAdminMode(true);
      localStorage.setItem("tipuglio_admin_logged", "true");
      setShowAdminModal(false);
      setAdminPassword("");
      setAdminError("");
    } else {
      setAdminError("Password errata! Riprova.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminMode(false);
    localStorage.removeItem("tipuglio_admin_logged");
  };

  const handleApprove = async (id: string) => {
    const successResult = await approveReview(id);
    if (successResult) {
      loadReviews();
    }
  };

  const handleDelete = async (id: string) => {
    const successResult = await deleteReview(id);
    if (successResult) {
      loadReviews();
    }
  };

  const loadReviews = async () => {
    setLoading(true);
    const data = await fetchReviews();
    setReviews(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setSubmitting(true);
    const reviewId = await submitReview({
      name: name.trim(),
      rating,
      text: text.trim(),
      meta: meta.trim() || "Cliente",
      date: "Oggi",
    });

    setSubmitting(false);
    if (reviewId) {
      // Save ID to state and localStorage to identify own reviews
      const updatedIds = [...userSubmittedIds, reviewId];
      setUserSubmittedIds(updatedIds);
      localStorage.setItem("tipuglio_user_reviews", JSON.stringify(updatedIds));
      
      setLastSubmittedRating(rating);
      setSuccess(true);
      setName("");
      setText("");
      setRating(5);
      setMeta("Cliente");
      // Reload reviews
      loadReviews();
      setTimeout(() => setSuccess(false), 5500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 20 }}
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start bg-cover bg-center"
      style={{ backgroundImage: `url(${bgReviews})` }}
    >
      {/* Pop Art Overlay */}
      <div className="absolute inset-0 bg-pop-cream/50 pointer-events-none select-none" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: 15 }}
            animate={{ scale: 1, rotate: 1 }}
            className="bg-pop-pink text-white font-display text-4xl sm:text-5xl md:text-6xl px-8 py-3 border-4 border-black pop-shadow-lg inline-block uppercase tracking-wider"
          >
            LA VOCE DEGLI OSPITI!
          </motion.div>
          <div className="bg-pop-yellow text-black border-4 border-black font-comic font-bold text-xs uppercase px-4 py-1.5 pop-shadow mt-4 inline-block rotate-[-1deg]">
            Recensioni Vere in Tempo Reale
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-start">
          {/* Form to leave a review (Pop Art Speech Card) */}
          <div className="lg:col-span-1 bg-white border-4 border-black pop-shadow-lg p-6 relative lg:sticky lg:top-24">
            <div className="absolute -top-4 -left-4 bg-pop-cyan text-black font-display text-lg uppercase px-3 py-1 border-3 border-black rotate-[-4deg] tracking-wide pop-shadow-sm">
              SCRIVI ORA!
            </div>

            <h3 className="font-display text-xl uppercase text-black mb-4 mt-2">Lascia un Segno</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-comic">
              {/* Name */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold uppercase text-pop-dark font-mono">Nome o Nickname *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Esempio: Marco P."
                  className="bg-pop-cream border-3 border-black p-2.5 font-bold outline-none focus:bg-white text-sm"
                />
              </div>

              {/* Meta / Tag */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold uppercase text-pop-dark font-mono">Chi sei? (Opzionale)</label>
                <select
                  value={meta}
                  onChange={(e) => setMeta(e.target.value)}
                  className="bg-pop-cream border-3 border-black p-2.5 font-bold outline-none text-sm appearance-none cursor-pointer focus:bg-white"
                >
                  <option value="Cliente">Cliente</option>
                  <option value="Local Guide">Local Guide</option>
                  <option value="Pugliese d.o.c.">Pugliese d.o.c.</option>
                  <option value="Buongustaio">Buongustaio</option>
                  <option value="Ospite fisso">Ospite fisso</option>
                </select>
              </div>

              {/* Rating Star Selection */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold uppercase text-pop-dark font-mono">Valutazione</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      type="button"
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(star)}
                      className="cursor-pointer"
                    >
                      <Star
                        size={28}
                        className={`stroke-[3.5] ${
                          star <= rating
                            ? "fill-pop-yellow text-black"
                            : "text-gray-300"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold uppercase text-pop-dark font-mono">La tua recensione *</label>
                <textarea
                  required
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Com'era la focaccia? E le bombette? Raccontacelo qui!"
                  className="bg-pop-cream border-3 border-black p-2.5 font-bold outline-none focus:bg-white text-sm resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pop-red text-white font-display text-xl py-3 px-6 border-4 border-black pop-shadow-sm cursor-pointer hover:bg-pop-orange transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {submitting ? (
                  "Invio in corso..."
                ) : (
                  <>
                    <Send size={18} className="stroke-[3.5]" />
                    <span>PUBBLICA!</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Success Message Banner */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className={`absolute inset-0 border-4 border-black p-6 flex flex-col items-center justify-center text-center z-20 ${
                    lastSubmittedRating >= 4 ? "bg-pop-green text-black" : "bg-pop-yellow text-black"
                  }`}
                >
                  {lastSubmittedRating >= 4 ? (
                    <>
                      <CheckCircle2 size={48} className="stroke-[3.5] text-black mb-3" />
                      <div className="font-display text-2xl uppercase mb-1">Grazie Mille!</div>
                      <div className="font-comic text-xs font-bold leading-normal">
                        La tua recensione positiva è stata approvata dall'algoritmo di analisi sentiment e pubblicata immediatamente! 🚀
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-white rounded-full border-3 border-black flex items-center justify-center pop-shadow-sm mb-3">
                        <Shield size={32} className="stroke-[3] text-pop-red animate-pulse" />
                      </div>
                      <div className="font-display text-xl uppercase mb-1 text-black">REGISTRAZIONE COMPLETATA!</div>
                      <div className="font-comic text-xs font-bold leading-normal text-black px-2">
                        Grazie per il feedback! L'analisi sentiment del sito ha rilevato una recensione critica. Per garantire la qualità del servizio ed evitare spam, la tua recensione è stata presa in carico dal nostro staff ed è attualmente in fase di moderazione.
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Feed List of Reviews */}
          <div className="lg:col-span-2 flex flex-col gap-6 w-full max-h-[800px] overflow-y-auto pr-2">
            {loading ? (
              // Comic Book style loader
              <div className="flex flex-col items-center justify-center py-16 bg-white border-4 border-black pop-shadow-lg">
                <div className="w-10 h-10 border-4 border-pop-orange border-t-black animate-spin rounded-none mb-3" />
                <span className="font-display text-xl uppercase tracking-wider text-black">Caricamento in corso...</span>
              </div>
            ) : (() => {
              // Client-side automated sentiment filter:
              // Hide reviews <= 3 stars from general public, but keep them visible only for the specific client who wrote them (so they see it as "In attesa di moderazione").
              // In Admin Mode, keep all visible for staff review.
              const filteredReviews = reviews.filter((rev) => {
                if (isAdminMode) return true;
                if (rev.rating >= 4) return true;
                if (rev.approved === true) return true;
                if (rev.id && userSubmittedIds.includes(rev.id)) return true;
                return false;
              });

              if (filteredReviews.length === 0) {
                return (
                  <div className="bg-white border-4 border-black pop-shadow-lg p-8 text-center font-comic font-bold text-gray-500">
                    {isAdminMode 
                      ? "Nessuna recensione presente nel database."
                      : "Ancora nessuna recensione approvata. Sii il primo a scriverne una positiva!"
                    }
                  </div>
                );
              }

              return filteredReviews.map((rev) => {
                const isUnderModeration = rev.rating <= 3 && !rev.approved;

                return (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={rev.id}
                    className={`bg-white border-4 border-black pop-shadow p-6 flex flex-col sm:flex-row gap-4 items-start relative select-none ${
                      isUnderModeration ? "border-pop-yellow bg-amber-50/20" : ""
                    }`}
                  >
                    {/* Decorative Speech bubble pointer for comic book feel */}
                    <div className="hidden sm:block absolute top-8 -left-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black" />
                    <div className="hidden sm:block absolute top-[33px] -left-[11px] w-0 h-0 border-t-7 border-t-transparent border-b-7 border-b-transparent border-r-7 border-r-white" />

                    {/* Rating Badge */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-pop-cyan border-3 border-black pop-shadow-sm flex items-center justify-center text-black mb-2 select-none">
                        <User size={24} className="stroke-[3]" />
                      </div>
                      <div className="bg-pop-yellow font-mono text-[9px] uppercase font-bold border-2 border-black px-1.5 py-0.5 rounded-none rotate-[-4deg] text-black">
                        {rev.meta}
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="flex-1 text-left w-full">
                      {isUnderModeration && !isAdminMode && (
                        <div className="mb-2 bg-pop-yellow/30 border-2 border-dashed border-black/40 p-2 flex items-center gap-2 select-none rotate-[-0.5deg]">
                          <Clock size={14} className="text-black animate-pulse flex-shrink-0" />
                          <span className="font-comic font-bold text-[9px] text-black uppercase tracking-wider">
                            🛡️ IN MODERAZIONE DELLO STAFF (Visibile solo a te)
                          </span>
                        </div>
                      )}

                      {isAdminMode && (
                        <div className="mb-2 flex flex-wrap gap-2 items-center">
                          {isUnderModeration ? (
                            <span className="bg-pop-red text-white border-2 border-black px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-none rotate-[-1deg] inline-flex items-center gap-1">
                              <Shield size={10} /> 🔴 IN MODERAZIONE
                            </span>
                          ) : (
                            <span className="bg-pop-green text-black border-2 border-black px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-none rotate-[1deg] inline-flex items-center gap-1">
                              <CheckCircle2 size={10} /> 🟢 VISIBILE AL PUBBLICO
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap justify-between items-baseline gap-2 mb-2 border-b-2 border-dashed border-black/10 pb-1">
                        <h4 className="font-comic font-bold text-base text-black">{rev.name}</h4>
                        <span className="font-mono text-[10px] text-gray-400 font-semibold">{rev.date}</span>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`stroke-[3.5] ${
                              i < rev.rating
                                ? "fill-pop-yellow text-black"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="font-comic text-xs font-semibold text-gray-700 leading-relaxed italic">
                        &ldquo;{rev.text}&rdquo;
                      </p>

                      {/* Admin Controls Block */}
                      {isAdminMode && rev.id && (
                        <div className="mt-4 pt-3 border-t-2 border-dashed border-black/15 flex flex-wrap gap-2 items-center justify-end select-none font-display">
                          {isUnderModeration && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleApprove(rev.id!)}
                              className="bg-pop-green text-black border-2 border-black px-3 py-1 text-[9px] uppercase font-bold tracking-wider pop-shadow-sm hover:bg-green-400 transition-colors cursor-pointer"
                            >
                              Approvato 🟢
                            </motion.button>
                          )}
                          
                          {confirmingDeleteId === rev.id ? (
                            <div className="flex items-center gap-1.5 bg-pop-red/10 border-2 border-pop-red p-1.5 text-xs">
                              <span className="font-comic font-bold text-[9px] text-pop-red uppercase">Eliminare definitivamente?</span>
                              <button
                                onClick={() => {
                                  handleDelete(rev.id!);
                                  setConfirmingDeleteId(null);
                                }}
                                className="bg-pop-red text-white px-2 py-0.5 font-bold uppercase text-[9px] border border-black cursor-pointer"
                              >
                                SI
                              </button>
                              <button
                                onClick={() => setConfirmingDeleteId(null)}
                                className="bg-white text-black px-2 py-0.5 font-bold uppercase text-[9px] border border-black cursor-pointer"
                              >
                                NO
                              </button>
                            </div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setConfirmingDeleteId(rev.id!)}
                              className="bg-pop-red text-white border-2 border-black px-3 py-1 text-[9px] uppercase font-bold tracking-wider pop-shadow-sm hover:bg-red-600 transition-colors cursor-pointer"
                            >
                              Elimina 🔴
                            </motion.button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              });
            })()}
          </div>
        </div>

        {/* Mascot Talk Bubble Banner at bottom */}
        <div className="mt-16 bg-white border-4 border-black pop-shadow-lg p-6 flex flex-col md:flex-row items-center gap-6 max-w-3xl w-full relative">
          <img 
            src={mascotteDonkey} 
            alt="Ciuchino" 
            className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-3 border-black pop-shadow-sm flex-shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="text-left font-comic leading-relaxed flex-1">
            <div className="font-display text-2xl uppercase text-pop-orange mb-1 rotate-[-1deg]">
              Il Tuo Parere Conta!
            </div>
            <p className="text-xs text-gray-700 font-semibold leading-relaxed">
              Il nostro simpatico ciuchino Ti Puglio non vede l'ora di leggere la tua recensione! Condividi la tua esperienza culinaria con la nostra cucina alla brace, i latticini o l'aperitivo e aiuta gli altri ospiti a conoscerci.
            </p>
          </div>
        </div>

        {/* Admin Login/Logout controls */}
        <div className="mt-8 flex justify-center items-center select-none font-display">
          {isAdminMode ? (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-pop-green text-black border-3 border-black pop-shadow-sm px-4 py-2 font-display text-sm uppercase font-bold tracking-wider rotate-[0.5deg] flex items-center gap-2">
                <Unlock size={16} /> Modalità Staff Attiva
              </div>
              <button
                onClick={handleAdminLogout}
                className="text-xs uppercase font-bold text-pop-red hover:underline flex items-center gap-1 cursor-pointer mt-1"
              >
                <LogOut size={12} /> Disconnetti Staff
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdminModal(true)}
              className="text-black/60 hover:text-black hover:bg-black/5 border-2 border-dashed border-black/25 px-4 py-1.5 font-mono text-xs uppercase font-semibold flex items-center gap-1.5 cursor-pointer rounded-none transition-colors"
            >
              <Lock size={12} /> Accedi Area Staff
            </button>
          )}
        </div>

        {/* Modal for Admin Password */}
        <AnimatePresence>
          {showAdminModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white border-4 border-black p-6 w-full max-w-sm pop-shadow-lg relative select-none"
              >
                <button
                  onClick={() => {
                    setShowAdminModal(false);
                    setAdminPassword("");
                    setAdminError("");
                  }}
                  className="absolute top-2 right-3 text-black font-display text-xl font-bold hover:scale-110 transition-transform cursor-pointer"
                >
                  ✕
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-pop-pink border-3 border-black pop-shadow-sm flex items-center justify-center mb-4">
                    <Key size={24} className="text-white" />
                  </div>
                  
                  <h3 className="font-display text-lg uppercase text-black mb-1">ACCESSO STAFF</h3>
                  <p className="font-comic text-xs text-gray-500 font-semibold mb-4 leading-normal">
                    Inserisci la password dello staff per gestire e moderare le recensioni.
                  </p>

                  <form onSubmit={handleAdminLogin} className="w-full flex flex-col gap-3 font-comic">
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Password dello staff"
                      className="bg-pop-cream border-3 border-black p-2.5 font-bold outline-none text-center focus:bg-white text-sm"
                      autoFocus
                    />

                    {adminError && (
                      <p className="text-pop-red font-bold text-[10px] uppercase tracking-wide animate-bounce">
                        ⚠️ {adminError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="bg-pop-cyan text-black font-display font-bold uppercase py-2.5 px-4 border-3 border-black pop-shadow-sm hover:bg-pop-yellow transition-colors cursor-pointer text-sm"
                    >
                      ACCEDI
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
