import React from 'react';

const SEOHead = ({ 
  title = 'Auro V Dental - Premium Dental Services',
  description = 'Transform your smile with world-class dental treatments including smile designing, aligners, and implants.',
  keywords = 'dental, smile design, aligners, implants, cosmetic dentistry',
  image = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=85',
  url = 'https://aurovdental.com'
}) => {
  React.useEffect(() => {
    // Update meta tags dynamically
    document.title = title;

    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;

    // Set meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords;

    // Open Graph tags for social sharing
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' }
    ];

    ogTags.forEach(tag => {
      let el = document.querySelector(`meta[property="${tag.property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', tag.property);
        document.head.appendChild(el);
      }
      el.content = tag.content;
    });

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ];

    twitterTags.forEach(tag => {
      let el = document.querySelector(`meta[name="${tag.name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.name = tag.name;
        document.head.appendChild(el);
      }
      el.content = tag.content;
    });

    // Structured data (JSON-LD)
    const structuredData = {
      '@context': 'https://schema.org/',
      '@type': 'DentalPractice',
      'name': 'Auro V Dental',
      'image': image,
      'description': description,
      'url': url,
      'telephone': '+1-555-0000',
      'priceRange': '$$',
      'areaServed': 'Worldwide',
      'availableLanguage': ['en', 'es', 'fr']
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, image, url]);

  return null;
};

export default SEOHead;
