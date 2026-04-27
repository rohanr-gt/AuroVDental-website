import React from 'react';
import ServicePage from '../components/ServicePage';
import { useLanguage } from '../contexts/LanguageContext';
import smileDesignBefore from '../images/smile design before.png';
import smileDesignAfter from '../images/smile design after.png';
import smileDesignBg from '../images/smile desighning background.png';

const SmileDesigning = () => {
  const { t } = useLanguage();
  const data = {
    title: t('smileDesigning.title'),
    subtitle: t('smileDesigning.subtitle'),
    heroImg: smileDesignBg,
    benefits: [
      { icon: "🎨", title: t('smileDesigning.benefit1Title'), desc: t('smileDesigning.benefit1Desc') },
      { icon: "🔬", title: t('smileDesigning.benefit2Title'), desc: t('smileDesigning.benefit2Desc') },
      { icon: "⚡", title: t('smileDesigning.benefit3Title'), desc: t('smileDesigning.benefit3Desc') }
    ],
    steps: [
      { title: t('smileDesigning.step1Title'), desc: t('smileDesigning.step1Desc') },
      { title: t('smileDesigning.step2Title'), desc: t('smileDesigning.step2Desc') },
      { title: t('smileDesigning.step3Title'), desc: t('smileDesigning.step3Desc') },
      { title: t('smileDesigning.step4Title'), desc: t('smileDesigning.step4Desc') }
    ],
    afterImg: "https://parthadental.com/wp-content/uploads/2022/09/cosmetic-dentistry-750x750.jpg"
  };

  return <ServicePage {...data} />;
};

export default SmileDesigning;
