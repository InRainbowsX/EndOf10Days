import React from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Lock, Building2, Fingerprint } from 'lucide-react';

export const WorldviewHall: React.FC = () => {
  return (
    <div className="space-y-32 py-12">
      <header className="relative space-y-4">
        <div className="font-label text-oxblood tracking-[0.4em] text-xs inline-block bg-oxblood/10 px-2 py-1">COSMO-001: LAYERS</div>
        <h1 className="text-6xl md:text-8xl font-headline font-black text-carbon leading-tight ink-bleed uppercase">
          世界观馆<br/><span className="text-carbon/30 text-4xl md:text-5xl italic font-normal">WORLDVIEW HALL</span>
        </h1>
        <p className="text-carbon/70 text-xl max-w-2xl leading-relaxed mt-8 font-body border-l-2 border-oxblood/30 pl-4">
          欢迎来到归档中心。这里封存着“十日终焉”世界的最核心构造。在破旧的牛皮纸与墨迹之下，隐藏着生存的真谛与终焉的倒计时。
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-3 sticky top-32 space-y-8">
          <div className="space-y-2 border-l-2 border-oxblood pl-4">
            <h2 className="font-headline text-2xl font-bold">三层境界</h2>
            <p className="font-label text-[10px] uppercase text-oxblood/60">REF: LVL_ARCHIVE_03</p>
          </div>
          <nav className="flex flex-col gap-4 font-headline text-lg">
            <a className="group flex items-center gap-2 text-oxblood" href="#rules">
              <span className="w-8 h-px bg-oxblood"></span> 规则层
            </a>
            <a className="group flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity text-carbon" href="#structure">
              <span className="w-4 h-px bg-carbon/20 group-hover:w-8 transition-all"></span> 结构层
            </a>
            <a className="group flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity text-carbon" href="#truth">
              <span className="w-4 h-px bg-carbon/20 group-hover:w-8 transition-all"></span> 真相层
            </a>
          </nav>
        </div>

        <div className="lg:col-span-9 space-y-24">
          {/* Rule Layer */}
          <div className="relative bg-paper p-8 md:p-12 shadow-xl space-y-8 parchment-texture" id="rules">
            <div className="absolute top-0 right-0 p-4 font-label text-[10px] text-oxblood/40">METADATA-X1</div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 space-y-4">
                <h3 className="font-headline text-3xl font-black text-oxblood italic">规则层 <span className="text-sm font-normal not-italic block text-carbon/40">The Rule Layer</span></h3>
                <p className="text-carbon/70 leading-relaxed">
                  万物皆有规。在这里，每一场博弈，每一个“回响”，都被严格限制在既定的法律框架内。这不是游戏，这是生存的协议。
                </p>
                <div className="pt-4 border-t border-dashed border-oxblood/20 space-y-3">
                  <div className="flex justify-between font-label text-xs"><span>PROTOCOL: ECHO_RESONANCE</span><span className="text-oxblood">ACTIVE</span></div>
                  <div className="flex justify-between font-label text-xs"><span>CONSTRAINT: TEN_DAY_LIMIT</span><span className="text-oxblood">LOCKED</span></div>
                </div>
              </div>
              <div className="md:w-1/2 bg-paper-dark p-6 border border-oxblood/10 relative group overflow-hidden">
                <img className="w-full h-auto grayscale opacity-80 group-hover:grayscale-0 transition-all duration-700" src="https://picsum.photos/seed/diagram/600/600?grayscale" alt="Diagram" />
                <div className="mt-4 font-label text-[10px] text-oxblood/60 text-center uppercase tracking-tighter italic">Rule Architecture Diagram Rev. 04</div>
              </div>
            </div>
          </div>

          {/* Truth Layer */}
          <div className="relative bg-paper border-2 border-dashed border-oxblood/30 p-8 md:p-16 space-y-12" id="truth">
            <div className="text-center space-y-4">
              <h3 className="font-headline text-4xl font-black text-carbon">真相层</h3>
              <div className="font-label text-xs tracking-widest text-oxblood italic uppercase">Core Truth Progress: 34%</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white shadow-lg border border-oxblood/20 rotate-1 flex flex-col justify-between aspect-square">
                <div className="space-y-2">
                  <Eye className="w-6 h-6 text-oxblood" />
                  <h4 className="font-headline text-lg text-carbon">第零日</h4>
                  <p className="text-xs text-carbon/70">一切开始之前的虚无。那是被遗忘的第零场实验。</p>
                </div>
                <button className="w-full py-2 bg-oxblood text-white font-label text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity">Access Node</button>
              </div>
              <div className="p-6 bg-paper-dark shadow-lg -rotate-1 flex flex-col justify-between aspect-square relative overflow-hidden">
                <div className="space-y-2">
                  <EyeOff className="w-6 h-6 text-carbon/40" />
                  <h4 className="font-headline text-lg text-carbon">众神的意图</h4>
                  <p className="text-xs text-carbon/70">
                    那些在高处俯瞰的<span className="redacted">存在者们</span>，其真正的目的并非单纯的博弈，而是为了<span className="redacted">最终的重塑</span>。
                  </p>
                </div>
                <div className="absolute top-2 right-2 text-[10px] font-label text-blood rotate-45 border border-blood px-1">REDACTED</div>
              </div>
              <div className="p-6 bg-paper-dark border border-oxblood/10 flex flex-col items-center justify-center aspect-square gap-4 opacity-40">
                <Lock className="w-10 h-10 text-carbon" />
                <div className="text-[10px] font-label uppercase tracking-[0.3em] text-carbon">Locked by Chrono</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
