/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HallType } from './types';
import { Navigation, Sidebar, Footer } from './components/Layout';
import { MainTimeline } from './components/MainTimeline';
import { EventHall } from './components/EventHall';
import { WorldviewHall } from './components/WorldviewHall';
import { RelationHall } from './components/RelationHall';

export default function App() {
  const [activeHall, setActiveHall] = useState<HallType>('timeline');

  // Scroll to top when hall changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeHall]);

  const renderHall = () => {
    switch (activeHall) {
      case 'timeline':
        return <MainTimeline />;
      case 'event':
        return <EventHall />;
      case 'worldview':
        return <WorldviewHall />;
      case 'relation':
        return <RelationHall />;
      default:
        return <MainTimeline />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col parchment-texture">
      {/* Decorative SVG Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 100 Q 200 150, 400 100 T 800 150" fill="none" stroke="#610000" strokeWidth="1" />
          <path d="M 1200 400 Q 1000 600, 1300 800" fill="none" stroke="#610000" strokeWidth="1" />
        </svg>
      </div>

      <Navigation activeHall={activeHall} onHallChange={setActiveHall} />
      <Sidebar activeHall={activeHall} />

      <main className="flex-grow max-w-screen-2xl mx-auto px-8 md:px-20 pt-32 pb-48 relative z-10 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeHall}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {renderHall()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onHallChange={setActiveHall} />

      {/* Final Archival Stamp at the bottom of the page */}
      <div className="flex justify-center py-24 bg-parchment relative z-10">
        <div className="relative w-40 h-40 border-4 border-double border-oxblood/40 rounded-full flex flex-col items-center justify-center -rotate-12 opacity-80 transition-all hover:scale-105">
          <div className="w-[90%] h-[90%] border border-oxblood/40 rounded-full flex flex-col items-center justify-center text-center">
            <span className="font-label text-[8px] tracking-widest text-oxblood uppercase">APPROVED</span>
            <span className="font-headline text-2xl font-black text-oxblood py-1">档案封存</span>
            <span className="font-label text-[8px] text-oxblood uppercase">ARCHIVAL UNIT 09</span>
          </div>
        </div>
      </div>
    </div>
  );
}
