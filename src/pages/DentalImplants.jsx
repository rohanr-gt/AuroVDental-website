import React from 'react';
import ServicePage from '../components/ServicePage';
import { useLanguage } from '../contexts/LanguageContext';
import implantsBefore from '../images/dental implant before.png';
import implantsAfter from '../images/dental implant after.png';
import implantsBg from '../images/dental implant background.jpg';

const DentalImplants = () => {
  const { t } = useLanguage();
  const data = {
    title: t('dentalImplants.title'),
    subtitle: t('dentalImplants.subtitle'),
    heroImg: implantsBg,
    benefits: [
      { icon: "🛡️", title: t('dentalImplants.benefit1Title'), desc: t('dentalImplants.benefit1Desc') },
      { icon: "🥩", title: t('dentalImplants.benefit2Title'), desc: t('dentalImplants.benefit2Desc') },
      { icon: "🦴", title: t('dentalImplants.benefit3Title'), desc: t('dentalImplants.benefit3Desc') }
    ],
    steps: [
      { title: t('dentalImplants.step1Title'), desc: t('dentalImplants.step1Desc') },
      { title: t('dentalImplants.step2Title'), desc: t('dentalImplants.step2Desc') },
      { title: t('dentalImplants.step3Title'), desc: t('dentalImplants.step3Desc') },
      { title: t('dentalImplants.step4Title'), desc: t('dentalImplants.step4Desc') }
    ],
    afterImg: "https://www.sanmarcosdental.com/blog/wp-content/uploads/implant-diagram.jpeg"
  };

  return <ServicePage {...data} />;
};

export default DentalImplants;
