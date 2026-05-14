"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-slate-200 border-y border-slate-200">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex items-center justify-between w-full py-5 px-1 text-left hover:bg-slate-50 transition-colors group"
            >
              <span className="font-medium text-slate-900 pr-4">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="px-1 pb-5 text-slate-600 leading-relaxed">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const faqData: FAQItem[] = [
  {
    question: "¿Es legal en Perú?",
    answer: "Sí. Operamos bajo fideicomiso regulado por el Código Civil peruano. El activo está inscrito en SUNARP y el fideicomiso constituido ante notario público."
  },
  {
    question: "¿Qué pasa si PachaNova cierra?",
    answer: "El activo no nos pertenece. Pertenece al fideicomiso. Si PachaNova dejara de operar, los fideicomisarios continuarían administrando el activo en beneficio de los token-holders."
  },
  {
    question: "¿Puedo perder mi inversión?",
    answer: "Como toda inversión en activos reales, existe riesgo. El valor del inmueble puede subir o bajar. Los rendimientos son proyectados, no garantizados."
  },
  {
    question: "¿Qué es un token en este contexto?",
    answer: "Un registro digital que certifica tu participación en el fideicomiso. No es una criptomoneda especulativa: está respaldado por el valor del activo inmobiliario real."
  },
  {
    question: "¿Cómo funciona el mercado P2P?",
    answer: "Publicás una oferta con precio y cantidad. Otro inversor registrado compra directamente. PachaNova actúa como mediador técnico, no financiero."
  },
  {
    question: "¿Cuándo cobro rendimientos?",
    answer: "Las distribuciones se aprueban por quórum 2/3 del fideicomiso. La periodicidad estimada es semestral."
  },
  {
    question: "¿Cuánto tiempo tarda en verse el retorno?",
    answer: "El Proyecto San Bartolo tiene horizonte de valorización de 24-36 meses. Las distribuciones semestrales empiezan desde el cierre de la ronda Génesis."
  },
  {
    question: "¿Puedo invertir desde otro país?",
    answer: "Sí. PachaNova acepta inversores de toda Latinoamérica y España. El proceso KYC acepta documentos nacionales de cualquier país de la región. Todo online."
  },
  {
    question: "¿Qué pasa si quiero salir antes del plazo?",
    answer: "Podés listar tus tokens en el mercado P2P cuando quieras. El precio lo fijás vos. No hay penalización por salida anticipada."
  }
];
