import { useEffect, useState } from 'react';
import { DoomRiver } from './components/DoomRiver';

type AppProps = {
  initialBootComplete?: boolean;
  initialView?: NavigationItem;
};

const navigationItems = ['总馆', '人物馆', '事件馆', '世界观馆', '关系馆'] as const;
export type NavigationItem = (typeof navigationItems)[number];

function normalizeView(hash: string): NavigationItem {
  const decoded = decodeURIComponent(hash.replace(/^#/, ''));
  if (navigationItems.includes(decoded as NavigationItem)) {
    return decoded as NavigationItem;
  }
  return '总馆';
}

export default function App({ initialBootComplete = true, initialView }: AppProps) {
  const [activeView, setActiveView] = useState<NavigationItem>(() =>
    initialView ?? (typeof window === 'undefined' ? '总馆' : normalizeView(window.location.hash)),
  );

  const handleNavigate = (view: NavigationItem) => {
    setActiveView(view);
    if (typeof window !== 'undefined') {
      window.location.hash = view;
    }
  };

  useEffect(() => {
    const onHashChange = () => setActiveView(normalizeView(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <main className="app-shell museum-shell-page">
      <div className="museum-frame">
        <header className="museum-nav">
          <div className="museum-nav__brand">
            <p className="museum-nav__brand-code">ARCH-IV 10D</p>
            <h1>十日终焉博物馆</h1>
          </div>

          <nav aria-label="馆内导航" className="museum-nav__links">
            {navigationItems.map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className={`museum-nav__link ${item === activeView ? 'is-active' : ''}`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="museum-nav__status" aria-hidden="true">
            <span>CURATOR NOTE</span>
            <strong>{initialBootComplete ? activeView : '总馆入口'}</strong>
          </div>
        </header>

        <aside className="museum-sidebar" aria-label="档案元数据">
          <div>ID: 10-DAY-001</div>
          <div>DAY: 终焉</div>
          <div>CURATOR SEAL</div>
        </aside>

        <DoomRiver activeView={activeView} onNavigate={handleNavigate} />

        <nav className="museum-footer-nav" aria-label="底部分馆切换">
          {navigationItems.slice(1).map((item) => (
            <a key={item} href={`#${item}`} className={`museum-footer-nav__item ${item === activeView ? 'is-emphasis' : ''}`}>
              <span>{item}</span>
            </a>
          ))}
        </nav>
      </div>
    </main>
  );
}
