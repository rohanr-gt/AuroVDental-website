import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from '../components/SEO';

const BookingPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    service: 'smile-designing',
    issue: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  // Review State
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
    try {
      const response = await axios.get(`${API_BASE}/api/available-slots`);
      setAvailableSlots(response.data.slots);
    } catch (error) {
      console.log('Using default slots');
      setAvailableSlots(['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM']);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
    try {
      const localResponse = await axios.post(`${API_BASE}/api/appointments`, formData);
      setEmailStatus(localResponse?.data?.emailStatus || null);

      if (localResponse.data.success) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error booking appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewData.rating === 0) return;
    setReviewLoading(true);
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
    try {
      await axios.post(`${API_BASE}/api/reviews`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      setReviewSubmitted(true);
    } catch (error) {
      console.error('Review error:', error);
      alert(t('reviews.error') || 'Error submitting review');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 bg-gradient-to-b from-[color:var(--soft)] to-white">
      <SEO 
        title="Book Appointment" 
        description="Schedule your free dental consultation at Auro V Dental. Book online for smile designing, aligners, or implants in Bengaluru."
        keywords="book dentist online, dental appointment Bengaluru, free consultation, Auro V Dental booking"
      />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[color:var(--dk)] mb-4">{t('booking.title')}</h1>
          <p className="text-[color:var(--muted)] text-base md:text-lg">{t('booking.subtitle')}</p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border-2 border-green-500 rounded-3xl p-6 md:p-12 text-center">
            <div className="text-5xl md:text-6xl mb-4">✅</div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-green-900 mb-4">{t('booking.confirmed')}</h2>
            <p className="text-green-700 mb-6 text-sm md:text-base">{t('booking.confirmedSub')}</p>
            {emailStatus ? (
              <p className="text-sm mb-6">
                <strong>{t('booking.emailLabel')}</strong>{' '}
                {emailStatus.sent ? (
                  <>
                    {t('booking.emailSent')}
                    {emailStatus.mode === 'ethereal' && emailStatus.previewUrl ? (
                      <>
                        {' '}
                        <a
                          href={emailStatus.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[color:var(--teal)] font-bold hover:underline"
                        >
                          {t('booking.viewPreview')}
                        </a>
                      </>
                    ) : null}
                  </>
                ) : (
                  t('booking.emailNotSent').replace('{reason}', emailStatus.reason || 'unknown')
                )}
              </p>
            ) : null}
            <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 text-left text-sm md:text-base">
              <p className="text-gray-700 mb-2"><strong>{t('booking.nameLabel')}</strong> {formData.name || 'Pending'}</p>
              <p className="text-gray-700 mb-2"><strong>{t('booking.dateLabel')}</strong> {formData.date}</p>
              <p className="text-gray-700 mb-2"><strong>{t('booking.timeLabel')}</strong> {formData.time}</p>
              <p className="text-gray-700"><strong>{t('booking.serviceLabel')}</strong> {t(`booking.services.${formData.service.replace('-', '')}`) || formData.service}</p>
            </div>
            <div className="flex flex-col gap-4">
              <a 
                href={`https://wa.me/919731065325?text=${encodeURIComponent(
                  `Hello Auro V Dental! 👋 \n\nI just booked an appointment:\n👤 Name: ${formData.name}\n📆 Date: ${formData.date}\n⏰ Time: ${formData.time}\n🦷 Service: ${formData.service}\n\nPlease confirm!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition flex items-center justify-center gap-2"
              >
                <span>{t('booking.whatsappBtn')}</span>
                <span className="text-xl">💬</span>
              </a>
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setEmailStatus(null);
                  setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    date: '',
                    time: '',
                    service: 'smile-designing',
                    issue: ''
                  });
                }} 
                className="text-[color:var(--teal)] font-bold hover:underline"
              >
                {t('booking.bookAnother')}
              </button>
            </div>

            {/* Give Review Section */}
            <div className="mt-8 pt-8 border-t border-green-200 text-left">
              {reviewSubmitted ? (
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-3xl mb-2">✨</div>
                  <p className="text-green-800 font-bold">{t('reviews.success')}</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
                  <h3 className="font-serif text-xl font-bold text-[color:var(--dk)] mb-2">{t('reviews.giveReview')}</h3>
                  <p className="text-sm text-[color:var(--muted)] mb-6">{t('reviews.reviewDesc')}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">Email</label>
                      <input type="email" value={formData.email} readOnly className="w-full bg-gray-50 border border-black/5 rounded-xl px-4 py-2 text-gray-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">Phone</label>
                      <input type="tel" value={formData.phone} readOnly className="w-full bg-gray-50 border border-black/5 rounded-xl px-4 py-2 text-gray-500" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">{t('reviews.rating')}</label>
                    <div className="flex gap-2 text-3xl">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                          className={`transition-colors ${reviewData.rating >= star ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-200'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">{t('reviews.comments')}</label>
                    <textarea
                      value={reviewData.comment}
                      onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                      className="w-full bg-[color:var(--bg)] border border-black/10 rounded-xl px-4 py-3 h-24 resize-none focus:outline-none focus:border-[color:var(--teal)]"
                      placeholder={t('reviews.writeCommentPlaceholder')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading || reviewData.rating === 0}
                    className="bg-[color:var(--dk)] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[color:var(--teal)] transition-colors disabled:opacity-50"
                  >
                    {reviewLoading ? t('reviews.submitting') : t('reviews.submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-black/5">
            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div>
                <label className="block text-[color:var(--dk)] font-bold mb-2">{t('booking.fullName')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[color:var(--teal)]"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-[color:var(--dk)] font-bold mb-2">{t('booking.phone')}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[color:var(--teal)]"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <label className="block text-[color:var(--dk)] font-bold mb-2">{t('booking.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[color:var(--teal)]"
                placeholder="your@email.com"
              />
            </div>

            {/* Appointment Details */}
            <div className="bg-[color:var(--soft)] p-4 md:p-6 rounded-2xl mb-6 md:mb-8 border border-black/5">
              <h3 className="text-lg font-bold text-[color:var(--dk)] mb-4 md:mb-6">{t('booking.selectAppointment')}</h3>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
                <div>
                  <label className="block text-[color:var(--dk)] font-bold mb-2">{t('booking.servicePlaceholder')}</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[color:var(--teal)]"
                  >
                    <option value="smile-designing">{t('booking.services.smileDesigning')}</option>
                    <option value="aligners">{t('booking.services.aligners')}</option>
                    <option value="implants">{t('booking.services.implants')}</option>
                    <option value="consultation">{t('booking.services.consultation')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[color:var(--dk)] font-bold mb-2">{t('booking.datePlaceholder')}</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[color:var(--teal)]"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[color:var(--dk)] font-bold mb-3">{t('booking.timeSlot')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, time: slot }))}
                      className={`py-2 px-3 rounded-lg font-semibold text-sm transition ${
                        formData.time === slot
                          ? 'bg-[color:var(--teal)] text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-[color:var(--teal)]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Issue Description */}
            <div className="mb-6 md:mb-8">
              <label className="block text-[color:var(--dk)] font-bold mb-2">{t('booking.goalsLabel')}</label>
              <textarea
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[color:var(--teal)]"
                placeholder={t('booking.goalsPlaceholder')}
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[color:var(--teal)] text-white py-4 rounded-xl font-bold text-lg hover:bg-[color:var(--dk)] transition-colors disabled:opacity-50"
            >
              {loading ? t('booking.processing') : t('booking.confirmBtn')}
            </button>

            <p className="text-[color:var(--muted)] text-sm text-center mt-4">
              {t('booking.benefits')}
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
