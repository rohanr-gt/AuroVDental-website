import React from 'react';
import ServicePage from '../components/ServicePage';
import { useLanguage } from '../contexts/LanguageContext';
import smileDesignBefore from '../images/smile design before.png';
import smileDesignAfter from '../images/smile design after.png';
import smileDesignBg from '../images/smile desighning background.png';

import SEO from '../components/SEO';

const SmileDesigning = () => {
  const { t } = useLanguage();
  const data = {
    title: t('smileDesigning.title'),
    subtitle: t('smileDesigning.subtitle'),
    heroImg: smileDesignBg,
    benefits: [
      { icon: "🏆", title: t('smileDesigning.benefit1Title'), desc: t('smileDesigning.benefit1Desc') },
      { icon: "👨‍⚕️", title: t('smileDesigning.benefit2Title'), desc: t('smileDesigning.benefit2Desc') },
      { icon: "💻", title: t('smileDesigning.benefit3Title'), desc: t('smileDesigning.benefit3Desc') },
      { icon: "💎", title: t('smileDesigning.benefit4Title'), desc: t('smileDesigning.benefit4Desc') },
      { icon: "🧼", title: t('smileDesigning.benefit5Title'), desc: t('smileDesigning.benefit5Desc') },
      { icon: "🤝", title: t('smileDesigning.benefit6Title'), desc: t('smileDesigning.benefit6Desc') }
    ],
    steps: [
      { title: t('smileDesigning.step1Title'), desc: t('smileDesigning.step1Desc') },
      { title: t('smileDesigning.step2Title'), desc: t('smileDesigning.step2Desc') },
      { title: t('smileDesigning.step3Title'), desc: t('smileDesigning.step3Desc') },
      { title: t('smileDesigning.step4Title'), desc: t('smileDesigning.step4Desc') },
      { title: t('smileDesigning.step5Title'), desc: t('smileDesigning.step5Desc') }
    ],
    journeyTitle: t('smileDesigning.customJourneyTitle'),
    outstationText: t('smileDesigning.outstationText'),
    afterImg: "https://parthadental.com/wp-content/uploads/2022/09/cosmetic-dentistry-750x750.jpg"
  };

  return (
    <>
      <SEO 
        title="Digital Smile Designing" 
        description="Transform your smile with Digital Smile Designing (DSD). Preview your perfect smile with 3D planning and expert aesthetic dentistry."
        keywords="smile design, aesthetic dentistry, veneers, cosmetic dentist Bengaluru, DSD"
      />
      <ServicePage {...data} />
    </>
  );
};

export default SmileDesigning;
