import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

const ImageUpload = () => {
  const { t } = useLanguage();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const enhanceImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) throw new Error('Canvas not supported');

          // Keep reasonable size for fast processing
          const maxW = 1200;
          const scale = Math.min(1, maxW / img.width);
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));

          // Base draw
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Simple "smile enhancement" pipeline:
          // - slightly higher brightness/contrast
          // - slight warm-to-neutral correction (reduce yellow a bit)
          // - gentle clarity via unsharp mask approximation (fast edge boost)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const d = imageData.data;

          const brightness = 8; // -255..255
          const contrast = 1.12; // >1 increases
          const sat = 1.06; // slight saturation
          const yellowReduce = 0.04; // reduce yellow cast (R+G vs B)

          for (let i = 0; i < d.length; i += 4) {
            let r = d[i];
            let g = d[i + 1];
            let b = d[i + 2];

            // brightness
            r += brightness;
            g += brightness;
            b += brightness;

            // contrast around mid-point
            r = (r - 128) * contrast + 128;
            g = (g - 128) * contrast + 128;
            b = (b - 128) * contrast + 128;

            // reduce yellow (push towards blue a bit when R+G dominates)
            const y = (r + g) / 2 - b;
            if (y > 0) {
              const adj = y * yellowReduce;
              r -= adj * 0.6;
              g -= adj * 0.6;
              b += adj;
            }

            // saturation (approx in RGB)
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            r = gray + (r - gray) * sat;
            g = gray + (g - gray) * sat;
            b = gray + (b - gray) * sat;

            // clamp
            d[i] = Math.max(0, Math.min(255, r));
            d[i + 1] = Math.max(0, Math.min(255, g));
            d[i + 2] = Math.max(0, Math.min(255, b));
          }

          ctx.putImageData(imageData, 0, 0);

          // Lightweight clarity: edge boost using built-in filter + redraw
          // (fast and avoids heavy convolution on big images)
          const tmp = document.createElement('canvas');
          tmp.width = canvas.width;
          tmp.height = canvas.height;
          const tctx = tmp.getContext('2d');
          if (tctx) {
            tctx.drawImage(canvas, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.filter = 'contrast(1.06) saturate(1.02)';
            ctx.drawImage(tmp, 0, 0);
            ctx.filter = 'none';
          }

          resolve(canvas.toDataURL('image/jpeg', 0.92));
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = src;
    });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const simulatePreview = async () => {
    setLoading(true);
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
    try {
      const enhanced = await enhanceImage(preview);
      setResult(enhanced);
      
      // Notify backend about the preview
      await axios.post(`${API_BASE}/api/smile-preview`, { 
        image: enhanced,
        originalImage: preview 
      });
    } catch (e) {
      console.error('Enhancement failed:', e);
      setResult(preview);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-black/5">
        <div className="md:flex">
          {/* Upload Section */}
          <div className="md:w-1/2 p-12 bg-[color:var(--deep)] text-white">
            <h2 className="text-3xl font-serif font-bold mb-6">{t('aiPreview.title')}</h2>
            <p className="text-white/70 mb-8 leading-relaxed">
              {t('aiPreview.subtitle')}
            </p>
            
            <label className="block w-full border-2 border-dashed border-white/20 rounded-2xl p-10 text-center cursor-pointer hover:bg-white/5 transition-colors">
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              <div className="text-4xl mb-4">📸</div>
              <span className="font-bold">{t('aiPreview.btnUpload')}</span>
              <p className="text-xs text-white/50 mt-2">JPG, PNG up to 10MB</p>
            </label>

            {preview && (
              <button 
                onClick={simulatePreview}
                disabled={loading}
                className="w-full mt-8 bg-[color:var(--teal)] text-white py-4 rounded-xl font-bold text-lg hover:bg-[color:var(--dk)] disabled:opacity-50 transition-all shadow-xl shadow-black/30"
              >
                {loading ? 'AI Processing...' : t('aiPreview.btnProcess')}
              </button>
            )}
          </div>

          {/* Result Section */}
          <div className="md:w-1/2 p-12 bg-[color:var(--bg)] flex items-center justify-center">
            {!preview ? (
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">⌛</div>
                <p>Upload a photo to see the magic</p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center">
                <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-inner bg-black">
                  <img
                    src={result || preview}
                    className={`w-full h-full object-cover transition-all duration-700 ${loading ? 'blur-md opacity-50' : 'blur-0 opacity-100'}`}
                    alt="AI Preview"
                  />
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-[color:var(--teal)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {result && !loading && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[color:var(--teal)] text-white px-6 py-2 rounded-full font-bold shadow-lg animate-bounce">
                      AI Preview Applied ✨
                    </div>
                  )}
                </div>
                <p className="mt-6 text-sm text-gray-400 text-center">
                  {t('aiPreview.disclaimer')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
