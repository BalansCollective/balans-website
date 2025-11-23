import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigation } from '@/components/Navigation';

export function ContactPage() {
  const { t } = useTranslation('contact');

  return (
    <div className="min-h-screen bg-birch-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 lg:px-12 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl lg:text-6xl font-display font-bold text-swedish-blue mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 lg:p-12 space-y-8">
          {/* Email Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-swedish-blue mb-4">
              {t('email.title')}
            </h2>
            <a 
              href="mailto:samuel@dynorobotics.se"
              className="inline-block text-2xl font-semibold text-sage-green hover:text-sage-green/80 transition-colors"
            >
              samuel@dynorobotics.se
            </a>
          </div>

          {/* Sections */}
          <div className="space-y-6 mt-12">
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-swedish-blue mb-3">
                {t('sections.family.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.family.description')}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-swedish-blue mb-3">
                {t('sections.medical.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.medical.description')}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-swedish-blue mb-3">
                {t('sections.defense.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.defense.description')}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-swedish-blue mb-3">
                {t('sections.other.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('sections.other.description')}
              </p>
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-sage-green/10 rounded-lg p-6 mt-8">
            <p className="text-gray-700 text-center">
              {t('response_time')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

