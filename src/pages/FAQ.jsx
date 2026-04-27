import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const FAQPage = () => {
  const { t } = useLanguage();
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
    try {
      const response = await axios.get(`${API_BASE}/api/faqs`);
      setFaqs(response.data.faqs);
      setLoading(false);
    } catch (error) {
      console.log('Using default FAQs');
      setFaqs([
        { id: 1, category: 'general', question: t('faq.q1'), answer: t('faq.a1') },
        { id: 2, category: 'implants', question: t('faq.q2'), answer: t('faq.a2') },
        { id: 3, category: 'aligners', question: t('faq.q3'), answer: t('faq.a3') },
        { id: 4, category: 'general', question: t('faq.q4'), answer: t('faq.a4') },
        { id: 5, category: 'smile-designing', question: t('faq.q5'), answer: t('faq.a5') },
        { id: 6, category: 'general', question: t('faq.q6'), answer: t('faq.a6') }
      ]);
      setLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  const categories = ['general', 'smile-designing', 'aligners', 'implants'];
  const categoryLabels = {
    general: t('faq.catGeneral'),
    'smile-designing': t('faq.catSmile'),
    aligners: t('faq.catAligners'),
    implants: t('faq.catImplants')
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gradient-to-b from-[color:var(--soft)] to-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-[color:var(--dk)] mb-4">{t('faq.title')}</h1>
          <p className="text-xl text-[color:var(--muted)] mb-8">{t('faq.subtitle')}</p>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder={t('faq.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-black/10 focus:outline-none focus:border-[color:var(--teal)] text-lg"
            />
            <span className="absolute right-4 top-4 text-2xl">🔍</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-600 text-lg">{t('faq.loading')}</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-teal-900 mb-2">{t('faq.noResults')}</h3>
            <p className="text-gray-600">{t('faq.tryDifferent')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-2xl border-2 border-black/5 overflow-hidden hover:shadow-lg transition">
                <button
                  onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                  className="w-full flex items-start gap-4 p-6 hover:bg-[color:var(--soft)] transition text-left"
                >
                  <span className="text-2xl flex-shrink-0 mt-1">
                    {categoryLabels[faq.category]?.split(' ')[0]}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[color:var(--dk)] mb-1">{faq.question}</h3>
                    <p className="text-sm text-[color:var(--muted)]">{categoryLabels[faq.category]}</p>
                  </div>
                  <span className={`text-2xl flex-shrink-0 transition-transform ${expanded === faq.id ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {expanded === faq.id && (
                  <div className="px-6 pb-6 border-t border-black/5 bg-gradient-to-b from-white to-[color:var(--soft)]">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    <div className="mt-4 pt-4 border-t border-black/10 flex gap-4">
                      <button className="text-sm font-bold text-[color:var(--teal)] hover:underline">👍 {t('faq.helpful')}</button>
                      <button className="text-sm font-bold text-[color:var(--teal)] hover:underline">👎 {t('faq.notHelpful')}</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Still have questions? */}
        <div className="mt-16 bg-gradient-to-r from-[color:var(--teal)] to-[color:var(--dk)] rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-serif font-bold mb-4">{t('faq.stillQuestions')}</h2>
          <p className="mb-8 text-white/80 text-lg">
            {t('faq.stillSub')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="bg-white text-[color:var(--dk)] px-8 py-3 rounded-xl font-bold hover:bg-[color:var(--soft)] transition"
            >
              {t('faq.btnConsult')}
            </Link>
            <Link
              to="/?chat=1"
              className="bg-[color:var(--dk)] border-2 border-white/70 text-white px-8 py-3 rounded-xl font-bold hover:bg-[color:var(--deep)] transition"
            >
              {t('faq.btnChat')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
