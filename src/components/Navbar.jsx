import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.aboutUs'), path: '/#about' },
    { name: t('nav.ourWork'), path: '/#our-work' },
    { name: t('nav.aiPreview'), path: '/ai-preview' },
    { name: t('nav.results'), path: '/results' },
    { name: t('nav.assessment'), path: '/assessment' },
    { name: t('nav.faq'), path: '/faq' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/5 px-4 md:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 md:gap-3 no-underline">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-[color:var(--teal)] rounded-xl flex items-center justify-center text-white">
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C7.5 2 4 5.5 4 10c0 2.5 1.1 4.7 2.9 6.2L8 21h8l1.1-4.8C18.9 14.7 20 12.5 20 10c0-4.5-3.5-8-8-8zm0 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" /></svg>
          </div>
          <span className="font-serif text-xl md:text-2xl font-bold text-[color:var(--dk)]">Auro V Dental</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-5 text-[15px] font-medium text-[color:var(--txt)]/70">
          <Link to="/" className="hover:text-[color:var(--teal)] transition-colors whitespace-nowrap">{t('nav.home')}</Link>
          <div className="relative group">
            <span className="cursor-pointer hover:text-[color:var(--teal)] transition-colors flex items-center gap-1 whitespace-nowrap">
              {t('nav.services')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-black/5 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 translate-y-2 group-hover:translate-y-0">
              <Link to="/smile-designing" className="block px-6 py-3 hover:bg-[color:var(--soft)] hover:text-[color:var(--teal)] transition-colors">{t('nav.smileDesigning')}</Link>
              <Link to="/aligners-braces" className="block px-6 py-3 hover:bg-[color:var(--soft)] hover:text-[color:var(--teal)] transition-colors">{t('nav.alignersBraces')}</Link>
              <Link to="/dental-implants" className="block px-6 py-3 hover:bg-[color:var(--soft)] hover:text-[color:var(--teal)] transition-colors">{t('nav.dentalImplants')}</Link>
            </div>
          </div>
          {navLinks.slice(1).map(link => (
            <Link key={link.path} to={link.path} className="hover:text-[color:var(--teal)] transition-colors whitespace-nowrap">{link.name}</Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-[color:var(--dk)] font-medium">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="text-[color:var(--teal)] hover:text-[color:var(--dk)] font-medium">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/booking" className="hidden sm:block bg-[color:var(--teal)] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold hover:bg-[color:var(--dk)] transition-all shadow-lg shadow-black/10 active:scale-95 text-sm md:text-base">
              Book An Appointment
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[color:var(--dk)]"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-black/5 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-[color:var(--txt)]/70 hover:text-[color:var(--teal)]"
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Service Links */}
            <div className="flex flex-col gap-3 pl-4 border-l-2 border-[color:var(--soft)] mt-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--muted)]">Services</span>
              <Link to="/smile-designing" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-[color:var(--txt)]/70 hover:text-[color:var(--teal)]">Smile Designing</Link>
              <Link to="/aligners-braces" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-[color:var(--txt)]/70 hover:text-[color:var(--teal)]">Aligners & Braces</Link>
              <Link to="/dental-implants" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-[color:var(--txt)]/70 hover:text-[color:var(--teal)]">Dental Implants</Link>
            </div>
            <div className="border-t border-black/5 pt-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <LanguageSwitcher />
                {user && <button onClick={handleLogout} className="text-[color:var(--teal)] font-medium">Logout</button>}
              </div>
              {!user && (
                <Link
                  to="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-[color:var(--teal)] text-white px-6 py-3 rounded-xl font-bold text-center"
                >
                  Book Appointment
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
