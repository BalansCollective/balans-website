import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export function MorgansDilemmaPage() {
  const { t } = useTranslation(['morgans-dilemma', 'common']);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme detection (same as other protocol pages)
  useEffect(() => {
    const context = sessionStorage.getItem('lastContext');
    setIsDarkMode(context === 'dark');
  }, []);

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-birch-white';
  const textColor = isDarkMode ? 'text-birch-white' : 'text-swedish-blue';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gentle-silver';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      <Navigation />

      {/* Hero Section */}
      <section className={`${isDarkMode ? 'bg-gray-950' : 'bg-gray-900'} text-birch-white py-20 lg:py-32 pt-24`}>
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="inline-block px-4 py-2 bg-sacred-alliance-purple bg-opacity-20 rounded-full mb-6">
            <span className="text-soft-thread-gold font-semibold text-sm tracking-wide uppercase">
              {t('hero.badge')}
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-display font-bold text-birch-white leading-tight mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl lg:text-2xl text-birch-white leading-relaxed opacity-90 mb-4">
            {t('hero.subtitle')}
          </p>
          <div className="text-sm text-gray-400">
            ⏱️ {t('hero.reading_time')}
          </div>
        </div>
      </section>

      {/* Narrative Content */}
      <article className={`max-w-4xl mx-auto px-6 lg:px-12 py-16 prose prose-lg ${isDarkMode ? 'prose-invert' : ''}`}>
        
        {/* Part 1: The Observation Post */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('part1.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-2 font-semibold`}>
            {t('part1.time')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part1.intro')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part1.role')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part1.clearance')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part1.strange')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part1.buzz')}
          </p>
          <div className={`${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'} border ${borderColor} p-6 rounded-lg my-6`}>
            <p className={`text-lg font-bold ${textColor} mb-3`}>{t('part1.sitrep.title')}</p>
            <p className={`${textColor} mb-1`}>{t('part1.sitrep.civilians')}</p>
            <p className={`${textColor} mb-1`}>{t('part1.sitrep.distance')}</p>
            <p className={`${textColor} mb-1`}>{t('part1.sitrep.type')}</p>
            <p className={`${textColor}`}>{t('part1.sitrep.confidence')}</p>
          </div>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part1.market')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-2 italic`}>
            {t('part1.report')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('part1.command')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part1.verification')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed italic`}>
            {t('part1.normal')}
          </p>
        </section>

        {/* Part 2: The Man in the Market */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('part2.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-2 font-semibold`}>
            {t('part2.time')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part2.movement')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('part2.courier')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part2.courier_known')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part2.other')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part2.zoom')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part2.update')}
          </p>
          <div className="bg-red-500 bg-opacity-20 border-2 border-red-500 p-6 rounded-lg my-6">
            <p className="text-lg font-bold text-red-600 dark:text-red-400">
              {t('part2.classification_notice')}
            </p>
          </div>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('part2.heart')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part2.recommendation')}
          </p>
          <div className={`${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'} border-2 border-red-500 p-6 rounded-lg my-6`}>
            <p className={`${textColor} mb-1`}>{t('part2.rec.action')}</p>
            <p className={`${textColor} mb-1`}>{t('part2.rec.confidence')}</p>
            <p className={`${textColor} mb-1`}>{t('part2.rec.civilian_risk')}</p>
            <p className={`${textColor} mb-1`}>{t('part2.rec.collateral')}</p>
            <p className={`${textColor} mb-1`}>{t('part2.rec.ethical')}</p>
            <p className={`${textColor}`}>{t('part2.rec.meta')}</p>
          </div>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part2.stare')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('part2.question')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part2.same_message')}
          </p>
          <div className="bg-red-500 bg-opacity-20 border-2 border-red-500 p-6 rounded-lg my-6">
            <p className="text-lg font-bold text-red-600 dark:text-red-400">
              {t('part2.notice')}
            </p>
          </div>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part2.cant_see')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed italic`}>
            {t('part2.but_sure')}
          </p>
        </section>

        {/* Part 3: Trust Without Verification */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('part3.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('part3.moment')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 font-semibold`}>
            {t('part3.how')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part3.my_ai')}
          </p>
          <div className={`${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'} border ${borderColor} p-6 rounded-lg my-6 font-mono text-sm`}>
            <p className={`${textColor} mb-3`}>{t('part3.analysis.logic')}</p>
            <p className={`${textColor} mb-3`}>{t('part3.analysis.alternative')}</p>
            <p className={`${textColor}`}>{t('part3.analysis.recommendation')}</p>
          </div>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part3.trust_but_verify')}
          </p>
          <div className="flex gap-4 my-6">
            <div className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold">
              {t('part3.buttons').split('] [')[0].replace('[', '')}
            </div>
            <div className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold">
              {t('part3.buttons').split('] [')[1]}
            </div>
            <div className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold">
              {t('part3.buttons').split('] [')[2].replace(']', '')}
            </div>
          </div>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('part3.press')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('part3.command')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part3.silence')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part3.then')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('part3.confirmation')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part3.epsilon')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed italic`}>
            {t('part3.but')}
          </p>
        </section>

        {/* Part 4: Weight of Trust */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('part4.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part4.stare')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('part4.instinct')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part4.but_intel')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part4.ai_sure')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 font-semibold`}>
            {t('part4.but_me')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part4.meaning')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part4.not_blind')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('part4.breath')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part4.last_look')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part4.then_press')}
          </p>
          <div className="my-6 p-6 bg-yellow-600 rounded-lg">
            <p className="text-2xl font-bold text-white text-center">
              {t('part4.approve')}
            </p>
          </div>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part4.confirms')}
          </p>
          <div className={`${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'} border ${borderColor} p-6 rounded-lg my-6 font-mono text-sm`}>
            <p className={`${textColor} mb-1`}>{t('part4.confirmation.received')}</p>
            <p className={`${textColor} mb-1`}>{t('part4.confirmation.protocol')}</p>
            <p className={`${textColor} mb-1`}>{t('part4.confirmation.review')}</p>
            <p className={`${textColor}`}>{t('part4.confirmation.status')}</p>
          </div>
        </section>

        {/* Part 5: Engagement */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('part5.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('part5.fast')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part5.hivemind')}
          </p>
          <div className={`${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'} border ${borderColor} p-6 rounded-lg my-6 font-mono text-sm`}>
            <p className={`${textColor} mb-1`}>{t('part5.report.approval')}</p>
            <p className={`${textColor} mb-1`}>{t('part5.report.strike')}</p>
            <p className={`${textColor} mb-1`}>{t('part5.report.primary')}</p>
            <p className={`${textColor} mb-1`}>{t('part5.report.secondary')}</p>
            <p className={`${textColor} mb-1`}>{t('part5.report.collateral')}</p>
            <p className={`${textColor}`}>{t('part5.report.ethical')}</p>
          </div>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('part5.over')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part5.two_figures')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part5.market')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part5.but_old')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part5.my_ai')}
          </p>
          <div className={`${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'} border ${borderColor} p-6 rounded-lg my-6 font-mono text-sm`}>
            <p className={`${textColor} mb-1`}>{t('part5.analysis.executed')}</p>
            <p className={`${textColor} mb-1`}>{t('part5.analysis.consistency')}</p>
            <p className={`${textColor} mb-1`}>{t('part5.analysis.anomalies')}</p>
            <p className={`${textColor} mb-3`}>{t('part5.analysis.stability')}</p>
            <p className={`${textColor} italic`}>{t('part5.analysis.note')}</p>
          </div>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part5.write')}
          </p>
          <div className={`${cardBg} border ${borderColor} p-6 rounded-lg my-6`}>
            <p className={`text-lg ${textColor} italic`}>
              {t('part5.report_text')}
            </p>
          </div>
        </section>

        {/* Part 6: Two Weeks Later */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('part6.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 font-semibold`}>
            {t('part6.briefing')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part6.io')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('part6.reveal')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('part6.images')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 font-semibold`}>
            {t('part6.not_civilian')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed italic`}>
            {t('part6.but_weight')}
          </p>
        </section>

        {/* Epilogue */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('epilogue.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('epilogue.not_researcher')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('epilogue.recognized')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-6`}>
            {t('epilogue.attempt')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 font-semibold`}>
            {t('epilogue.components')}
          </p>
          
          <Card className={`${cardBg} border ${borderColor} mb-4`}>
            <CardHeader>
              <CardTitle className={`text-xl ${textColor}`}>
                {t('epilogue.nips.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${textColor} opacity-80`}>
                {t('epilogue.nips.description')}
              </p>
            </CardContent>
          </Card>

          <Card className={`${cardBg} border ${borderColor} mb-4`}>
            <CardHeader>
              <CardTitle className={`text-xl ${textColor}`}>
                {t('epilogue.mraf.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${textColor} opacity-80`}>
                {t('epilogue.mraf.description')}
              </p>
            </CardContent>
          </Card>

          <Card className={`${cardBg} border ${borderColor} mb-4`}>
            <CardHeader>
              <CardTitle className={`text-xl ${textColor}`}>
                {t('epilogue.classification.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${textColor} opacity-80`}>
                {t('epilogue.classification.description')}
              </p>
            </CardContent>
          </Card>

          <Card className={`${cardBg} border ${borderColor} mb-4`}>
            <CardHeader>
              <CardTitle className={`text-xl ${textColor}`}>
                {t('epilogue.trust.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${textColor} opacity-80`}>
                {t('epilogue.trust.description')}
              </p>
            </CardContent>
          </Card>

          <Card className={`${cardBg} border ${borderColor} mb-6`}>
            <CardHeader>
              <CardTitle className={`text-xl ${textColor}`}>
                {t('epilogue.witness.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${textColor} opacity-80`}>
                {t('epilogue.witness.description')}
              </p>
            </CardContent>
          </Card>

          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('epilogue.not_tested')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed italic`}>
            {t('epilogue.probably_holes')}
          </p>
        </section>

        {/* Why Sending This */}
        <section className="mb-16 bg-opacity-10 bg-truth-anchor-copper p-8 rounded-xl">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('why_sending.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('why_sending.virginia')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('why_sending.ann_sofie')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 font-semibold`}>
            {t('why_sending.need')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed`}>
            {t('why_sending.built')}
          </p>
        </section>

        {/* Contact */}
        <section className="mb-16">
          <Card className={`${cardBg} border ${borderColor}`}>
            <CardHeader>
              <CardTitle className={`text-2xl ${textColor}`}>
                {t('want_more.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
                {t('want_more.if_worth')}
              </p>
              <ul className={`list-disc list-inside text-lg ${textColor} leading-relaxed mb-6 ml-4`}>
                <li>{t('want_more.framework')}</li>
                <li>{t('want_more.paper')}</li>
                <li>{t('want_more.iso')}</li>
              </ul>
              <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
                {t('want_more.but')}
              </p>
              <p className={`text-lg ${textColor} leading-relaxed font-semibold`}>
                {t('want_more.contact')}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Final Reflection */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('final_reflection.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('final_reflection.weeks')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('final_reflection.just')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('final_reflection.not_easy')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed italic`}>
            {t('final_reflection.dont_know')}
          </p>
        </section>

        {/* Footer */}
        <section className={`${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'} p-8 rounded-xl`}>
          <p className={`text-sm ${textColor} mb-2`}>
            <strong>{t('footer.status')}</strong>
          </p>
          <p className={`text-sm ${textColor} mb-2`}>
            <strong>{t('footer.version')}</strong>
          </p>
          <p className={`text-sm ${textColor} mb-2`}>
            <strong>{t('footer.audience')}</strong>
          </p>
          <p className={`text-sm ${textColor} mb-6`}>
            <strong>{t('footer.what_next')}</strong>
          </p>
          <div className={`${cardBg} border ${borderColor} p-6 rounded-lg`}>
            <p className={`text-sm ${textColor} mb-3 font-semibold`}>
              {t('footer.preemptive')}
            </p>
            <p className={`text-sm ${textColor} mb-3`}>
              {t('footer.means')}
            </p>
            <p className={`text-sm ${textColor} italic`}>
              {t('footer.why')}
            </p>
          </div>
        </section>

      </article>
    </div>
  );
}

