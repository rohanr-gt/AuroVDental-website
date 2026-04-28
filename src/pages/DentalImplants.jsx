import React from 'react';
import ServicePage from '../components/ServicePage';
import { useLanguage } from '../contexts/LanguageContext';
import implantsBefore from '../images/dental implant before.png';
import implantsAfter from '../images/dental implant after.png';
import implantsBg from '../images/dental implant background.jpg';

import SEO from '../components/SEO';

const DentalImplants = () => {
  const { t } = useLanguage();
  const data = {
    title: t('dentalImplants.title'),
    subtitle: t('dentalImplants.subtitle'),
    heroImg: implantsBg,
    benefits: [
      { icon: "🏆", title: t('dentalImplants.benefit1Title'), desc: t('dentalImplants.benefit1Desc') },
      { icon: "👨‍⚕️", title: t('dentalImplants.benefit2Title'), desc: t('dentalImplants.benefit2Desc') },
      { icon: "💻", title: t('dentalImplants.benefit3Title'), desc: t('dentalImplants.benefit3Desc') },
      { icon: "💎", title: t('dentalImplants.benefit4Title'), desc: t('dentalImplants.benefit4Desc') },
      { icon: "🧼", title: t('dentalImplants.benefit5Title'), desc: t('dentalImplants.benefit5Desc') },
      { icon: "🤝", title: t('dentalImplants.benefit6Title'), desc: t('dentalImplants.benefit6Desc') }
    ],
    steps: [
      { title: t('dentalImplants.step1Title'), desc: t('dentalImplants.step1Desc') },
      { title: t('dentalImplants.step2Title'), desc: t('dentalImplants.step2Desc') },
      { title: t('dentalImplants.step3Title'), desc: t('dentalImplants.step3Desc') },
      { title: t('dentalImplants.step4Title'), desc: t('dentalImplants.step4Desc') },
      { title: t('dentalImplants.step5Title'), desc: t('dentalImplants.step5Desc') }
    ],
    journeyTitle: t('dentalImplants.customJourneyTitle'),
    outstationText: t('dentalImplants.outstationText'),
    afterImg: "https://www.sanmarcosdental.com/blog/wp-content/uploads/implant-diagram.jpeg"
  };

  return (
    <>
      <SEO 
        title="Dental Implants" 
        description="Replace missing teeth with permanent, bio-compatible dental implants. High-precision placement for a natural look and lifelong function."
        keywords="dental implants Bengaluru, titanium implants, tooth replacement, implantology, Auro V Dental"
      />
      <ServicePage {...data} />
    </>
  );
};

export default DentalImplants;
