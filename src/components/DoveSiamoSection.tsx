import React from "react";
import { motion } from "motion/react";
import { MapPin, Navigation, Car, Bus } from "lucide-react";
import bgPosition from "../assets/images/bg_dove_siamo_1782382355536.jpg";
import mascotteDonkey from "../assets/images/mascotte_donkey_1782382288881.jpg";

export default function DoveSiamoSection() {
  const directions = [
    {
      icon: <Car size={24} className="stroke-[3] text-white" />,
      title: "In Macchina",
      text: "Dalla Cristoforo Colombo, prendi l'uscita per l'Infernetto su Via Wolf Ferrari. Gira su Via Giambattista Bassani: ci trovi subito dentro il Centro Commerciale Colombia, con ampio parcheggio gratuito!",
      bgColor: "bg-pop-pink"
    },
    {
      icon: <Bus size={24} className="stroke-[3] text-white" />,
      title: "In Autobus",
      text: "Prendi la linea 06 o 065 e scendi alla fermata Wolf Ferrari/Colombo. Da lì sono solo 5 minuti a piedi percorrendo Via G. Bassani fino al Centro Commerciale Colombia.",
      bgColor: "bg-pop-cyan"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 20 }}
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start bg-cover bg-center"
      style={{ backgroundImage: `url(${bgPosition})` }}
    >
      {/* Pop Art Overlay */}
      <div className="absolute inset-0 bg-pop-cream/50 pointer-events-none select-none" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: -2 }}
            className="bg-pop-yellow text-black font-display text-4xl sm:text-5xl md:text-6xl px-8 py-3 border-4 border-black pop-shadow-lg inline-block uppercase tracking-wider"
          >
            DOVE CI TROVI!
          </motion.div>
          <div className="bg-pop-pink text-white border-4 border-black font-comic font-bold text-xs uppercase px-4 py-1.5 pop-shadow mt-4 inline-block rotate-[2deg]">
            Puglia nel Cuore dell'Infernetto, Roma
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-stretch">
          {/* Map Section (2 cols wide) */}
          <div className="lg:col-span-2 bg-white border-4 border-black pop-shadow-lg p-5 flex flex-col relative h-[500px]">
            <div className="absolute -top-4 -left-4 bg-pop-red text-white font-display text-lg uppercase px-3 py-1 border-3 border-black rotate-[-3deg] tracking-wide pop-shadow-sm z-20">
              MAPPA INTERATTIVA!
            </div>
            
            <div className="w-full h-full border-4 border-black bg-pop-cream overflow-hidden relative">
              <iframe
                title="Ti Puglio Location Map"
                src="https://maps.google.com/maps?q=Via%20Giambattista%20Bassani,%2013,%2000124%20Roma&t=&z=16&ie=UTF-8&iwloc=&output=embed"
                width="100%"
                height="100%"
                className="border-0 block"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Directions / Address Card (1 col wide) */}
          <div className="lg:col-span-1 flex flex-col gap-6 justify-between">
            {/* Address Comic Bubble Card */}
            <div className="bg-white border-4 border-black pop-shadow p-6 rotate-[1deg] relative">
              <div className="absolute -top-3 -right-3 bg-pop-green text-black font-display text-sm uppercase px-2 py-1 border-2 border-black rotate-[5deg] tracking-wide pop-shadow-sm">
                INDIRIZZO!
              </div>

              <div className="flex items-center gap-2 mb-4 border-b-2 border-dashed border-black/15 pb-2">
                <MapPin size={22} className="stroke-[3.5] text-pop-red" />
                <span className="font-comic font-bold text-lg text-black uppercase tracking-tight">Siamo Qui:</span>
              </div>

              <div className="font-comic font-semibold text-xs leading-relaxed text-gray-700 text-left">
                <p className="text-base font-bold text-black mb-1">Ti Puglio</p>
                <p>Via Giambattista Bassani, 13</p>
                <p>00124 Roma (RM)</p>
                <p className="mt-3 text-pop-orange font-bold font-mono text-[10px] uppercase">
                  Presso il Centro Commerciale Colombia
                </p>
              </div>

              {/* Quick Google Maps redirection button */}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.google.com/maps/dir/?api=1&destination=Via+Giambattista+Bassani+13,+00124+Roma"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-pop-cyan text-black border-3 border-black pop-shadow-sm py-2 mt-5 flex items-center justify-center gap-2 font-display text-base tracking-wide uppercase hover:bg-pop-yellow transition-colors select-none"
              >
                <Navigation size={16} className="stroke-[3.5]" />
                Come Arrivare
              </motion.a>
            </div>

            {/* Directions Cards */}
            <div className="flex flex-col gap-4">
              {directions.map((dir) => (
                <div key={dir.title} className="bg-white border-4 border-black pop-shadow p-4 text-left rotate-[-0.5deg]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`${dir.bgColor} p-1.5 border-2 border-black pop-shadow-sm flex items-center justify-center`}>
                      {dir.icon}
                    </div>
                    <h4 className="font-display text-lg uppercase text-black">{dir.title}</h4>
                  </div>
                  <p className="font-comic text-[11px] font-semibold text-gray-600 leading-normal">
                    {dir.text}
                  </p>
                </div>
              ))}
            </div>
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
            <div className="font-display text-2xl uppercase text-pop-pink mb-1 rotate-[1deg]">
              Ti Aspettiamo!
            </div>
            <p className="text-xs text-gray-700 font-semibold leading-relaxed">
              Il Centro Commerciale Colombia all'Infernetto è facilissimo da trovare e c'è sempre un sacco di parcheggio gratuito ad aspettarti. Se ti perdi, non esitare a chiamarci al nostro numero di telefono, faremo da faro per guidarti dritto alle nostre bombette!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
