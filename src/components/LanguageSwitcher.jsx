import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' }
  ];

  const current = useMemo(
    () => languages.find((l) => l.code === language) ?? languages[0],
    [language]
  );

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(e.target)) return;
      setOpen(false);
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative flex items-center gap-2">
      <span className="text-xs font-bold text-gray-500 uppercase">Language:</span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold bg-[color:var(--soft)] text-[color:var(--dk)] hover:bg-white border border-black/5 transition"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true">{current.flag}</span>
          <span>{current.code.toUpperCase()}</span>
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-44 bg-white border border-black/5 rounded-2xl shadow-xl overflow-hidden z-50"
        >
          {languages.map((lang) => {
            const active = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                role="menuitem"
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                className={[
                  'w-full text-left px-4 py-3 text-sm font-bold transition flex items-center gap-2',
                  active ? 'bg-[color:var(--teal)] text-white' : 'hover:bg-[color:var(--soft)] text-[color:var(--dk)]'
                ].join(' ')}
              >
                <span aria-hidden="true">{lang.flag}</span>
                <span className="flex-1">{lang.name}</span>
                <span className="text-xs opacity-80">{lang.code.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
