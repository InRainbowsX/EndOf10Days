import React from 'react';
import { motion } from 'motion/react';
import { LogIn, Brain, Skull, History } from 'lucide-react';

export const EventHall: React.FC = () => {
  return (
    <div className="space-y-20 py-12">
      <section className="relative">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-oxblood/20 pb-8">
          <div className="space-y-2">
            <span className="font-label text-oxblood text-xs tracking-[0.3em] bg-oxblood/10 px-2 py-1">EVT-1024: G-TYPE</span>
            <h2 className="text-6xl md:text-7xl font-black font-headline text-carbon uppercase tracking-tighter italic ink-bleed">
              事件馆 <span className="text-carbon/30 block text-3xl mt-2">Event Hall</span>
            </h2>
          </div>
          <div className="flex flex-col items-end text-right space-y-1">
            <p className="font-label text-carbon/60 text-xs uppercase tracking-widest">Curatorial Metadata</p>
            <p className="font-label text-oxblood text-sm font-bold">REF: 10-24/X</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Event Identity */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white p-6 border border-oxblood/10 relative overflow-hidden group shadow-xl parchment-texture">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-oxblood/5 rotate-12 flex items-center justify-center border-2 border-oxblood/10">
              <span className="text-oxblood font-label text-4xl opacity-20 font-black">X</span>
            </div>
            <img 
              alt="Survival game arena" 
              className="w-full grayscale contrast-125 mb-6 border border-oxblood/10 opacity-90" 
              src="https://picsum.photos/seed/arena/600/800?grayscale"
            />
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-label text-[10px] text-oxblood/60 uppercase">Entry Code</p>
                  <p className="text-2xl font-headline font-bold text-carbon">G-1024 GAME</p>
                </div>
                <div className="w-16 h-16 border-4 border-blood/20 flex items-center justify-center rounded-full rotate-12 -mt-4">
                  <span className="font-label text-[10px] text-blood font-black uppercase text-center leading-none">STAGE<br/>LETHAL</span>
                </div>
              </div>
              <p className="font-body text-carbon/70 text-sm italic leading-relaxed border-l-2 border-oxblood/10 pl-4 py-1">
                "A game where the rules are written in blood, and the players are but pieces on an ancient board."
              </p>
            </div>
          </div>

          <div className="bg-paper-dark p-6 space-y-4 border border-oxblood/10">
            <h3 className="font-headline text-lg text-oxblood border-b border-oxblood/10 pb-2 uppercase tracking-widest">Participants</h3>
            <ul className="space-y-3">
              {['PLAYER_001 / Qi Xia', 'PLAYER_042 / Unknown', 'JUDGE_X / The Curator'].map((p, i) => (
                <li key={i} className="flex items-center justify-between group cursor-pointer">
                  <span className="font-label text-xs text-carbon/70 group-hover:text-oxblood transition-colors">{p}</span>
                  <span className="text-oxblood/40 group-hover:text-oxblood">→</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Rules & Process */}
        <div className="md:col-span-8 space-y-6">
          <div className="relative bg-paper-dark text-carbon p-10 pt-16 shadow-xl border border-black/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-10 -mt-4 bg-oxblood/10 border-x border-oxblood/20"></div>
            <div className="absolute top-6 right-8 text-carbon/10 font-label font-black text-4xl uppercase">TOP SECRET</div>
            <h3 className="font-headline text-3xl font-black mb-6 tracking-tighter underline decoration-2 underline-offset-8 decoration-oxblood/20">GAME RULES: 规则概要</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-body leading-relaxed">
              <div className="space-y-4">
                <p className="font-bold border-b border-black/10 pb-1">1. 第一准则 / FIRST PRINCIPLE:</p>
                <p className="text-sm border-l-2 border-oxblood/20 pl-4 italic">所有参与者必须在规定时间内完成节点连接，任何偏差将导致即时清算。</p>
              </div>
              <div className="space-y-4">
                <p className="font-bold border-b border-black/10 pb-1">2. 胜出条件 / WIN CONDITION:</p>
                <p className="text-sm border-l-2 border-oxblood/20 pl-4 italic">只有在谎言被揭穿后，真实的门扉才会开启。最后一名生还者获得“终焉”资格。</p>
              </div>
            </div>
          </div>

          <div className="bg-paper p-8 border border-oxblood/10 relative min-h-[400px] parchment-texture">
            <h3 className="font-headline text-lg text-oxblood mb-8 uppercase tracking-widest">Process Flow / 事件演化图</h3>
            <div className="flex justify-between items-center relative py-12">
              <div className="w-32 text-center group">
                <div className="w-16 h-16 bg-white border border-oxblood/40 flex items-center justify-center mx-auto mb-2 group-hover:rotate-45 transition-transform">
                  <LogIn className="w-6 h-6 text-oxblood" />
                </div>
                <span className="block font-label text-[10px] text-carbon/60">ENTRY: PHASE I</span>
                <span className="block font-headline text-xs">起始点</span>
              </div>
              <div className="w-48 text-center group -translate-y-10">
                <div className="w-20 h-20 bg-oxblood/10 border-2 border-oxblood/30 border-dashed flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Brain className="w-10 h-10 text-oxblood" />
                </div>
                <span className="block font-label text-[10px] text-oxblood font-bold">CORE: THE DECISION</span>
                <span className="block font-headline text-xs font-bold text-carbon">关键博弈节点</span>
                <p className="text-[9px] mt-2 italic text-carbon/60">Player A betrayed Player B at 04:22</p>
              </div>
              <div className="w-32 text-center group">
                <div className="w-16 h-16 bg-white border border-blood/40 flex items-center justify-center mx-auto mb-2 group-hover:rotate-12 transition-transform">
                  <Skull className="w-6 h-6 text-blood" />
                </div>
                <span className="block font-label text-[10px] text-carbon/60">TERMINUS: RESULTS</span>
                <span className="block font-headline text-xs">终结与清算</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
