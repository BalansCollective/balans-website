import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MedicalTimelineDemo } from '../../components/MedicalTimelineDemo';
import { GenericMedicineLog } from '../../components/GenericMedicineLog';
import { ButtonPanel } from '../../components/ButtonPanel';

export function MedicalPage() {
  const { t } = useTranslation('medical');
  const [showDemo, setShowDemo] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'medicine'>('timeline');

  return (
    <div className="min-h-screen bg-birch-white">
      {/* Hero Section */}
      <section className="alliance-pattern py-20 lg:py-32 bg-birch-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Left */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-swedish-blue dark:text-swedish-blue-dark leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-xl lg:text-2xl text-swedish-blue dark:text-swedish-blue-dark leading-relaxed opacity-80">
                {t('hero.subtitle')}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-start">
                <a 
                  href="#demo"
                  className="inline-flex items-center justify-center px-6 py-3 bg-alliance-purple hover:bg-alliance-purple/90 text-white font-medium rounded-lg transition-colors"
                >
                  {t('demo.start_button')}
                </a>
                <a 
                  href="mailto:samuel@dynorobotics.se?subject=Betatest BalansAI"
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent hover:bg-white/5 text-truth-copper border-2 border-truth-copper font-medium rounded-lg transition-colors"
                >
                  {t('cta.buttons.betatest')}
                </a>
              </div>
            </div>
            
            {/* Hero Image Right */}
            <div className="relative">
              <img 
                src="/images/medical-hero.png" 
                alt={t('hero.title')}
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Facts + Share Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Quick Facts */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
              <div className="text-3xl font-bold text-sage-green mb-2">🏠 {t('facts.local.title')}</div>
              <div className="text-gray-600">{t('facts.local.subtitle')}</div>
              <div className="text-sm text-gray-500 mt-1">{t('facts.local.description')}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
              <div className="text-3xl font-bold text-swedish-blue mb-2">👨‍👩‍👧 {t('facts.family.title')}</div>
              <div className="text-gray-600">{t('facts.family.subtitle')}</div>
              <div className="text-sm text-gray-500 mt-1">{t('facts.family.description')}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
              <div className="text-3xl font-bold text-truth-copper mb-2">🔒 {t('facts.secure.title')}</div>
              <div className="text-gray-600">{t('facts.secure.subtitle')}</div>
              <div className="text-sm text-gray-500 mt-1">{t('facts.secure.description')}</div>
            </div>
          </div>

          {/* What You Can Share */}
          <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-swedish-blue mb-4 text-center">{t('share.title')}</h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💊</span>
                <div>
                  <p className="font-semibold">{t('share.medication.title')}</p>
                  <p className="text-sm">{t('share.medication.description')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-semibold">{t('share.care_plans.title')}</p>
                  <p className="text-sm">{t('share.care_plans.description')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-semibold">{t('share.timelines.title')}</p>
                  <p className="text-sm">{t('share.timelines.description')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-semibold">{t('share.warnings.title')}</p>
                  <p className="text-sm">{t('share.warnings.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-swedish-blue mb-6">
              {t('demo.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('demo.description')}
            </p>
          </div>

          {!showDemo ? (
            <div className="text-center">
              <button
                onClick={() => setShowDemo(true)}
                className="px-8 py-4 bg-sage-green text-white rounded-full font-bold text-lg hover:bg-sage-green/90 transition-colors shadow-lg"
              >
                {t('demo.start_button')}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Tab Selector */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-6 py-3 rounded-full font-medium transition-colors ${
                    activeTab === 'timeline'
                      ? 'bg-sage-green text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  📊 Tidslinje & Mönster
                </button>
                <button
                  onClick={() => setActiveTab('medicine')}
                  className={`px-6 py-3 rounded-full font-medium transition-colors ${
                    activeTab === 'medicine'
                      ? 'bg-sage-green text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  💊 Medicin-logg
                </button>
              </div>

              {/* Demo Content */}
              {activeTab === 'timeline' ? (
                <div className="bg-gray-50 rounded-2xl border-2 border-sage-green">
                  <MedicalTimelineDemo />
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl border-2 border-sage-green overflow-hidden" style={{ maxHeight: '800px' }}>
                  <div className="h-full overflow-y-auto">
                    <GenericMedicineLog />
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <button
                  onClick={() => setShowDemo(false)}
                  className="px-6 py-3 border-2 border-sage-green text-sage-green rounded-full font-medium hover:bg-sage-green/10 transition-colors"
                >
                  {t('demo.close_button')}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-sage-green text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-white mb-4 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <ul className="text-lg text-white mb-8 max-w-2xl mx-auto text-left list-disc pl-6">
            <li>{t('cta.list.item1')}</li>
            <li>{t('cta.list.item2')}</li>
            <li>{t('cta.list.item3')}</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a 
              href="https://balans-collective.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-sage-green px-8 py-4 rounded-full font-bold text-lg hover:bg-birch-white transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {t('cta.buttons.demo')}
            </a>
            <a 
              href="mailto:samuel@dynorobotics.se?subject=Betatest BalansAI" 
              className="bg-white text-sage-green px-8 py-4 rounded-full font-bold text-lg hover:bg-birch-white transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {t('cta.buttons.betatest')}
            </a>
          </div>
          <div className="text-sm text-white space-y-1">
            <p>✅ {t('cta.benefits.free')}</p>
            <p>✅ {t('cta.benefits.gdpr')}</p>
            <p>✅ {t('cta.benefits.ownership')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

