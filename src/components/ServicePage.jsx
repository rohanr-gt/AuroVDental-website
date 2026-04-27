import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const ServicePage = ({ title, subtitle, heroImg, benefits, steps, beforeImg, afterImg }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-[color:var(--bg)] min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt={title} className="absolute inset-0 w-full h-full object-cover brightness-[0.65] contrast-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--deep)]/65 via-[color:var(--deep)]/45 to-black/10" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">{title}</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">{subtitle}</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-[color:var(--dk)] mb-4 text-center">{t('services.whyChoose')}</h2>
          <div className="w-20 h-1 bg-[color:var(--teal)] mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-shadow">
              <div className="text-[color:var(--teal)] text-3xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-[color:var(--dk)] mb-2">{benefit.title}</h3>
              <p className="text-[color:var(--muted)] leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="py-20 bg-[color:var(--deep)] text-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4">{t('services.journeyTitle')}</h2>
            <p className="opacity-70">{t('services.journeySub')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-2xl font-bold text-[#C9A24A] mx-auto mb-6 border-2 border-white/15">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/65 text-sm">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+4rem)] w-[calc(100%-8rem)] h-[2px] bg-white/10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      {afterImg && (
        <section className="py-24 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-[color:var(--dk)] mb-4">{t('services.theResult')}</h2>
            <p className="text-[color:var(--muted)] text-lg">{t('services.resultSub')}</p>
          </div>
          
          {beforeImg ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="relative h-[500px]">
                <img src={beforeImg} alt="Before" className="w-full h-full object-cover" />
                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest">{t('services.beforeTreatment')}</div>
              </div>
              <div className="relative h-[500px]">
                <img src={afterImg} alt="After" className="w-full h-full object-cover" />
                <div className="absolute top-6 right-6 bg-[color:var(--teal)] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">{t('services.afterReveal')}</div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-white premium-shadow">
              <div className="relative h-[600px]">
                <img src={afterImg} alt="Result" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-12">
                  <div className="text-white">
                    <div className="inline-block bg-[color:var(--teal)] px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4">{t('services.transformation')}</div>
                    <p className="text-2xl font-serif italic text-white/95">{t('services.quote')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Global CTA Section */}
      <section className="py-20 px-4 bg-[color:var(--teal)] mt-20 rounded-t-[3rem] text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">{t('services.readyTitle')}</h2>
        <p className="text-white/85 mb-10 max-w-2xl mx-auto">{t('services.readySub')}</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            to="/booking"
            className="bg-white text-[color:var(--dk)] px-10 py-4 rounded-xl font-bold text-lg hover:bg-[color:var(--soft)] transition-colors shadow-lg"
          >
            {t('services.bookNowBtn')}
          </Link>
          <Link
            to="/results"
            className="bg-[color:var(--dk)] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[color:var(--deep)] transition-colors border border-white/20"
          >
            {t('services.viewResultsBtn')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
