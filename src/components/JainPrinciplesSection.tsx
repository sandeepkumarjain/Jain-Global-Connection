import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Scale,
  Compass,
  Gift,
  Award,
  BookOpen,
  CheckCircle2,
  Lock,
  Users,
  ChevronRight,
  Info
} from 'lucide-react';

interface Principle {
  id: string;
  name: string;
  sanskrit: string;
  transliteration: string;
  english: string;
  icon: React.ElementType;
  gradient: string;
  borderHover: string;
  badgeColor: string;
  accentText: string;
  summary: string;
  description: string;
  digitalApplication: string;
  quote: string;
}

export const JainPrinciplesSection: React.FC = () => {
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>('ahimsa');
  const [showModal, setShowModal] = useState<boolean>(false);

  const principles: Principle[] = [
    {
      id: 'ahimsa',
      name: 'Ahimsa',
      sanskrit: 'अहिंसा',
      transliteration: 'Ahiṁsā',
      english: 'Non-Violence & Compassion',
      icon: HeartHandshake,
      gradient: 'from-rose-500/20 via-rose-500/10 to-transparent',
      borderHover: 'hover:border-rose-500/80 hover:shadow-rose-500/20',
      badgeColor: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      accentText: 'text-rose-400',
      summary: 'Reverence & love for all living beings in thought, speech & action.',
      description: 'Ahimsa is the supreme vow in Jainism. It requires absolute harmlessness toward all living creatures—human, animal, plant, and microscopic life—in mind, words, and bodily deeds.',
      digitalApplication: 'Zero hate speech, verified authentic family profiles, respectful communication, and ethical community moderation.',
      quote: 'Parasparopagraho Jivanam — All life is bound together by mutual support and interdependence.'
    },
    {
      id: 'satya',
      name: 'Satya',
      sanskrit: 'सत्य',
      transliteration: 'Satya',
      english: 'Truthfulness & Integrity',
      icon: Sparkles,
      gradient: 'from-amber-500/20 via-amber-500/10 to-transparent',
      borderHover: 'hover:border-amber-500/80 hover:shadow-amber-500/20',
      badgeColor: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      accentText: 'text-amber-400',
      summary: 'Living with absolute honesty, truthfulness, and transparency.',
      description: 'Satya means speaking truthful, beneficial, and gentle words without malice, falsehood, or deception in any commercial, social, or spiritual endeavor.',
      digitalApplication: 'GST-verified business listings, authentic matrimonial biodatas, strict profile verification, and zero fake reviews.',
      quote: 'Truth alone triumphs when guided by wisdom, humility, and goodwill.'
    },
    {
      id: 'asteya',
      name: 'Asteya',
      sanskrit: 'अस्तेय',
      transliteration: 'Asteya',
      english: 'Non-Stealing & Fairness',
      icon: Scale,
      gradient: 'from-sky-500/20 via-sky-500/10 to-transparent',
      borderHover: 'hover:border-sky-500/80 hover:shadow-sky-500/20',
      badgeColor: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
      accentText: 'text-sky-400',
      summary: 'Respecting others’ rights, intellectual property, and privacy.',
      description: 'Asteya is the virtue of refraining from taking anything that has not been freely given, including another’s wealth, labor, time, ideas, or personal data.',
      digitalApplication: 'End-to-end data privacy, explicit user consent for contact access, transparent membership terms, and data ownership protection.',
      quote: 'Fair exchange and sacred respect for others’ rights build enduring global trusts.'
    },
    {
      id: 'brahmacharya',
      name: 'Brahmacharya',
      sanskrit: 'ब्रह्मचर्य',
      transliteration: 'Brahmacarya',
      english: 'Chastity & Moral Purity',
      icon: Compass,
      gradient: 'from-violet-500/20 via-violet-500/10 to-transparent',
      borderHover: 'hover:border-violet-500/80 hover:shadow-violet-500/20',
      badgeColor: 'bg-violet-500/15 border-violet-500/30 text-violet-400',
      accentText: 'text-violet-400',
      summary: 'Self-control, marital fidelity, and spiritual mindfulness.',
      description: 'Brahmacharya directs human consciousness toward inner purity, moral boundary preservation, and devotion to spiritual growth over sensual distractions.',
      digitalApplication: 'Dignified matrimonial matches with strict family consent options, clean family-friendly social feed, and respectful networking.',
      quote: 'Self-discipline elevates human character and unlocks profound spiritual tranquility.'
    },
    {
      id: 'aparigraha',
      name: 'Aparigraha',
      sanskrit: 'अपरिग्रह',
      transliteration: 'Aparigraha',
      english: 'Non-Possessiveness & Generosity',
      icon: Gift,
      gradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
      borderHover: 'hover:border-emerald-500/80 hover:shadow-emerald-500/20',
      badgeColor: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      accentText: 'text-emerald-400',
      summary: 'Detachment from greed and sharing resources for public welfare.',
      description: 'Aparigraha teaches contentment, limiting personal possessiveness, and practicing Danam (charity/philanthropy) to uplift humanity and alleviate suffering.',
      digitalApplication: 'Free emergency blood donation platform, non-profit community seva tools, free digital Jain Panchang & Bhajan directory.',
      quote: 'True richness lies not in hoarding material wealth, but in selfless sharing and contentment.'
    }
  ];

  const active = principles.find(p => p.id === selectedPrinciple) || principles[0];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/5 via-orange-50/40 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 rounded-3xl p-6 sm:p-10 border border-amber-200/80 dark:border-slate-800 shadow-xl space-y-8 my-8">
      {/* Background Decorative Gold Watermark/Radial Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center space-y-3 max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-100/80 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-700/60 rounded-full text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-widest shadow-xs">
          <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
          <span>Ethical & Secure Digital Ecosystem</span>
        </div>

        <h3 className="text-2xl sm:text-4xl font-black font-serif tracking-tight text-slate-900 dark:text-white">
          Guided by Five Eternal Jain Principles
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
          Every algorithm, verification badge, and community interaction on Jain Connect Global is anchored in the eternal wisdom of the <span className="text-amber-800 dark:text-amber-300 font-bold">Pancha Mahavratas</span>.
        </p>
      </motion.div>

      {/* Interactive 5 Principles Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {principles.map((item, index) => {
          const Icon = item.icon;
          const isSelected = selectedPrinciple === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              onClick={() => {
                setSelectedPrinciple(item.id);
                setShowModal(true);
              }}
              className={`relative group overflow-hidden bg-white dark:bg-slate-900 border rounded-2xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-md ${
                isSelected
                  ? 'border-amber-500 dark:border-amber-500 bg-amber-50/60 dark:bg-slate-800 ring-2 ring-amber-400/30 scale-[1.02]'
                  : 'border-amber-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-slate-700 hover:bg-amber-50/40 dark:hover:bg-slate-850 hover:-translate-y-1'
              }`}
            >
              {/* Subtle top glow bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient}`} />

              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${item.badgeColor} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 group-hover:text-amber-800 dark:group-hover:text-amber-300">
                    {item.sanskrit}
                  </span>
                </div>

                {/* Names */}
                <div className="space-y-0.5">
                  <h4 className="text-base font-extrabold font-serif text-slate-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors flex items-center justify-between">
                    <span>{item.name}</span>
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {item.transliteration}
                  </p>
                  <p className={`text-xs font-bold ${item.accentText} mt-1`}>
                    {item.english}
                  </p>
                </div>

                {/* Summary */}
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {/* Bottom Digital Badge */}
              <div className="mt-4 pt-3 border-t border-amber-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Platform Application</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Principle Highlight Box */}
      <div className="relative z-10 bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${active.badgeColor}`}>
              <active.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white">
                  {active.name} ({active.sanskrit})
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${active.badgeColor}`}>
                  {active.english}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                Pancha Mahavrata Pillar #{principles.findIndex(p => p.id === active.id) + 1}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="self-start sm:self-auto px-4 py-2 bg-amber-50 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 border border-amber-200/80 dark:border-slate-700 text-amber-900 dark:text-amber-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Read Scriptural Context</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-slate-800 space-y-1.5">
            <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Spiritual Philosophy & Vow</span>
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {active.description}
            </p>
          </div>

          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 dark:border-slate-800 space-y-1.5">
            <p className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Digital Governance in Jain Connect Global</span>
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {active.digitalApplication}
            </p>
          </div>
        </div>

        {/* Scriptural Motto Footer */}
        <div className="bg-amber-100/60 dark:bg-amber-950/40 border border-amber-200 dark:border-slate-800 p-3 rounded-xl text-center">
          <p className="text-xs font-semibold text-amber-950 dark:text-amber-200 italic">
            "{active.quote}"
          </p>
        </div>
      </div>

      {/* Scriptural Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-amber-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl border ${active.badgeColor}`}>
                  <active.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                    {active.name} — {active.english}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Ancient Jain Scriptures & Modern Code
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-slate-800 text-amber-950 dark:text-amber-200 font-serif text-sm">
                "{active.quote}"
              </p>
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white mb-1">Core Spiritual Meaning:</h5>
                <p className="text-slate-600 dark:text-slate-300">{active.description}</p>
              </div>
              <div>
                <h5 className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">Implementation in Platform Architecture:</h5>
                <p className="text-slate-600 dark:text-slate-300">{active.digitalApplication}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Close Philosophy Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
