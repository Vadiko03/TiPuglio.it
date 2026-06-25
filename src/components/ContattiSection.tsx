import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Calendar, Clock, Users, FileText, Send, CheckCircle2 } from "lucide-react";
import bgContacts from "../assets/images/bg_contatti_1782382371083.jpg";
import mascotteDonkey from "../assets/images/mascotte_donkey_1782382288881.jpg";

export default function ContattiSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("2");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !date || !time || !guests) return;

    // Formatting WhatsApp Message
    const formattedNotes = notes.trim() ? `%0A*Note:* ${encodeURIComponent(notes.trim())}` : "";
    const text = `Ciao! Vorrei prenotare un tavolo da *Ti Puglio*:%0A%0A*Nome:* ${encodeURIComponent(name.trim())}%0A*Telefono:* ${encodeURIComponent(phone.trim())}%0A*Data:* ${encodeURIComponent(date)}%0A*Ora:* ${encodeURIComponent(time)}%0A*Persone:* ${encodeURIComponent(guests)}${formattedNotes}`;
    
    const whatsappUrl = `https://wa.me/393516758787?text=${text}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank");
    setSubmitted(true);

    // Reset form after a small delay
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setPhone("");
      setDate("");
      setTime("");
      setGuests("2");
      setNotes("");
    }, 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 20 }}
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start bg-cover bg-center"
      style={{ backgroundImage: `url(${bgContacts})` }}
    >
      {/* Pop Art Overlay */}
      <div className="absolute inset-0 bg-pop-cream/50 pointer-events-none select-none" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: 15 }}
            animate={{ scale: 1, rotate: -1 }}
            className="bg-pop-pink text-white font-display text-4xl sm:text-5xl md:text-6xl px-8 py-3 border-4 border-black pop-shadow-lg inline-block uppercase tracking-wider"
          >
            PRENOTA UN TAVOLO!
          </motion.div>
          <div className="bg-pop-yellow text-black border-4 border-black font-comic font-bold text-xs uppercase px-4 py-1.5 pop-shadow mt-4 inline-block rotate-[1deg]">
            Rapida Prenotazione Diretta via WhatsApp
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full items-start">
          {/* Left instructions (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6 w-full text-left">
            <div className="bg-white border-4 border-black pop-shadow p-6 rotate-[-1deg] relative">
              <div className="absolute -top-3 -left-3 bg-pop-cyan text-black font-display text-sm uppercase px-2 py-1 border-2 border-black rotate-[-5deg] tracking-wide pop-shadow-sm">
                INFO PRENOTAZIONI!
              </div>

              <h4 className="font-display text-xl uppercase text-black mb-3 mt-1">Come Funziona?</h4>
              <p className="font-comic text-xs font-semibold text-gray-700 leading-relaxed mb-4">
                Compila il modulo rapido con i dettagli del tuo tavolo. Cliccando su <strong>INVIA SU WHATSAPP</strong>, il sistema preparerà un messaggio pre-compilato che potrai inviarci all'istante con un click. Ti risponderemo per confermare la prenotazione!
              </p>

              <div className="border-t-2 border-dashed border-black/15 pt-3 font-comic text-xs text-gray-600 font-bold flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-pop-red font-bold font-mono">TEL:</span>
                  <span>+39 351 675 8787</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pop-red font-bold font-mono">EMAIL:</span>
                  <span>info@tipuglio.it</span>
                </div>
              </div>
            </div>

            {/* Mascot Side Bubble */}
            <div className="bg-white border-4 border-black pop-shadow p-6 flex items-center gap-4 rotate-[1deg]">
              <img 
                src={mascotteDonkey} 
                alt="Ciuchino" 
                className="w-20 h-24 object-cover rounded-none flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="font-comic text-left">
                <div className="font-display text-xl uppercase text-pop-orange mb-1 rotate-[-2deg]">
                  Tavolo Pronto!
                </div>
                <p className="text-[11px] text-gray-600 font-semibold leading-relaxed">
                  Compila i campi qui a fianco e mandaci un messaggio su WhatsApp! Rispondiamo super in fretta così potrai goderti la tua brace o aperitivo senza pensieri!
                </p>
              </div>
            </div>
          </div>

          {/* Right Form (3 cols) */}
          <div className="lg:col-span-3 bg-white border-4 border-black pop-shadow-lg p-6 sm:p-8 relative w-full">
            <div className="absolute -top-4 -right-4 bg-pop-green text-black font-display text-lg uppercase px-3 py-1 border-3 border-black rotate-[3deg] tracking-wide pop-shadow-sm z-20">
              MODULO RAPIDO!
            </div>

            <h3 className="font-display text-2xl uppercase text-black mb-6">Dettagli del Tavolo</h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-comic text-left relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-pop-dark font-mono flex items-center gap-1.5">
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Esempio: Andrea Rossi"
                    className="bg-pop-cream border-3 border-black p-2.5 font-bold outline-none focus:bg-white text-sm"
                  />
                </div>

                {/* Telefono */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-pop-dark font-mono flex items-center gap-1.5">
                    <Phone size={12} className="stroke-[3.5]" /> Telefono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Esempio: 345 678 9012"
                    className="bg-pop-cream border-3 border-black p-2.5 font-bold outline-none focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Data */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-pop-dark font-mono flex items-center gap-1.5">
                    <Calendar size={12} className="stroke-[3.5]" /> Data *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-pop-cream border-3 border-black p-2.5 font-bold outline-none focus:bg-white text-sm"
                  />
                </div>

                {/* Ora */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-pop-dark font-mono flex items-center gap-1.5">
                    <Clock size={12} className="stroke-[3.5]" /> Ora *
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-pop-cream border-3 border-black p-2.5 font-bold outline-none focus:bg-white text-sm"
                  />
                </div>

                {/* Numero Persone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-pop-dark font-mono flex items-center gap-1.5">
                    <Users size={12} className="stroke-[3.5]" /> Persone *
                  </label>
                  <select
                    required
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="bg-pop-cream border-3 border-black p-2.5 font-bold outline-none text-sm appearance-none cursor-pointer focus:bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Persona" : "Persone"}
                      </option>
                    ))}
                    <option value="11+">Più di 10 (Specificare)</option>
                  </select>
                </div>
              </div>

              {/* Note Speciali */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-pop-dark font-mono flex items-center gap-1.5">
                  <FileText size={12} className="stroke-[3.5]" /> Richieste speciali / Allergie
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Intolleranze, allergie, preferenze tavoli all'aperto..."
                  className="bg-pop-cream border-3 border-black p-2.5 font-bold outline-none focus:bg-white text-sm resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pop-red text-white font-display text-2xl py-3 px-8 border-4 border-black pop-shadow-sm cursor-pointer hover:bg-pop-orange transition-colors flex items-center justify-center gap-3 mt-4"
              >
                <Send size={20} className="stroke-[3.5]" />
                <span>PRENOTA VIA WHATSAPP!</span>
              </motion.button>
            </form>

            {/* Success Animation Banner */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute inset-0 bg-pop-green text-black border-4 border-black p-6 flex flex-col items-center justify-center text-center z-20"
                >
                  <CheckCircle2 size={56} className="stroke-[3.5] text-black mb-3" />
                  <div className="font-display text-3xl uppercase mb-1">INVIATO!</div>
                  <div className="font-comic text-sm font-bold leading-normal max-w-sm">
                    Ti abbiamo reindirizzato a WhatsApp per inviare il tuo messaggio di prenotazione pre-compilato. Ti risponderemo subito!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
