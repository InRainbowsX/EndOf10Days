import React from 'react';
import { motion } from 'motion/react';

export const MainTimeline: React.FC = () => {
  const ends = [
    {
      id: '00',
      title: '混沌之源',
      subtitle: '终焉之前',
      description: '在终焉正式降临前的宁静，是无数谎言堆砌的幻象。记忆被剥离，真实的自我被掩埋在虚无之中。',
      image: 'https://picsum.photos/seed/clock/800/1000?grayscale',
      characters: '齐夏 / QI XIA',
      event: '最初的觉醒'
    },
    {
      id: '01',
      title: '第1次终焉',
      subtitle: 'RE-ENTRY: 01',
      description: '“当所有人认为结束时，循环才刚刚开始。”',
      stats: { survivors: '无 / NONE', chaos: 'MAX' }
    },
    {
      id: '02-03',
      title: '第2-3次终焉：试错阶段',
      description: '齐夏开始意识到规则的漏洞。这是最血腥的尝试，每一步都踩在同伴的尸骸之上。',
      events: ['核心事件：七人的背叛', '登场人物：余若、乔家劲']
    }
  ];

  return (
    <div className="space-y-24 py-12">
      <section className="max-w-4xl">
        <div className="flex items-baseline gap-4 mb-2">
          <span className="font-label text-oxblood text-xs tracking-[0.3em] bg-oxblood/10 px-2 py-1 uppercase">Main-Line-001</span>
          <h2 className="font-headline text-6xl md:text-8xl font-black text-carbon mb-4 leading-tight ink-bleed uppercase tracking-tighter">终焉主脉络长河</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-oxblood text-white px-3 py-1 font-label text-[10px] uppercase tracking-widest archival-stamp font-bold">绝密档案 / CONFIDENTIAL</span>
          <div className="h-[1px] flex-grow bg-oxblood/10"></div>
        </div>
        <p className="mt-8 text-carbon/70 font-headline text-xl leading-relaxed max-w-2xl italic border-l-2 border-oxblood/30 pl-6 py-2">
          此卷轴记录了“十日终焉”所有已知轮回轨迹。每一道折痕都代表一次毁灭，每一处墨渍都是无法挽回的牺牲。
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 relative">
        {/* Stage 00 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-8 bg-paper p-10 relative border border-oxblood/10 shadow-xl parchment-texture"
        >
          <div className="absolute -top-4 -left-4 bg-oxblood text-white font-headline font-bold px-4 py-2 text-sm z-20 shadow-lg tracking-widest uppercase">00. 终焉之前</div>
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <h3 className="font-headline text-3xl text-carbon font-black mb-4 ink-bleed">混沌之源</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-[10px] font-label border border-oxblood/20 px-2 py-0.5 text-carbon/60 uppercase tracking-wider"># 毁灭之种</span>
                <span className="text-[10px] font-label border border-oxblood/20 px-2 py-0.5 text-carbon/60 uppercase tracking-wider"># 记忆缺失</span>
              </div>
              <p className="text-carbon/80 text-base leading-relaxed mb-8">{ends[0].description}</p>
              <div className="grid grid-cols-2 gap-8 text-xs font-headline uppercase tracking-widest">
                <div>
                  <span className="text-oxblood/60 block mb-2 font-bold">核心人物</span>
                  <span className="text-carbon font-black text-sm">{ends[0].characters}</span>
                </div>
                <div>
                  <span className="text-oxblood/60 block mb-2 font-bold">关键事件</span>
                  <span className="text-carbon font-black text-sm">{ends[0].event}</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/5 aspect-[4/5] bg-paper-dark overflow-hidden relative border border-oxblood/10 shadow-inner">
              <img className="w-full h-full object-cover grayscale contrast-125 opacity-80" src={ends[0].image} alt="Archival" />
              <div className="absolute inset-0 pointer-events-none border-[12px] border-paper/50"></div>
            </div>
          </div>
        </motion.div>

        {/* Stage 01 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="md:col-start-10 md:col-span-3 bg-white p-8 relative border border-oxblood/10 shadow-lg hover:rotate-1 transition-transform cursor-pointer"
        >
          <div className="absolute -top-3 right-4 bg-blood text-white font-label px-3 py-1 text-[10px] archival-stamp font-bold tracking-widest">RE-ENTRY: 01</div>
          <h3 className="font-headline text-2xl text-carbon font-black mb-6 italic underline decoration-wavy decoration-oxblood/30 underline-offset-8">第1次终焉</h3>
          <p className="text-sm text-carbon/70 italic mb-6">{ends[1].description}</p>
          <ul className="text-[11px] font-headline uppercase tracking-widest space-y-3 border-t border-dashed border-oxblood/10 pt-6">
            <li className="flex justify-between items-center"><span className="text-oxblood/60">主要幸存者</span><span className="font-black text-carbon">{ends[1].stats?.survivors}</span></li>
            <li className="flex justify-between items-center"><span className="text-oxblood/60">失控程度</span><span className="font-black text-blood">{ends[1].stats?.chaos}</span></li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};
