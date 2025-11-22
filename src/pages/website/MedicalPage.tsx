import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MedicalTimeline } from '../../components/MedicalTimeline';
import { ButtonPanel } from '../../components/ButtonPanel';

export function MedicalPage() {
  const { t } = useTranslation('medical');
  const [showFullStory, setShowFullStory] = useState(false);
  const [showProtocols, setShowProtocols] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-birch-white">
      {/* Hero Section */}
      <section className="pt-24 py-16 px-4 bg-gradient-to-br from-birch-white to-sage-green/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-swedish-blue mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-birch-wood mb-4 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('hero.description')}
            </p>
          </div>

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

      {/* Case Study */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-swedish-blue mb-4 text-center">
            {t('case_study.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center">
            {t('case_study.subtitle')}
          </p>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Quick Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-birch-white to-truth-copper/10 p-6 rounded-xl shadow-md text-center">
                <div className="text-4xl mb-3">❌</div>
                <h3 className="font-bold text-truth-copper mb-2">{t('case_study.summary.problem.title')}</h3>
                <p className="text-sm text-gray-700">{t('case_study.summary.problem.description')}</p>
              </div>
              <div className="bg-gradient-to-br from-birch-white to-swedish-blue/10 p-6 rounded-xl shadow-md text-center">
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="font-bold text-swedish-blue mb-2">{t('case_study.summary.solution.title')}</h3>
                <p className="text-sm text-gray-700">{t('case_study.summary.solution.description')}</p>
              </div>
              <div className="bg-gradient-to-br from-birch-white to-sage-green/10 p-6 rounded-xl shadow-md text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-bold text-sage-green mb-2">{t('case_study.summary.result.title')}</h3>
                <p className="text-sm text-gray-700">{t('case_study.summary.result.description')}</p>
              </div>
            </div>

            {/* Collapsible: Full Story */}
            <div className="mb-8">
              <button
                onClick={() => setShowFullStory(!showFullStory)}
                className="w-full text-center cursor-pointer font-bold text-2xl text-swedish-blue hover:text-alliance-purple transition-colors duration-300"
              >
                📖 {showFullStory ? t('case_study.full_story.hide') : t('case_study.full_story.show')}
              </button>
              
              {showFullStory && (
                <div className="space-y-8 mt-6">
                  {/* The Problem */}
                  <div className="bg-gradient-to-br from-birch-white to-truth-copper/10 p-8 rounded-2xl shadow-md">
                    <h3 className="text-2xl font-bold text-truth-copper mb-4">
                      {t('case_study.problem.title')}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="font-bold text-lg mb-2">{t('case_study.problem.patient.title')}:</p>
                        <ul className="space-y-2 text-gray-700">
                          <li>• {t('case_study.problem.patient.symptom1')}</li>
                          <li>• {t('case_study.problem.patient.symptom2')}</li>
                          <li>• {t('case_study.problem.patient.symptom3')}</li>
                          <li>• {t('case_study.problem.patient.symptom4')}</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-bold text-lg mb-2">{t('case_study.problem.family.title')}:</p>
                        <ul className="space-y-2 text-gray-700">
                          <li>• {t('case_study.problem.family.issue1')}</li>
                          <li>• {t('case_study.problem.family.issue2')}</li>
                          <li>• {t('case_study.problem.family.issue3')}</li>
                          <li>• {t('case_study.problem.family.issue4')}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-white border-l-4 border-truth-copper rounded">
                      <p className="text-gray-700">
                        <strong>{t('case_study.problem.result.label')}:</strong> {t('case_study.problem.result.text')}
                      </p>
                    </div>
                  </div>

                  {/* AI-Generated Protocols */}
                  <div className="bg-gradient-to-br from-birch-white to-swedish-blue/10 p-8 rounded-2xl shadow-md">
                    <h3 className="text-2xl font-bold text-swedish-blue mb-4">
                      {t('case_study.solution.title')}
                    </h3>
                    <p className="text-gray-700 mb-6">
                      {t('case_study.solution.description')}
                    </p>
                    
                    {/* Protocol Examples */}
                    <button
                      onClick={() => setShowProtocols(!showProtocols)}
                      className="font-bold text-lg text-swedish-blue mb-3 hover:text-alliance-purple transition-colors duration-300"
                    >
                      📋 {showProtocols ? t('case_study.protocols.hide') : t('case_study.protocols.show')}
                    </button>
                    
                    {showProtocols && (
                      <div className="grid md:grid-cols-2 gap-6 mt-4">
                        <div className="border-2 border-sage-green rounded-lg p-4 bg-white">
                          <h4 className="font-bold text-sage-green mb-3">{t('case_study.protocols.family.title')}</h4>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li>✅ {t('case_study.protocols.family.item1')}</li>
                            <li>✅ {t('case_study.protocols.family.item2')}</li>
                            <li>✅ {t('case_study.protocols.family.item3')}</li>
                            <li>✅ {t('case_study.protocols.family.item4')}</li>
                          </ul>
                        </div>
                        <div className="border-2 border-alliance-purple rounded-lg p-4 bg-white">
                          <h4 className="font-bold text-alliance-purple mb-3">{t('case_study.protocols.colleague.title')}</h4>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li>✅ {t('case_study.protocols.colleague.item1')}</li>
                            <li>✅ {t('case_study.protocols.colleague.item2')}</li>
                            <li>✅ {t('case_study.protocols.colleague.item3')}</li>
                            <li>✅ {t('case_study.protocols.colleague.item4')}</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-sage-green/20 border-l-4 border-sage-green rounded mt-4">
                      <p className="text-gray-700">
                        <strong>{t('case_study.solution.key_point.label')}:</strong> {t('case_study.solution.key_point.text')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Juni 2025 Validation (Always Visible) */}
            <div className="bg-gradient-to-br from-birch-white to-sage-green/10 p-8 rounded-2xl shadow-md">
              <h3 className="text-2xl font-bold text-truth-copper mb-4">
                {t('case_study.validation.title')}
              </h3>
              <p className="text-gray-700 mb-4">
                <strong>{t('case_study.validation.what_happened.label')}:</strong> {t('case_study.validation.what_happened.text')}
              </p>
              <p className="text-gray-700 mb-6">
                <strong>{t('case_study.validation.hypothesis.label')}:</strong> {t('case_study.validation.hypothesis.text')}
              </p>
              
              <div className="space-y-3 mb-6">
                {[
                  { title: t('case_study.validation.results.stabilization.title'), subtitle: t('case_study.validation.results.stabilization.subtitle') },
                  { title: t('case_study.validation.results.adherence.title'), subtitle: t('case_study.validation.results.adherence.subtitle') },
                  { title: t('case_study.validation.results.empowerment.title'), subtitle: t('case_study.validation.results.empowerment.subtitle') },
                  { title: t('case_study.validation.results.autonomy.title'), subtitle: t('case_study.validation.results.autonomy.subtitle') }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-bold">{item.title}</p>
                      <p className="text-gray-600 text-sm">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison Timeline Image */}
              <div className="mb-6">
                <img 
                  src="/images/medical-june-2025-activation-timeline.png" 
                  alt={t('case_study.validation.timeline_alt')}
                  className="w-full rounded-xl shadow-md"
                />
                <p className="text-sm text-gray-600 mt-2 text-center italic">
                  {t('case_study.validation.timeline_caption')}
                </p>
              </div>

              <div className="p-4 bg-blue-100 border-2 border-swedish-blue rounded-lg">
                <p className="font-bold text-swedish-blue text-lg mb-2">
                  {t('case_study.validation.proven.title')}
                </p>
                <p className="text-gray-700 text-sm">
                  {t('case_study.validation.proven.description')}
                </p>
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
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-sage-green">
                <MedicalTimeline />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-sage-green">
                  <h3 className="text-2xl font-bold text-swedish-blue mb-4">{t('demo.quick_buttons.title')}</h3>
                  <p className="text-gray-600 mb-6">{t('demo.quick_buttons.description')}</p>
                  <ButtonPanel />
                </div>
                
                <div className="bg-gradient-to-br from-sage-green/10 to-white rounded-xl shadow-lg p-6 border-2 border-sage-green">
                  <h3 className="text-2xl font-bold text-swedish-blue mb-4">{t('demo.how_it_works.title')}</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <p className="font-semibold">{t('demo.how_it_works.realtime.title')}</p>
                        <p className="text-sm">{t('demo.how_it_works.realtime.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🤖</span>
                      <div>
                        <p className="font-semibold">{t('demo.how_it_works.ai.title')}</p>
                        <p className="text-sm">{t('demo.how_it_works.ai.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">👨‍⚕️</span>
                      <div>
                        <p className="font-semibold">{t('demo.how_it_works.shareable.title')}</p>
                        <p className="text-sm">{t('demo.how_it_works.shareable.description')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
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

