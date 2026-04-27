import React from 'react';

function FloatingWhatsApp() {
  const phoneNumber = '919731065325'; 
  const message = encodeURIComponent('Hello Auro V Dental! 👋 I would like to inquire about your dental services.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-all hover:scale-110 z-40"
      title="Chat on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      <svg
        className="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 448 512"
        aria-hidden="true"
      >
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32 101.8 32 2.4 131.5 2.4 253.6c0 39 10.2 77 29.6 110.4L0 480l120.4-31.6c32.2 17.6 68.5 26.9 105.4 26.9h.1c122.1 0 221.5-99.5 221.5-221.6 0-59.3-23.2-115-65.5-156.6zM223.9 438.7h-.1c-33.1 0-65.6-8.9-94-25.7l-6.7-4-71.4 18.7 19-69.6-4.4-7c-18.6-29.4-28.4-63.5-28.4-98.5 0-101.2 82.4-183.6 183.7-183.6 49.1 0 95.2 19.1 129.8 53.7 34.6 34.6 53.7 80.7 53.7 129.8.1 101.2-82.3 183.5-183.5 183.5zm101.1-137.9c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.5-14.3 18-17.6 21.7-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.6-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.6-11.1-9.3-9.6-12.5-9.8-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.5-19.4 19-19.4 46.3s19.9 53.7 22.7 57.4c2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.7 23.5 9.1 31.5 11.7 13.2 4.2 25.3 3.6 34.8 2.2 10.6-1.6 32.8-13.4 37.4-26.3 4.6-12.9 4.6-24 3.2-26.3-1.3-2.3-5-3.7-10.5-6.5z" />
      </svg>
    </a>
  );
}

export default FloatingWhatsApp;
