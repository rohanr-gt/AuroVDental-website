import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const AssessmentPage = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    smile: '',
    teeth: '',
    missingTeeth: 0,
    brushing: 'twice',
    issue: ''
  });
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const submitAssessment = async () => {
    setLoading(true);
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
    try {
      // 1. Get recommendation from local API
      const response = await axios.post(`${API_BASE}/api/recommend-treatment`, { answers });
      setRecommendation(response.data);

      // 2. Send notification to Web3Forms
      await axios.post('https://api.web3forms.com/submit', {
        access_key: '8f11e73a-2e5f-4578-bb73-52c99d93155f',
        subject: `New Smile Assessment Completed`,
        from_name: 'Auro V Dental Website',
        confirm_email: 'true',
        replyto: 'cursorhalesh@gmail.com',
        name: 'Patient Assessment User',
        recommendation: response.data.recommendedTreatment,
        ...answers
      }, {
        headers: {
          'Accept': 'application/json'
        }
      });

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gradient-to-b from-[color:var(--soft)] to-white">
      <SEO 
        title="Free Smile Assessment" 
        description="Take our 1-minute smile assessment quiz to get a personalized dental treatment recommendation and cost estimate. Free for all patients."
        keywords="smile quiz, dental assessment, free dental advice, smile makeover quiz, Auro V Dental"
      />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-[color:var(--dk)] mb-4">
            {recommendation ? t('assessment.resultTitle') : t('assessment.quizTitle')}
          </h1>
          <p className="text-[color:var(--muted)] text-lg">
            {recommendation ? t('assessment.resultSub') : t('assessment.subtitle')}
          </p>
        </div>

        {recommendation ? (
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-black/5">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-3xl font-serif font-bold text-[color:var(--dk)] mb-4">
                {t('assessment.recTitle')}
              </h2>
              <p className="text-xl font-bold text-[color:var(--teal)] mb-8">
                {recommendation.recommendedTreatment}
              </p>
            </div>

            <div className="bg-[color:var(--soft)] rounded-2xl p-6 mb-8 grid md:grid-cols-3 gap-6 border border-black/5">
              <div className="text-center">
                <div className="text-3xl font-bold text-[color:var(--dk)] mb-2">
                  ${recommendation.estimatedCost?.toLocaleString()}
                </div>
                <p className="text-[color:var(--muted)]">{t('assessment.estCost')}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[color:var(--dk)] mb-2">
                  {recommendation.timeframe}
                </div>
                <p className="text-[color:var(--muted)]">{t('assessment.duration')}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[color:var(--dk)] mb-2">
                  95%+
                </div>
                <p className="text-[color:var(--muted)]">{t('assessment.successRate')}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[color:var(--teal)] to-[color:var(--dk)] rounded-2xl p-6 text-white mb-8">
              <h3 className="font-bold text-lg mb-4">{t('assessment.nextSteps')}</h3>
              <ul className="space-y-3">
                <li>✅ {t('assessment.step1')}</li>
                <li>✅ {t('assessment.step2')}</li>
                <li>✅ {t('assessment.step3')}</li>
                <li>✅ {t('assessment.step4')}</li>
              </ul>
            </div>

            <div className="flex gap-4 flex-col md:flex-row">
              <button
                onClick={() => {
                  setRecommendation(null);
                  setStep(1);
                  setAnswers({ smile: '', teeth: '', missingTeeth: 0, brushing: 'twice', issue: '' });
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                {t('assessment.retakeBtn')}
              </button>
              <Link
                to="/booking"
                className="flex-1 bg-[color:var(--teal)] text-white py-3 rounded-xl font-bold hover:bg-[color:var(--dk)] transition text-center"
              >
                {t('assessment.bookConsultBtn')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-black/5">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <span className="text-sm font-bold text-[color:var(--teal)]">{t('assessment.questionCount').replace('{step}', step)}</span>
                <span className="text-sm font-bold text-gray-500">{Math.round((step / 5) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[color:var(--teal)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-[color:var(--dk)] mb-6">{t('assessment.q1Title')}</h2>
                <div className="space-y-4">
                  {[
                    { value: 'very-happy', label: t('assessment.q1Option1'), classes: 'bg-green-100 border-green-600 text-green-900' },
                    { value: 'somewhat-happy', label: t('assessment.q1Option2'), classes: 'bg-yellow-100 border-yellow-600 text-yellow-900' },
                    { value: 'not-happy', label: t('assessment.q1Option3'), classes: 'bg-red-100 border-red-600 text-red-900' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer('smile', option.value)}
                      className={`w-full p-4 rounded-xl font-bold border-2 transition text-left ${
                        answers.smile === option.value
                          ? option.classes
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-[color:var(--teal)]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-[color:var(--dk)] mb-6">{t('assessment.q2Title')}</h2>
                <div className="space-y-4">
                  {[
                    { value: 'perfect', label: t('assessment.q2Option1'), emoji: '😁' },
                    { value: 'crooked', label: t('assessment.q2Option2'), emoji: '↔️' },
                    { value: 'discolored', label: t('assessment.q2Option3'), emoji: '🟡' },
                    { value: 'chipped', label: t('assessment.q2Option4'), emoji: '⚠️' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer('teeth', option.value)}
                      className={`w-full p-4 rounded-xl font-bold border-2 transition text-left text-lg ${
                        answers.teeth === option.value
                          ? 'bg-[color:var(--soft)] border-[color:var(--teal)] text-[color:var(--dk)]'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-[color:var(--teal)]'
                      }`}
                    >
                      {option.emoji} {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-[color:var(--dk)] mb-6">Do you have any missing teeth?</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <input
                        type="range"
                        min="0"
                        max="32"
                        value={answers.missingTeeth}
                        onChange={(e) => handleAnswer('missingTeeth', parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[color:var(--teal)]"
                      />
                      <span className="text-3xl font-bold text-[color:var(--teal)] w-12 text-center">{answers.missingTeeth}</span>
                    </div>
                    <p className="text-gray-600 text-sm">Slide to indicate number of missing teeth</p>
                  </div>
                  <div className="bg-[color:var(--soft)] p-6 rounded-xl border border-black/5">
                    <p className="text-lg font-bold text-[color:var(--dk)]">
                      {answers.missingTeeth === 0
                        ? t('assessment.q3None')
                        : answers.missingTeeth < 5
                        ? t('assessment.q3Few').replace('{count}', answers.missingTeeth)
                        : t('assessment.q3Many').replace('{count}', answers.missingTeeth)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-[color:var(--dk)] mb-6">How often do you brush your teeth?</h2>
                <div className="space-y-4">
                  {[
                    { value: 'twice', label: t('assessment.q4Option1') },
                    { value: 'once', label: t('assessment.q4Option2') },
                    { value: 'rarely', label: t('assessment.q4Option3') }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer('brushing', option.value)}
                      className={`w-full p-4 rounded-xl font-bold border-2 transition text-left ${
                        answers.brushing === option.value
                          ? 'bg-[color:var(--soft)] border-[color:var(--teal)] text-[color:var(--dk)]'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-[color:var(--teal)]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <div>
                <h2 className="text-2xl font-bold text-[color:var(--dk)] mb-6">{t('assessment.q5Title')}</h2>
                <textarea
                  value={answers.issue}
                  onChange={(e) => handleAnswer('issue', e.target.value)}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[color:var(--teal)] resize-none"
                  placeholder={t('assessment.q5Placeholder')}
                ></textarea>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-10">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition disabled:opacity-50"
              >
                ← {t('assessment.backBtn')}
              </button>
              {step < 5 ? (
                <button
                  onClick={nextStep}
                  disabled={
                    (step === 1 && !answers.smile) ||
                    (step === 2 && !answers.teeth) ||
                    (step === 3 && answers.missingTeeth === undefined) ||
                    (step === 4 && !answers.brushing)
                  }
                  className="flex-1 bg-[color:var(--teal)] text-white py-3 rounded-xl font-bold hover:bg-[color:var(--dk)] transition disabled:opacity-50"
                >
                  {t('assessment.nextBtn')} →
                </button>
              ) : (
                <button
                  onClick={submitAssessment}
                  disabled={loading}
                  className="flex-1 bg-[color:var(--teal)] text-white py-3 rounded-xl font-bold hover:bg-[color:var(--dk)] transition disabled:opacity-50"
                >
                  {loading ? t('assessment.processBtn') : t('assessment.getRecBtn')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;
