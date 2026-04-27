import React from 'react';
import ServicePage from '../components/ServicePage';
import { useLanguage } from '../contexts/LanguageContext';
import alignersBefore from '../images/braces and aligners before.png';
import alignersAfter from '../images/braces and aligners after.png';
import alignersBg from '../images/braces and aligners background.jpg';

const AlignersBraces = () => {
  const { t } = useLanguage();
  const data = {
    title: t('alignersBraces.title'),
    subtitle: t('alignersBraces.subtitle'),
    heroImg: alignersBg,
    benefits: [
      { icon: "✨", title: t('alignersBraces.benefit1Title'), desc: t('alignersBraces.benefit1Desc') },
      { icon: "🥗", title: t('alignersBraces.benefit2Title'), desc: t('alignersBraces.benefit2Desc') },
      { icon: "📉", title: t('alignersBraces.benefit3Title'), desc: t('alignersBraces.benefit3Desc') }
    ],
    steps: [
      { title: t('alignersBraces.step1Title'), desc: t('alignersBraces.step1Desc') },
      { title: t('alignersBraces.step2Title'), desc: t('alignersBraces.step2Desc') },
      { title: t('alignersBraces.step3Title'), desc: t('alignersBraces.step3Desc') },
      { title: t('alignersBraces.step4Title'), desc: t('alignersBraces.step4Desc') }
    ],
    afterImg: "https://dentistry.uic.edu/wp-content/uploads/sites/741/2020/10/iStock-501427146-1090x595.jpg"
  };

  return <ServicePage {...data} />;
};

export default AlignersBraces;
