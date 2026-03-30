"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function WhatsAppWidget() {
  const phoneNumber = "529991525583";
  const message = "Hola! Me gustaría recibir más información sobre las carreras de la Universidad Latino.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 2 }}
      className="fixed bottom-6 left-6 z-[9999]"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center gap-3"
      >
        <div className="absolute left-full ml-3 bg-white px-4 py-2 rounded-xl shadow-xl text-[#111827] text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-100">
          ¿Tienes dudas? ¡Escríbenos!
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 border-8 border-transparent border-r-white" />
        </div>
        
        <div className="bg-[#25D366] p-3 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/58874ed2-ae97-440c-b760-db483a0ae966/pngwing.com-1768209178560.png?width=8000&height=8000&resize=contain"
            alt="WhatsApp"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
        </div>
      </a>
    </motion.div>
  );
}
