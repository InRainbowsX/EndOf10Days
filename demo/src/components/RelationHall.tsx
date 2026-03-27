import React from 'react';
import { motion } from 'motion/react';
import { Network, Search, BookOpen, History, ExternalLink } from 'lucide-react';

export const RelationHall: React.FC = () => {
  return (
    <div className="space-y-20 py-12">
      <header className="mb-16 border-l-4 border-oxblood pl-6">
        <h1 className="font-headline text-5xl font-bold text-carbon mb-4 tracking-tight">關係館 (Relation Hall)</h1>
        <p className="font-body italic text-xl text-carbon/70 max-w-2xl leading-relaxed">
          「在这一场终局的游戏中，信任是奢侈品，而背叛则是生存的必然代价。」
        </p>
        <div className="mt-6 flex gap-4">
          <span className="bg-oxblood text-white font-label text-[10px] px-3 py-1 tracking-tighter uppercase">Subject: Interpersonal Entropy</span>
          <span className="bg-carbon text-white font-label text-[10px] px-3 py-1 tracking-tighter uppercase">Auth: Level 4 Required</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
        {['共谋', '背叛', '保护', '牺牲'].map((type, i) => (
          <div key={i} className="relative group cursor-crosshair">
            <div className="absolute -top-2 -left-2 bg-carbon text-white font-label text-[10px] px-1">REF_0{i+1}</div>
            <div className={`bg-white p-6 border-b-2 border-oxblood/30 transition-all hover:bg-oxblood/5 ${i === 1 ? 'opacity-60 grayscale' : ''}`}>
              <h3 className={`font-headline text-2xl mb-2 ${i === 1 ? 'text-blood' : ''}`}>{type}</h3>
              <p className="font-label text-[10px] text-oxblood/60 mb-4 uppercase">{['SEALED', 'VOIDED', 'SECURE', 'FINALIZED'][i]} / {['共存', '崩溃', '屏蔽', '终止'][i]}</p>
              <div className="h-[2px] w-full bg-oxblood/10"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="w-full lg:w-1/3 relative">
          <div className="absolute -top-4 -right-4 z-20 transform rotate-12 bg-blood text-white font-label text-xs py-1 px-4 border border-white/20 backdrop-blur-sm">
            RECOVERED
          </div>
          <img 
            alt="Portrait" 
            className="w-full grayscale contrast-125 border-b-8 border-oxblood shadow-2xl" 
            src="https://picsum.photos/seed/person/600/800?grayscale"
          />
          <div className="mt-4 p-4 bg-paper-dark border-l-2 border-carbon">
            <h4 className="font-headline font-bold text-lg">喬家勁 (Qiao Jiajing)</h4>
            <p className="font-label text-[10px] tracking-widest text-carbon/60 uppercase">SUBJECT ID: 092-B</p>
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div className="relative p-8 bg-white border border-oxblood/10 shadow-lg">
            <div className="absolute -top-6 -left-2 transform -rotate-2 bg-white/80 px-4 py-2 border border-oxblood/10 font-body text-sm italic">
              典型案例分析：共谋者 (Conspirators)
            </div>
            <div className="flex items-center gap-6 mt-4">
              <div className="text-right">
                <span className="block font-headline font-bold text-xl">齊夏</span>
                <span className="block font-label text-[10px] opacity-60">LEADER</span>
              </div>
              <div className="flex-1 relative h-[2px] bg-oxblood">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-oxblood text-white font-label text-[8px] px-2 py-1">
                  MUTUALISM
                </div>
              </div>
              <div className="text-left">
                <span className="block font-headline font-bold text-xl">喬家勁</span>
                <span className="block font-label text-[10px] opacity-60">ENFORCER</span>
              </div>
            </div>
            
            <div className="mt-12">
              <h5 className="font-label text-xs font-bold mb-4 flex items-center gap-2">
                <History className="w-4 h-4" />
                进化路径 (Evolution Pathway)
              </h5>
              <div className="relative flex justify-between items-center px-4">
                <div className="absolute top-1/2 left-0 w-full h-[1px] border-t border-dashed border-carbon/30 -z-10"></div>
                {['试探 (Trial)', '协作 (Coop)', '疑虑 (Suspicion)'].map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 bg-white px-2">
                    <div className={`w-3 h-3 rounded-full border ${i === 1 ? 'bg-oxblood border-oxblood' : 'border-carbon'}`}></div>
                    <span className={`text-xs ${i === 1 ? 'font-bold text-oxblood' : 'opacity-50'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-paper-dark border-l-4 border-carbon/10">
              <h6 className="font-label text-[10px] font-bold mb-2 uppercase tracking-widest">心理基石 (Psych Foundation)</h6>
              <p className="font-body text-sm leading-relaxed italic opacity-80">
                基于绝对理性的利益分配。在「十日」的高压环境下，情感被剥离至最原始的生存本能。两者的连结并非源于信任，而是源于对「终焉」的共同恐惧。
              </p>
            </div>
            <div className="p-6 bg-paper-dark border-l-4 border-carbon/10">
              <h6 className="font-label text-[10px] font-bold mb-2 uppercase tracking-widest">关联事件 (Linked Events)</h6>
              <ul className="font-label text-[10px] space-y-2">
                <li className="flex justify-between items-center hover:text-oxblood cursor-pointer transition-colors">
                  <span>[ARCH-044] 第一次逃脱尝试</span>
                  <ExternalLink className="w-3 h-3" />
                </li>
                <li className="flex justify-between items-center hover:text-oxblood cursor-pointer transition-colors">
                  <span>[ARCH-051] 祭坛背叛协议</span>
                  <ExternalLink className="w-3 h-3" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
