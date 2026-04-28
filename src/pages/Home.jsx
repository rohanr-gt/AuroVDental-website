import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import axios from 'axios';
import smileImg from '../images/smile design after.png';
import alignersImg from '../images/braces and aligners after.png';
import implantsImg from '../images/dental implant after.png';
import ourwork1 from '../images/ourwork1.png';
import ourwork2 from '../images/ourwork2.png';
import ourwork3 from '../images/ourwork3.png';
import ourwork4 from '../images/ourwork4.jpg';
import ourwork5 from '../images/ourwork5.png';
import ourwork6 from '../images/ourwork6.jpg';
import ourwork7 from '../images/ourwork7.jpg';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

const Home = () => {
  const { t } = useLanguage();
  const [ourWorkGallery, setOurWorkGallery] = useState([]);
  const [contactData, setContactData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const fetchOurWork = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/gallery`);
        if (res.data?.success) {
          const filtered = res.data.gallery.filter(item => item.category === 'our-work');
          setOurWorkGallery(filtered);
        }
      } catch (err) {
        console.error('Error fetching our work gallery:', err);
      }
    };
    fetchOurWork();
  }, []);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://api.web3forms.com/submit', {
        access_key: '8f11e73a-2e5f-4578-bb73-52c99d93155f',
        subject: `Contact Inquiry: ${contactData.firstName} ${contactData.lastName}`,
        from_name: 'Auro V Dental Website',
        confirm_email: 'true',
        replyto: 'cursorhalesh@gmail.com',
        name: `${contactData.firstName} ${contactData.lastName}`, 
        email: contactData.email,
        message: contactData.message,
        ...contactData
      }, {
        headers: {
          'Accept': 'application/json'
        }
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Contact error:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const defaultOurWork = [
    { image: ourwork1, title: 'Perfect Transformation 1' },
    { image: ourwork2, title: 'Perfect Transformation 2' },
    { image: ourwork3, title: 'Perfect Transformation 3' },
    { image: ourwork4, title: 'Perfect Transformation 4' },
    { image: ourwork5, title: 'Perfect Transformation 5' },
    { image: ourwork6, title: 'Perfect Transformation 6' },
    { image: ourwork7, title: 'Perfect Transformation 7' },
  ];

  const allOurWork = [
    ...defaultOurWork,
    ...ourWorkGallery.map(item => ({
      image: item.image.startsWith('http') ? item.image : `${API_BASE}${item.image}`,
      title: item.title
    }))
  ];

  // Double the items for seamless marquee
  const marqueeItems = [...allOurWork, ...allOurWork];

  return (
    <div className="pt-20">
      <SEO 
        title="World-Class Dentistry in Bengaluru"
        description="Auro V Dental offers advanced digital smile designing, clear aligners, and dental implants with international standards. Book your free consultation today."
        keywords="best dentist Bengaluru, digital smile design, clear aligners India, dental implants Bengaluru, Auro V Dental"
      />
      {/* Hero Section */}
      <header className="relative min-h-[90vh] flex items-center px-6 md:px-20 overflow-hidden bg-[color:var(--deep)]">
        <img 
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1800&q=85" 
          alt="Clinic" 
          className="absolute inset-0 w-full h-full object-cover opacity-45 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--deep)]/95 via-[color:var(--deep)]/80 to-[color:var(--deep)]/10" />
        <div className="relative z-10 max-w-3xl text-white">
          <div className="inline-block bg-[color:var(--teal)]/20 border border-[color:var(--teal)]/30 text-[#C9A24A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
            {t('home.excellence')}
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif font-bold leading-[1.1] mb-6">
            {t('home.wherePerfect')} <br />
            <span className="italic text-[#C9A24A]">{t('home.smiles')}</span> {t('home.crafted')}
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-2xl leading-relaxed">
            {t('home.heroSubtitle')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/booking" className="bg-[color:var(--teal)] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-[color:var(--dk)] transition-all shadow-xl shadow-black/30 active:scale-95">
              {t('home.bookConsultation')}
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl">
            {[
              { n: '25K+', l: t('home.happyPatients') },
              { n: '40+', l: t('home.countries') },
              { n: '18 yrs', l: t('home.excellenceYrs') },
              { n: '4.9★', l: t('home.rating') }
            ].map((s) => (
              <div key={s.l}>
                <div className="font-serif text-3xl text-[#C9A24A] font-bold leading-none">{s.n}</div>
                <div className="text-xs tracking-wide uppercase text-white/50 mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Trust Bar */}
      <section className="bg-[color:var(--soft)] border-y border-black/5 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm text-[color:var(--muted)]">
          {[
            { t: t('home.trust.jci'), d: t('home.trust.jciD') },
            { t: t('home.trust.iso'), d: t('home.trust.isoD') },
            { t: t('home.trust.docs'), d: t('home.trust.docsD') },
            { t: t('home.trust.patients'), d: t('home.trust.patientsD') },
            { t: t('home.trust.emergency'), d: t('home.trust.emergencyD') }
          ].map((x) => (
            <div key={x.t} className="flex items-center gap-2">
              <span className="inline-flex w-2 h-2 rounded-full bg-[color:var(--teal)]" />
              <span>
                <span className="font-bold text-[color:var(--txt)]">{x.t}</span> {x.d}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* About Split */}
      <section id="about" className="grid lg:grid-cols-2">
        <div className="relative min-h-[420px] overflow-hidden">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/071/062/019/small/dental-checkup-examination-procedure-with-doctor-and-patient-free-photo.jpg"
            alt="Dentist consulting with patient"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 bg-white/95 rounded-2xl px-6 py-5 shadow-2xl">
            <div className="font-serif text-4xl font-bold text-[color:var(--teal)] leading-none">18+</div>
            <div className="text-sm text-[color:var(--muted)] mt-1">{t('home.excellenceYrs')}</div>
          </div>
        </div>
        <div className="bg-[color:var(--bg)] px-6 py-20 lg:px-16 flex items-center">
          <div className="max-w-xl">
            <div className="text-xs font-bold tracking-[0.3em] uppercase text-[color:var(--teal)] mb-4">
              {t('home.aboutTitle')}
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[color:var(--dk)] leading-tight">
              {t('home.aboutH2')}
            </h2>
            <p className="mt-6 text-[color:var(--muted)] leading-relaxed">
              {t('home.aboutP')}
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              {[
                { i: '🔬', t: t('home.aboutF1Title'), d: t('home.aboutF1Desc') },
                { i: '🌍', t: t('home.aboutF2Title'), d: t('home.aboutF2Desc') },
                { i: '🛡️', t: t('home.aboutF3Title'), d: t('home.aboutF3Desc') },
                { i: '💤', t: t('home.aboutF4Title'), d: t('home.aboutF4Desc') }
              ].map((f) => (
                <div key={f.t} className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[color:var(--soft)] flex items-center justify-center text-lg">
                    {f.i}
                  </div>
                  <div>
                    <div className="font-bold text-[color:var(--dk)]">{f.t}</div>
                    <div className="text-sm text-[color:var(--muted)] mt-1 leading-relaxed">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="bg-[color:var(--teal)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[color:var(--dk)] transition"
              >
                {t('home.scheduleVisit')} →
              </Link>
              <Link
                to="/assessment"
                className="border-2 border-[color:var(--teal)] text-[color:var(--teal)] px-8 py-3 rounded-xl font-bold hover:bg-[color:var(--soft)] transition"
              >
                {t('home.takeQuiz')} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Treatments */}
      <section className="py-32 px-6 bg-white relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[color:var(--bg)] to-transparent" />
        
        <div className="max-w-7xl mx-auto text-center mb-24 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[color:var(--soft)] border border-[color:var(--teal)]/10 text-[color:var(--teal)] text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <span className="w-2 h-2 rounded-full bg-[color:var(--teal)] animate-pulse" />
            {t('home.signatureTreatments')}
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[color:var(--dk)] mb-6 leading-tight">
            {t('home.crafted')} {t('home.wherePerfect')} <span className="italic text-gradient">{t('home.perfectSmile')}</span>
          </h2>
          <p className="text-[color:var(--muted)] max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            {t('home.heroSubtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto relative z-10">
          {[
            { 
              title: t('nav.smileDesigning'), 
              path: "/smile-designing", 
              icon: "https://parthadental.com/wp-content/uploads/2022/09/cosmetic-dentistry-750x750.jpg", 
              isImage: true,
              desc: t('home.service1Desc'),
              accent: "from-amber-50 to-orange-50",
              num: "01"
            },
            { 
              title: t('nav.alignersBraces'), 
              path: "/aligners-braces", 
              icon: "https://dentistry.uic.edu/wp-content/uploads/sites/741/2020/10/iStock-501427146-1090x595.jpg", 
              isImage: true,
              desc: t('home.service2Desc'),
              accent: "from-blue-50 to-indigo-50",
              num: "02"
            },
            { 
              title: t('nav.dentalImplants'), 
              path: "/dental-implants", 
              icon: "https://www.sanmarcosdental.com/blog/wp-content/uploads/implant-diagram.jpeg", 
              isImage: true,
              desc: t('home.service3Desc'),
              accent: "from-emerald-50 to-teal-50",
              num: "03"
            }
          ].map((service, i) => (
            <Link
              key={i}
              to={service.path}
              className="group relative p-10 bg-white rounded-[3rem] border border-black/5 hover:border-[color:var(--teal)]/20 premium-shadow premium-shadow-hover hover-lift transition-all duration-500 no-underline text-center overflow-hidden flex flex-col items-center"
            >
              {/* Decorative Number */}
              <div className="absolute top-8 right-10 text-6xl font-serif font-bold text-black/10 group-hover:text-[color:var(--teal)]/20 transition-colors">
                {service.num}
              </div>

              {/* Image Icon Wrapper */}
              <div className="w-40 h-40 rounded-[3.5rem] shadow-lg shadow-black/5 border border-black/10 flex items-center justify-center overflow-hidden mb-10 group-hover:scale-110 transition-all duration-500 bg-white mx-auto">
                <img src={service.icon} alt={service.title} className="w-full h-full object-cover" />
              </div>

              <div className="relative z-10 flex flex-col flex-grow items-center">
                <h3 className="text-3xl font-serif font-bold text-[color:var(--dk)] mb-4">{service.title}</h3>
                <p className="text-[color:var(--muted)] mb-10 leading-relaxed font-medium min-h-[4.5rem]">
                  {service.desc}
                </p>
                
                <div className="mt-auto pt-6 border-t border-black/5 flex items-center justify-center gap-4 w-full">
                  <span className="text-[color:var(--teal)] font-bold flex items-center gap-2 text-lg">
                    {t('home.discoverMore')} 
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </span>
                </div>
              </div>

              {/* Background Accent Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[color:var(--soft)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </Link>
          ))}
        </div>
      </section>

      {/* Our Work Section */}
      <section id="our-work" className="py-32 px-6 bg-[color:var(--soft)] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white border border-black/5 shadow-sm text-[color:var(--teal)] text-xs font-bold uppercase tracking-[0.2em] mb-6">
              <span className="w-3 h-3 rounded-full bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.4)]" />
              {t('nav.ourWork')}
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-[color:var(--dk)] mb-6">
              {t('home.witnessThe')}<span className="italic text-[color:var(--teal)]">{t('home.magic')}</span>{t('home.ofOurWorks')}
            </h2>
            <p className="text-[color:var(--muted)] max-w-2xl mx-auto text-lg leading-relaxed">
              {t('home.realResults')}
            </p>
          </div>

          <div className="relative group overflow-hidden">
            {/* Marquee Container */}
            <div className="marquee-container">
              {marqueeItems.map((item, index) => (
                <div 
                  key={index} 
                  className="w-[300px] md:w-[450px] px-4 flex-shrink-0"
                >
                  <div className="relative h-[250px] md:h-[350px] w-full rounded-3xl overflow-hidden shadow-sm border border-black/5 bg-white group/card">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover/card:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4 translate-y-full group-hover/card:translate-y-0 transition-transform duration-300 border-t border-black/5">
                      <h4 className="text-sm font-bold text-[color:var(--dk)] truncate">{item.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="py-24 px-6 bg-[color:var(--bg)]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-xs font-bold tracking-[0.3em] uppercase text-[color:var(--teal)] mb-4">{t('home.doctors.title')}</div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[color:var(--dk)] mb-6">
            <span dangerouslySetInnerHTML={{ __html: t('home.doctors.subtitle').replace('{specialists}', `<span className="italic text-[color:var(--teal)]">${t('home.doctors.specialists')}</span>`) }} />
          </h2>
          <p className="text-[color:var(--muted)] max-w-3xl mx-auto leading-relaxed">
            {t('home.doctors.desc')}
          </p>
        </div>

        <div className="max-w-7xl mx-auto mt-14 grid gap-8 md:grid-cols-3">
          {[
            {
              name: 'Dr. Rohan Mehta',
              role: t('home.doctors.founder'),
              tag: t('home.doctors.oralMax'),
              img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=900&q=85',
              exp: '20+ years'
            },
            {
              name: 'Dr. Priya Sharma',
              role: t('home.doctors.leadCosmetic'),
              tag: t('home.doctors.cosmeticAesthetic'),
              img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=900&q=85',
              exp: '14 years'
            },
            {
              name: 'Dr. Arjun Nair',
              role: t('home.doctors.seniorImplant'),
              tag: t('home.doctors.implantology'),
              img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=900&q=85',
              exp: '16 years'
            }
          ].map((d) => (
            <div key={d.name} className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl hover:shadow-black/5 transition">
              {/* Doctor Image Wrapper */}
              <div className="flex justify-center pt-10">
                <div className="w-48 h-48 rounded-[4rem] shadow-lg shadow-black/5 border border-black/10 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-all duration-500 bg-white">
                  <img src={d.img} alt={d.name} className="w-full h-full object-contain" style={{height: '190px', width: '100%', objectFit: 'contain'}} />
                </div>
              </div>
              <div className="p-8 text-center">
                <div className="font-serif text-2xl font-bold text-[color:var(--dk)]">{d.name}</div>
                <div className="text-sm text-[color:var(--muted)] mt-1">{d.role}</div>
                <div className="mt-4 text-sm text-[color:var(--muted)]">
                  {t('home.doctors.trained')} · <span className="font-bold text-[color:var(--teal)]">{d.exp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dental Tourism */}
      <section className="py-24 px-6 bg-[color:var(--soft)]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <div className="text-xs font-bold tracking-[0.3em] uppercase text-[color:var(--teal)] mb-4">{t('home.tourism.title')}</div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[color:var(--dk)] leading-tight">
              <span dangerouslySetInnerHTML={{ __html: t('home.tourism.subtitle').replace('{better}', `<span className="italic text-[color:var(--teal)]">${t('home.tourism.better')}</span>`) }} />
            </h2>
            <p className="mt-6 text-[color:var(--muted)] leading-relaxed">
              {t('home.tourism.desc')}
            </p>
            <div className="mt-8 space-y-5">
              {[
                { n: '1', t: t('home.tourism.step1Title'), d: t('home.tourism.step1Desc') },
                { n: '2', t: t('home.tourism.step2Title'), d: t('home.tourism.step2Desc') },
                { n: '3', t: t('home.tourism.step3Title'), d: t('home.tourism.step3Desc') },
                { n: '4', t: t('home.tourism.step4Title'), d: t('home.tourism.step4Desc') }
              ].map((s) => (
                <div key={s.n} className="flex gap-4 border-b border-black/5 pb-5">
                  <div className="w-11 h-11 rounded-full bg-[color:var(--teal)] text-white font-bold flex items-center justify-center flex-shrink-0">
                    {s.n}
                  </div>
                  <div>
                    <div className="font-bold text-[color:var(--dk)]">{s.t}</div>
                    <div className="text-sm text-[color:var(--muted)] mt-1 leading-relaxed">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link
                to="/booking"
                className="bg-[color:var(--teal)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[color:var(--dk)] transition inline-flex"
              >
                {t('home.tourism.btn')} →
              </Link>
            </div>
          </div>

          <div className="bg-[color:var(--dk)] rounded-3xl overflow-hidden text-white">
            <div className="relative h-80">
              <img
                src="https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=1400&q=85"
                alt="International patient smiling at clinic"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
            </div>
            <div className="p-10">
              <div className="font-serif text-3xl font-bold">{t('home.tourism.whyTitle')}</div>
              <p className="text-white/60 mt-3 leading-relaxed">
                {t('home.tourism.whyDesc')}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { i: '✈️', t: t('home.tourism.feat1Title'), d: t('home.tourism.feat1Desc') },
                  { i: '🏨', t: t('home.tourism.feat2Title'), d: t('home.tourism.feat2Desc') },
                  { i: '👨‍⚕️', t: t('home.tourism.feat3Title'), d: t('home.tourism.feat3Desc') },
                  { i: '📋', t: t('home.tourism.feat4Title'), d: t('home.tourism.feat4Desc') }
                ].map((x) => (
                  <div key={x.t} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="text-xl">{x.i}</div>
                    <div className="font-bold mt-2">{x.t}</div>
                    <div className="text-xs text-white/55 mt-1 leading-relaxed">{x.d}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-[color:var(--teal)] to-[#6B8F71] p-5 flex items-center gap-4">
                <div className="font-serif text-5xl font-bold leading-none">70%</div>
                <div>
                  <div className="font-bold">{t('home.tourism.savings')}</div>
                  <div className="text-sm text-white/80">{t('home.tourism.vsCare')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-[color:var(--bg)]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-end">
          <div>
            <div className="text-xs font-bold tracking-[0.3em] uppercase text-[color:var(--teal)] mb-4">{t('home.patientExperiences')}</div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[color:var(--dk)] leading-tight">
              {t('home.patientExpSub')}
            </h2>
          </div>
          <p className="text-[color:var(--muted)] leading-relaxed">
            {t('home.patientExpDesc')}
          </p>
        </div>

        <div className="max-w-7xl mx-auto mt-14 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              feat: true,
              q: t('home.testimonials.t1'),
              n: 'Sara Al‑Hamdan',
              l: 'Dubai, UAE'
            },
            {
              q: t('home.testimonials.t2'),
              n: 'James Mitchell',
              l: 'Manchester, UK'
            },
            {
              q: t('home.testimonials.t3'),
              n: 'Anna Petrova',
              l: 'Moscow, Russia'
            },
            {
              q: 'Got my implants done — feels just like natural teeth.\nProfessional care and smooth experience from start to finish.\nCompletely changed my confidence and quality of life.',
              n: 'Auro V Dental Patient',
              l: 'Bengaluru, India'
            }
          ].map((t) => (
            <div
              key={t.n}
              className={[
                'rounded-3xl p-8 border transition',
                t.feat
                  ? 'bg-gradient-to-br from-[color:var(--dk)] to-[color:var(--deep)] border-transparent text-white'
                  : 'bg-white border-black/5 text-[color:var(--txt)] hover:shadow-xl hover:shadow-black/5'
              ].join(' ')}
            >
              <div className={t.feat ? 'text-[#C9A24A]' : 'text-[color:var(--teal)]'}>★★★★★</div>
              <p className={['mt-4 text-base leading-7 whitespace-pre-wrap', t.feat ? 'text-white/75' : 'text-[color:var(--muted)]'].join(' ')}>
                {t.q}
              </p>
              <div className="mt-6 font-bold">{t.n}</div>
              <div className={t.feat ? 'text-white/50 text-sm' : 'text-[color:var(--muted)] text-sm'}>{t.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-24 px-6 bg-gradient-to-br from-[color:var(--deep)] to-[color:var(--dk)] text-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <div className="text-xs font-bold tracking-[0.3em] uppercase text-[#C9A24A] mb-4">{t('home.contact.title')}</div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              <span dangerouslySetInnerHTML={{ __html: t('home.contact.subtitle').replace('{free}', `<span className="italic text-[color:var(--teal)]">${t('home.contact.free')}</span>`) }} />
            </h2>
            <p className="mt-6 text-white/65 leading-relaxed max-w-xl">
              {t('home.contact.desc')}
            </p>
            <div className="mt-10 space-y-4 text-white/80">
              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">📞</div>
                <div>
                  <div className="font-bold text-white">+91 98765 43210</div>
                  <div className="text-sm text-white/55">{t('home.contact.phone')}</div>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">📧</div>
                <div>
                  <div className="font-bold text-white">hello@aurovdental.com</div>
                  <div className="text-sm text-white/55">{t('home.contact.email')}</div>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">📍</div>
                <div>
                  <div className="font-bold text-white">{t('home.contact.locName')}</div>
                  <div className="text-sm text-white/55">{t('home.contact.location')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 text-[color:var(--txt)] border border-white/20 shadow-2xl shadow-black/20">
            {submitted ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-2xl font-serif font-bold text-[color:var(--dk)] mb-4">{t('home.contact.sentTitle')}</h3>
                <p className="text-[color:var(--muted)] mb-8">{t('home.contact.sentSub')}</p>
                <div className="flex flex-col gap-4">
                  <a 
                    href={`https://wa.me/919731065325?text=${encodeURIComponent(
                      `Hello! I just submitted a contact form on your website. \nName: ${contactData.firstName} ${contactData.lastName} \nEmail: ${contactData.email} \nMessage: ${contactData.message}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition flex items-center justify-center gap-2"
                  >
                    <span>{t('home.contact.btnWhatsapp')}</span>
                    <span className="text-xl">💬</span>
                  </a>
                  <button onClick={() => setSubmitted(false)} className="text-[color:var(--teal)] font-bold">
                    {t('home.contact.btnAnother')}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-3xl font-bold text-[color:var(--dk)]">{t('home.contact.formTitle')}</h3>
                <p className="text-[color:var(--muted)] mt-2">{t('home.contact.formSub')}</p>

                <form onSubmit={handleContactSubmit} className="mt-8 grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">{t('home.contact.firstName')}</label>
                    <input 
                      name="firstName"
                      value={contactData.firstName}
                      onChange={handleContactChange}
                      required
                      className="w-full bg-[color:var(--bg)] border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--teal)]" 
                      placeholder="Sarah" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">{t('home.contact.lastName')}</label>
                    <input 
                      name="lastName"
                      value={contactData.lastName}
                      onChange={handleContactChange}
                      required
                      className="w-full bg-[color:var(--bg)] border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--teal)]" 
                      placeholder="Johnson" 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">{t('home.contact.emailLabel')}</label>
                    <input 
                      name="email"
                      type="email"
                      value={contactData.email}
                      onChange={handleContactChange}
                      required
                      className="w-full bg-[color:var(--bg)] border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--teal)]" 
                      placeholder="sarah@example.com" 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">{t('home.contact.messageLabel')}</label>
                    <textarea 
                      name="message"
                      value={contactData.message}
                      onChange={handleContactChange}
                      className="w-full bg-[color:var(--bg)] border border-black/10 rounded-xl px-4 py-3 h-28 resize-none focus:outline-none focus:border-[color:var(--teal)]" 
                      placeholder={t('home.contact.messagePlaceholder')} 
                    />
                  </div>
                  <div className="sm:col-span-2 mt-4">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-[color:var(--teal)] text-white py-4 rounded-xl font-bold text-lg hover:bg-[color:var(--dk)] transition-colors disabled:opacity-50"
                    >
                      {loading ? t('home.contact.btnSending') : t('home.contact.btnSend') + ' →'}
                    </button>
                  </div>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-wrap gap-4">
                  <Link to="/booking" className="text-[color:var(--teal)] font-bold hover:underline">
                    {t('home.contact.btnBooking')} →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
