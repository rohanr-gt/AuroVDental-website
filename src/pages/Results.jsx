import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

import SEO from '../components/SEO';

const API_BASE = '';

function resolveMediaUrl(url) {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return `${API_BASE}/${url}`;
}

const ResultsPage = () => {
  const { t } = useLanguage();
  const [gallery, setGallery] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await axios.get('/api/gallery');
      setGallery(response.data.gallery);
      setLoading(false);
    } catch (error) {
      console.log('Using default gallery');
      setGallery([
        {
          id: 1,
          category: 'smile-designing',
          title: 'Smile Design Transformation',
          image: 'https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?w=500&q=80'
        },
        {
          id: 2,
          category: 'aligners',
          title: 'Aligner Treatment Success',
          image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500&q=80'
        },
        {
          id: 3,
          category: 'implants',
          title: 'Implant Crown Placement',
          image: 'https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=500&q=80'
        }
      ]);
      setLoading(false);
    }
  };

  const filteredGallery = filter === 'all'
    ? gallery
    : gallery.filter(item => item.category === filter);

  const categories = [
    { value: 'all', label: t('results.filterAll'), emoji: '⭐' },
    { value: 'smile-designing', label: t('results.filterSmile'), emoji: '✨' },
    { value: 'aligners', label: t('results.filterAligners'), emoji: '🔮' },
    { value: 'implants', label: t('results.filterImplants'), emoji: '🦷' }
  ];

  return (
    <div className="min-h-screen pt-24 bg-[color:var(--bg)] text-[color:var(--txt)]">
      <SEO 
        title="Patient Transformations & Gallery" 
        description="See the real-life transformations of our patients at Auro V Dental. Before and after results for smile designing, aligners, and dental implants."
        keywords="dental before and after, smile transformation gallery, aligners results, implants success stories"
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
      {/* Header */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-[color:var(--dk)] mb-4">{t('results.title')}</h1>
          <p className="text-xl text-[color:var(--muted)] max-w-3xl mx-auto">
            {t('results.subtitle')}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                filter === cat.value
                  ? 'bg-[color:var(--teal)] text-white shadow-lg shadow-black/10'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[color:var(--teal)]'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div>
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-600 text-lg">Loading gallery...</p>
          </div>
        ) : filteredGallery.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-gray-600 text-lg">No results found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredGallery.map(item => (
              <div
                key={item.id}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg mb-4 h-80">
                  <img
                    src={resolveMediaUrl(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg font-bold">
                      View
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-[color:var(--dk)] mb-2">{item.title}</h3>
                  <p className="text-[color:var(--muted)]">
                    {categories.find(c => c.value === item.category)?.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="mt-20">
        <div className="bg-gradient-to-r from-[color:var(--teal)] to-[color:var(--dk)] rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-serif font-bold mb-4">{t('services.readyTitle')}</h2>
          <p className="text-white/80 mb-8 text-lg">{t('services.readySub')}</p>
          <Link 
            to="/booking"
            className="bg-white text-[color:var(--dk)] px-10 py-4 rounded-xl font-bold text-lg hover:bg-[color:var(--soft)] transition-colors shadow-lg inline-block"
          >
            {t('services.bookNowBtn')}
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ResultsPage;
