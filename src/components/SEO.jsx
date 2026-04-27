import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, keywords }) => {
  const location = useLocation();

  useEffect(() => {
    // Update Title
    const baseTitle = 'Auro V Dental';
    document.title = title ? `${title} — ${baseTitle}` : `${baseTitle} — World-Class Dentistry`;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description || 'Auro V Dental offers world-class dentistry including Digital Smile Designing, Aligners, Braces, and Dental Implants.');

    // Update Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords || 'dental clinic, smile designing, aligners, implants, dentist Bengaluru');

    // Update Open Graph Tags
    const updateOG = (property, content) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateOG('og:title', document.title);
    updateOG('og:description', metaDescription.getAttribute('content'));
    updateOG('og:url', window.location.href);

  }, [title, description, keywords, location]);

  return null;
};

export default SEO;
