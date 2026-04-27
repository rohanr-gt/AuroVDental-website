import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

function resolveMediaUrl(url) {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return `${API_BASE}/${url}`;
}

const Gallery = ({ onSelectImage }) => {
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
    } catch (error) {
      setGallery([
        {
          id: 1,
          category: 'smile-designing',
          title: 'Smile Design Transformation',
          before: 'https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?w=500&q=80',
          after: 'https://images.unsplash.com/photo-1629909613654-28a3a7c4bd45?w=500&q=80'
        },
        {
          id: 2,
          category: 'aligners',
          title: 'Aligner Treatment Success',
          before: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500&q=80',
          after: 'https://images.unsplash.com/photo-1513412803932-49f9003a7281?w=500&q=80'
        }
      ]);
    }
    setLoading(false);
  };

  const filteredGallery = filter === 'all'
    ? gallery
    : gallery.filter(item => item.category === filter);

  return (
    <div className="w-full">
      {loading ? (
        <div className="text-center py-10">Loading gallery...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map(item => (
            <div
              key={item.id}
              onClick={() =>
                onSelectImage({
                  ...item,
                  before: resolveMediaUrl(item.before),
                  after: resolveMediaUrl(item.after)
                })
              }
              className="group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={resolveMediaUrl(item.before)}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-lg font-bold">
                    View Comparison
                  </span>
                </div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-teal-900">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
