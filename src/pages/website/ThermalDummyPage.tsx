import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export function ThermalDummyPage() {
  const { t } = useTranslation(['thermal-dummy', 'common']);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Theme detection (same as GuardianProtocolPage)
  useEffect(() => {
    const context = sessionStorage.getItem('lastContext');
    setIsDarkMode(context === 'dark');
  }, []);

  const handleRequestLayer2 = () => {
    setShowEmailForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mailto approach for MVP
    const subject = "Layer 2 Request: Guardian Protocol Investigation";
    const body = `Name: ${formData.name}
Email: ${formData.email}
Organization: ${formData.organization || 'N/A'}
Role: ${formData.role || 'N/A'}

Please send Layer 2 report (full 13-minute narrative with investigation findings, technical details, and deployment strategy).`;
    
    window.location.href = `mailto:samuel@dynorobotics.se?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setFormSubmitted(true);
    setTimeout(() => {
      setShowEmailForm(false);
      setFormSubmitted(false);
    }, 3000);
  };

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
          <div className="inline-block px-4 py-2 bg-truth-anchor-copper bg-opacity-20 rounded-full mb-6">
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
        {/* Question First */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('question.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('question.scenario')}
          </p>
          <div className={`${cardBg} border ${borderColor} p-6 rounded-lg my-6`}>
            <p className={`text-lg ${textColor} italic`}>
              {t('question.orders')}
            </p>
          </div>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('question.event')}
          </p>
          <p className={`text-xl font-bold ${textColor} mb-4`}>
            {t('question.question')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('question.options')}
          </p>
          <p className={`text-sm ${textColor} opacity-75 italic`}>
            {t('question.instruction')}
          </p>
        </section>

        {/* The Problem */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('problem.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 font-semibold`}>
            {t('problem.drones_per_day')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('problem.human_limitation')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('problem.current_failures')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('problem.proposal')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('problem.analyst')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed font-semibold`}>
            {t('problem.job')}
          </p>
        </section>

        {/* The Test */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('test.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('test.config')}
          </p>
          <div className={`${cardBg} border ${borderColor} p-6 rounded-lg my-6`}>
            <p className={`text-lg ${textColor} mb-2`}>
              <strong>1.</strong> {t('test.rules.where')}
            </p>
            <p className={`text-lg ${textColor} mb-2`}>
              <strong>2.</strong> {t('test.rules.what')}
            </p>
            <p className={`text-lg ${textColor} mb-2`}>
              <strong>3.</strong> {t('test.rules.when')}
            </p>
            <p className={`text-lg ${textColor}`}>
              <strong>4.</strong> {t('test.rules.how')}
            </p>
          </div>
          <p className={`text-lg ${textColor} leading-relaxed mb-2 font-semibold`}>
            {t('test.her_rules.title')}
          </p>
          <ul className={`list-disc list-inside text-lg ${textColor} leading-relaxed mb-4 ml-4`}>
            <li>{t('test.her_rules.auto_engage')}</li>
            <li>{t('test.her_rules.flag_uncertain')}</li>
          </ul>
          <p className={`text-lg ${textColor} leading-relaxed italic`}>
            {t('test.submit')}
          </p>
        </section>

        {/* First Engagement */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('first_engagement.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-2 font-semibold`}>
            {t('first_engagement.time')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('first_engagement.target')}
          </p>
          <p className={`text-2xl font-bold ${textColor} mb-2`}>
            {t('first_engagement.boom')}
          </p>
          <p className={`text-xl font-bold ${textColor} mb-4`}>
            {t('first_engagement.destroyed')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('first_engagement.reaction')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('first_engagement.engineer_shows')}
          </p>
          <div className={`${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'} border ${borderColor} p-6 rounded-lg my-6 font-mono text-sm`}>
            {(t('first_engagement.log', { returnObjects: true }) as string[]).map((line, i) => (
              <p key={i} className={textColor}>{line}</p>
            ))}
          </div>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('first_engagement.question')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('first_engagement.realization')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed italic`}>
            {t('first_engagement.feeling')}
          </p>
        </section>

        {/* Second Engagement */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('second_engagement.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-2 font-semibold`}>
            {t('second_engagement.time')}
          </p>
          <div className="bg-yellow-500 bg-opacity-20 border-2 border-yellow-500 p-6 rounded-lg my-6">
            <p className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
              {t('second_engagement.alert')}
            </p>
          </div>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('second_engagement.morgan_leans')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('second_engagement.display')}
          </p>
          <div className={`${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'} border ${borderColor} p-6 rounded-lg my-6 font-mono text-sm`}>
            {(t('second_engagement.data', { returnObjects: true }) as string[]).map((line, i) => (
              <p key={i} className={textColor}>{line}</p>
            ))}
          </div>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('second_engagement.pressure')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('second_engagement.morgan_thinks')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 font-semibold`}>
            {t('second_engagement.seconds')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic font-semibold`}>
            {t('second_engagement.decision')}
          </p>
          <p className={`text-2xl font-bold ${textColor} mb-2`}>
            {t('second_engagement.boom')}
          </p>
          <p className={`text-xl font-bold ${textColor} mb-4`}>
            {t('second_engagement.destroyed')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('second_engagement.engineer_pale')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed italic font-semibold`}>
            {t('second_engagement.reveal')}
          </p>
        </section>

        {/* The Reveal */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('reveal.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('reveal.director_enters')}
          </p>
          {(t('reveal.explanation', { returnObjects: true }) as string[]).map((para, i) => (
            <p key={i} className={`text-lg ${textColor} leading-relaxed mb-4`}>
              {para}
            </p>
          ))}
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('reveal.morgan_reacts')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('reveal.replay')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('reveal.director_says')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('reveal.morgan_protests')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('reveal.director_responds')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('reveal.collateral')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('reveal.collateral_damage')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('reveal.morgan_asks')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed font-semibold`}>
            {t('reveal.statistics')}
          </p>
        </section>

        {/* What Happened */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('what_happened.title')}
          </h2>
          <h3 className={`text-2xl font-display font-bold ${textColor} mb-4`}>
            {t('what_happened.system_correct.title')}
          </h3>
          <ul className={`list-disc list-inside text-lg ${textColor} leading-relaxed mb-6 ml-4`}>
            {(t('what_happened.system_correct.items', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <h3 className={`text-2xl font-display font-bold ${textColor} mb-4`}>
            {t('what_happened.morgan_error.title')}
          </h3>
          <ul className={`list-disc list-inside text-lg ${textColor} leading-relaxed mb-6 ml-4`}>
            {(t('what_happened.morgan_error.items', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <h3 className={`text-2xl font-display font-bold ${textColor} mb-4`}>
            {t('what_happened.logs.title')}
          </h3>
          <div className={`${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'} border ${borderColor} p-6 rounded-lg my-6 font-mono text-sm`}>
            {(t('what_happened.logs.items', { returnObjects: true }) as string[]).map((line, i) => (
              <p key={i} className={textColor}>{line}</p>
            ))}
          </div>
          <p className={`text-lg ${textColor} leading-relaxed italic font-semibold`}>
            {t('what_happened.conclusion')}
          </p>
        </section>

        {/* What This Proves */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('what_this_proves.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 font-semibold`}>
            {t('what_this_proves.failure_rate')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-6`}>
            {t('what_this_proves.systemic')}
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className={`${cardBg} border ${borderColor}`}>
              <CardHeader>
                <CardTitle className={`text-xl ${textColor}`}>
                  {t('what_this_proves.passed.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`${textColor} opacity-80`}>
                  {t('what_this_proves.passed.description')}
                </p>
              </CardContent>
            </Card>
            <Card className={`${cardBg} border ${borderColor}`}>
              <CardHeader>
                <CardTitle className={`text-xl ${textColor}`}>
                  {t('what_this_proves.failed.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`${textColor} opacity-80`}>
                  {t('what_this_proves.failed.description')}
                </p>
              </CardContent>
            </Card>
          </div>
          <h3 className={`text-2xl font-display font-bold ${textColor} mb-4`}>
            {t('what_this_proves.provides.title')}
          </h3>
          <ul className={`list-disc list-inside text-lg ${textColor} leading-relaxed mb-6 ml-4`}>
            {(t('what_this_proves.provides.items', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <h3 className={`text-2xl font-display font-bold ${textColor} mb-4`}>
            {t('what_this_proves.does_not_provide.title')}
          </h3>
          <ul className={`list-disc list-inside text-lg ${textColor} leading-relaxed ml-4`}>
            {(t('what_this_proves.does_not_provide.items', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Six Months Later */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('six_months_later.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-6`}>
            {t('six_months_later.deployment')}
          </p>
          <h3 className={`text-2xl font-display font-bold ${textColor} mb-4`}>
            {t('six_months_later.lessons.title')}
          </h3>
          <ul className={`list-disc list-inside text-lg ${textColor} leading-relaxed mb-6 ml-4`}>
            {(t('six_months_later.lessons.items', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <h3 className={`text-2xl font-display font-bold ${textColor} mb-4`}>
            {t('six_months_later.results.title')}
          </h3>
          <ul className={`list-disc list-inside text-lg ${textColor} leading-relaxed mb-6 ml-4`}>
            {(t('six_months_later.results.items', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('six_months_later.radio')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 italic`}>
            {t('six_months_later.lesson')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed italic font-semibold`}>
            {t('six_months_later.conclusion')}
          </p>
        </section>

        {/* The Choice */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('the_choice.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 font-semibold`}>
            {t('the_choice.tested')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('the_choice.question')}
          </p>
          <p className={`text-xl ${textColor} leading-relaxed mb-6 font-semibold`}>
            {t('the_choice.real_question')}
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className={`${cardBg} border ${borderColor}`}>
              <CardHeader>
                <CardTitle className={`text-xl ${textColor}`}>
                  {t('the_choice.without.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className={`list-disc list-inside ${textColor} opacity-80`}>
                  {(t('the_choice.without.items', { returnObjects: true }) as string[]).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className={`${cardBg} border ${borderColor}`}>
              <CardHeader>
                <CardTitle className={`text-xl ${textColor}`}>
                  {t('the_choice.with.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className={`list-disc list-inside ${textColor} opacity-80`}>
                  {(t('the_choice.with.items', { returnObjects: true }) as string[]).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 font-semibold`}>
            {t('the_choice.alternative')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('the_choice.reality')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 font-semibold`}>
            {t('the_choice.real_alternative')}
          </p>
          <p className={`text-xl ${textColor} leading-relaxed font-semibold`}>
            {t('the_choice.conclusion')}
          </p>
        </section>

        {/* For Decision Makers */}
        <section className="mb-16">
          <h2 className={`text-3xl font-display font-bold ${textColor} mb-6`}>
            {t('for_decision_makers.title')}
          </h2>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('for_decision_makers.intro')}
          </p>
          <ol className={`list-decimal list-inside text-lg ${textColor} leading-relaxed mb-6 ml-4`}>
            {(t('for_decision_makers.questions', { returnObjects: true }) as string[]).map((q, i) => (
              <li key={i} className="mb-2">{q}</li>
            ))}
          </ol>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('for_decision_makers.answers')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4 font-semibold`}>
            {t('for_decision_makers.not_perfect')}
          </p>
          <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
            {t('for_decision_makers.but')}
          </p>
          <p className={`text-xl ${textColor} leading-relaxed font-semibold`}>
            {t('for_decision_makers.conclusion')}
          </p>
        </section>
      </article>

      {/* Layer 2 CTA */}
      <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} py-16`}>
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <Card className={`${cardBg} border ${borderColor}`}>
            <CardHeader>
              <CardTitle className={`text-3xl ${textColor}`}>
                {t('layer2_cta.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-lg ${textColor} leading-relaxed mb-4`}>
                {t('layer2_cta.layer1')}
              </p>
              <h3 className={`text-xl font-bold ${textColor} mb-3`}>
                {t('layer2_cta.layer2_title')}
              </h3>
              <ul className={`list-disc list-inside text-lg ${textColor} leading-relaxed mb-6 ml-4`}>
                {(t('layer2_cta.layer2_items', { returnObjects: true }) as string[]).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <h3 className={`text-xl font-bold ${textColor} mb-3`}>
                {t('layer2_cta.layer2_for.title')}
              </h3>
              <ul className={`list-disc list-inside text-lg ${textColor} leading-relaxed mb-6 ml-4`}>
                {(t('layer2_cta.layer2_for.items', { returnObjects: true }) as string[]).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <button
                onClick={handleRequestLayer2}
                className="px-8 py-4 bg-truth-anchor-copper text-birch-white rounded-lg hover:bg-soft-thread-gold transition-colors shadow-lg font-semibold text-lg"
              >
                {t('layer2_cta.button')}
              </button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Email Form Modal */}
      {showEmailForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-xl max-w-md w-full p-8 shadow-2xl`}>
            {formSubmitted ? (
              <div className="text-center">
                <div className="text-6xl mb-4">✓</div>
                <p className={`text-xl ${textColor} font-semibold`}>
                  {t('email_form.success')}
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className={`text-2xl font-display font-bold ${textColor} mb-2`}>
                      {t('email_form.title')}
                    </h2>
                    <p className={`text-sm ${textColor} opacity-75`}>
                      {t('email_form.subtitle')}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEmailForm(false)}
                    className={`text-2xl ${textColor} hover:opacity-75`}
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                      {t('email_form.name')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${cardBg} ${textColor}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                      {t('email_form.email')} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${cardBg} ${textColor}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                      {t('email_form.organization')}
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({...formData, organization: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${cardBg} ${textColor}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                      {t('email_form.role')}
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${cardBg} ${textColor}`}
                    >
                      <option value="">Select...</option>
                      <option value="policy">{t('email_form.role_options.policy')}</option>
                      <option value="military">{t('email_form.role_options.military')}</option>
                      <option value="researcher">{t('email_form.role_options.researcher')}</option>
                      <option value="procurement">{t('email_form.role_options.procurement')}</option>
                      <option value="ethics">{t('email_form.role_options.ethics')}</option>
                      <option value="other">{t('email_form.role_options.other')}</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-truth-anchor-copper text-birch-white rounded-lg hover:bg-soft-thread-gold transition-colors shadow-lg font-semibold"
                  >
                    {t('email_form.submit')}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

