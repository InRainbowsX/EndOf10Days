import React from 'react';
import { motion } from 'motion/react';
import { HallType } from '../types';
import { History, LayoutGrid, Globe, Users, Settings } from 'lucide-react';

interface NavigationProps {
  activeHall: HallType;
  onHallChange: (hall: HallType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeHall, onHallChange }) => {
  const navItems: { id: HallType; label: string; chinese: string }[] = [
    { id: 'timeline', label: 'MAIN', chinese: '首页' },
    { id: 'event', label: 'EVENT', chinese: '事件' },
    { id: 'worldview', label: 'WORLD', chinese: '世界' },
    { id: 'relation', label: 'RELATION', chinese: '关系' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-parchment/80 backdrop-blur-md border-b border-oxblood/10">
      <div className="max-w-screen-2xl mx-auto px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-black font-headline text-oxblood tracking-widest uppercase ink-bleed">
            ARCH-IV
          </h1>
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onHallChange(item.id)}
                className={`font-headline tracking-widest text-xs uppercase transition-all duration-300 pb-1 border-b-2 ${
                  activeHall === item.id
                    ? 'text-oxblood border-oxblood'
                    : 'text-carbon/60 border-transparent hover:text-oxblood'
                }`}
              >
                ARCH-{item.id.toUpperCase()} {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-oxblood">
          <Settings className="w-5 h-5 cursor-pointer hover:rotate-90 transition-transform duration-500" />
        </div>
      </div>
    </header>
  );
};

export const Sidebar: React.FC<{ activeHall: HallType }> = ({ activeHall }) => {
  return (
    <aside className="fixed right-0 top-1/2 -translate-y-1/2 w-12 py-8 bg-carbon border-l border-oxblood/20 shadow-2xl z-40 flex flex-col items-center justify-center gap-12">
      <div className="vertical-text font-label text-[10px] tracking-[0.2em] text-oxblood font-bold uppercase">
        ARCH-002: PERSONAE
      </div>
      <div className="h-px w-6 bg-oxblood/30" />
      <div className="vertical-text font-label text-[10px] tracking-[0.2em] text-white/40 uppercase">
        Last Updated: Day 10
      </div>
      <div className="text-oxblood">
        <Globe className="w-5 h-5" />
      </div>
    </aside>
  );
};

export const Footer: React.FC<{ onHallChange: (hall: HallType) => void }> = ({ onHallChange }) => {
  return (
    <footer className="w-full bg-carbon py-16 px-10 border-t border-dashed border-oxblood/20 flex flex-col md:flex-row justify-around items-center gap-8 relative z-10">
      <div className="text-xl font-headline font-black text-blood/80 tracking-widest uppercase">
        ARCH-IV
      </div>
      <div className="flex flex-wrap justify-center gap-8 font-headline italic text-xs">
        <button onClick={() => onHallChange('timeline')} className="text-white/60 hover:text-blood transition-all">RETURN TO MAIN HALL</button>
        <button className="text-white/60 hover:text-blood transition-all">HALL OF RECORDS</button>
        <button className="text-white/60 hover:text-blood transition-all">THE VAULT</button>
      </div>
      <div className="font-headline italic text-[10px] text-white/40 uppercase tracking-widest">
        © ARCHIVAL EPHEMERA MMXXIV
      </div>
    </footer>
  );
};
