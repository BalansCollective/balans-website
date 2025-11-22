import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigation } from '@/components/Navigation';

export default function FamilyPage() {
  const { t } = useTranslation('family');
  const [chatAnimationTriggered, setChatAnimationTriggered] = useState(false);
  const chatDemoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !chatAnimationTriggered) {
            setChatAnimationTriggered(true);
            startFamilyChatAnimation();
          }
        });
      },
      { threshold: 0.5, rootMargin: '0px 0px -100px 0px' }
    );

    if (chatDemoRef.current) {
      observer.observe(chatDemoRef.current);
    }

    return () => observer.disconnect();
  }, [chatAnimationTriggered]);

  const startFamilyChatAnimation = () => {
    const chatContainer = document.getElementById('chat-messages');
    if (!chatContainer) return;

    chatContainer.innerHTML = '';

    const createMessage = (content: string, sender: string, isWeaver = false, alignment = 'left') => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `opacity-0 transform translate-y-5 transition-all duration-400 ${alignment === 'right' ? 'mr-8' : 'ml-8'}`;

      if (isWeaver) {
        messageDiv.innerHTML = `
          <div class="bg-sage-green/10 rounded-lg p-3 border-l-4 border-sage-green">
            <div class="text-sm font-medium text-sage-green mb-1">💡 ${t('chat.weaver_suggests')}</div>
            <p class="text-gray-700 text-sm">${content}</p>
          </div>
        `;
      } else {
        const bgClass = alignment === 'right' ? 'bg-blue-50' : 'bg-gray-100';
        messageDiv.innerHTML = `
          <div class="${bgClass} rounded-lg p-3">
            <div class="text-sm font-medium text-gray-600 mb-1">${sender}</div>
            <p class="text-gray-800">${content}</p>
          </div>
        `;
      }

      return messageDiv;
    };

    const sequence = [
      {
        delay: 500,
        action: () => {
          const msg = createMessage('whatever', 'Emma (15)');
          chatContainer.appendChild(msg);
          setTimeout(() => msg.classList.remove('opacity-0', 'translate-y-5'), 50);
        },
      },
      {
        delay: 2000,
        action: () => {
          const msg = createMessage(t('chat.weaver_message'), '', true);
          chatContainer.appendChild(msg);
          setTimeout(() => msg.classList.remove('opacity-0', 'translate-y-5'), 50);
        },
      },
      {
        delay: 4000,
        action: () => {
          const msg = createMessage(t('chat.mom_message'), t('chat.mom'), false, 'right');
          chatContainer.appendChild(msg);
          setTimeout(() => msg.classList.remove('opacity-0', 'translate-y-5'), 50);
        },
      },
    ];

    sequence.forEach((step) => setTimeout(step.action, step.delay));
  };

  return (
    <div className="min-h-screen bg-warm-birch-white text-gray-800">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warm-birch-white to-natural-birch-wood/30 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-display font-bold text-deep-swedish-blue leading-tight">
                  {t('hero.title')}
                </h1>
                <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed">
                  {t('hero.subtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/prova-weaver"
                  className="bg-sacred-alliance-purple text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-sacred-alliance-purple/90 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                  {t('hero.cta_primary')}
                </a>
                <button
                  onClick={() => document.getElementById('technology')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-deep-swedish-blue text-deep-swedish-blue px-8 py-4 rounded-full text-lg font-semibold hover:bg-deep-swedish-blue hover:text-white transition-all duration-300"
                >
                  {t('hero.cta_secondary')}
                </button>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🛡️</span>
                  <span>{t('hero.feature1')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">⚖️</span>
                  <span>{t('hero.feature2')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                  <span>{t('hero.feature3')}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="w-full h-auto rounded-2xl shadow-lg bg-gradient-to-br from-sage-green/20 to-sacred-alliance-purple/20 aspect-square flex items-center justify-center">
                <span className="text-6xl">👨‍👩‍👧‍👦</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Recognition Section */}
      <section id="problem" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-deep-swedish-blue mb-6">
              {t('problem.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('problem.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="bg-warm-birch-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className={`${num === 1 ? 'bg-sage-green/20' : num === 2 ? 'bg-soft-thread-gold/20' : 'bg-truth-anchor-copper/20'} rounded-full p-3 mr-4`}>
                    <span className="text-3xl">
                      {num === 1 ? '💬' : num === 2 ? '👥' : '⚠️'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-deep-swedish-blue">
                    {t(`problem.challenge${num}_title`)}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">{t(`problem.challenge${num}_description`)}</p>
                <div className={`text-sm font-medium ${num === 1 ? 'text-sage-green' : num === 2 ? 'text-soft-thread-gold' : 'text-truth-anchor-copper'}`}>
                  → {t(`problem.challenge${num}_tag`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weaver Character Introduction */}
      <section id="weaver" className="py-20 bg-gradient-to-br from-warm-birch-white to-sage-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="w-full h-auto rounded-2xl shadow-lg bg-gradient-to-br from-sacred-alliance-purple/20 to-sage-green/20 aspect-square flex items-center justify-center">
                <span className="text-6xl">🤖</span>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-display font-bold text-deep-swedish-blue">
                  {t('weaver.title')}
                </h2>
                <p className="text-xl text-gray-600">{t('weaver.subtitle')}</p>
              </div>

              <div className="space-y-6">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-start space-x-4">
                    <div className={`${num === 1 ? 'bg-sage-green/20' : num === 2 ? 'bg-soft-thread-gold/20' : 'bg-sacred-alliance-purple/20'} rounded-full p-3 flex-shrink-0`}>
                      <span className="text-2xl">
                        {num === 1 ? '💬' : num === 2 ? '❤️' : '👨‍👩‍👧‍👦'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-deep-swedish-blue mb-2">
                        {t(`weaver.feature${num}_title`)}
                      </h3>
                      <p className="text-gray-600">{t(`weaver.feature${num}_description`)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <a
                  href="/prova-weaver"
                  className="inline-block bg-sacred-alliance-purple text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-sacred-alliance-purple/90 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  {t('weaver.cta')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="solution" className="py-24 bg-gradient-to-br from-warm-birch-white via-white to-sage-green/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-deep-swedish-blue mb-8 leading-tight">
              {t('solution.title')}
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {t('solution.subtitle')}
            </p>
          </div>

          <div className="space-y-32">
            {/* Smart Family Messaging */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-sage-green/20 rounded-full p-4">
                    <span className="text-4xl">💬</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-deep-swedish-blue">
                    {t('solution.feature1_title')}
                  </h3>
                </div>

                <p className="text-lg text-gray-600 mb-6">{t('solution.feature1_description')}</p>

                <div className="space-y-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex items-start space-x-3">
                      <span className="text-sage-green text-xl">✓</span>
                      <span className="text-gray-700">{t(`solution.feature1_benefit${num}`)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div ref={chatDemoRef} id="family-chat-demo" className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-deep-swedish-blue rounded-full p-2">
                        <span className="text-white text-xl">👨‍👩‍👧‍👦</span>
                      </div>
                      <span className="font-semibold text-deep-swedish-blue">
                        {t('solution.chat_title')}
                      </span>
                    </div>

                    <div id="chat-messages" className="space-y-3 min-h-[200px]">
                      {/* Messages will appear dynamically */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Round Table Ambient Listening */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-truth-anchor-copper rounded-full p-2">
                        <span className="text-white text-xl">🏠</span>
                      </div>
                      <span className="font-semibold text-deep-swedish-blue">
                        {t('solution.feature2_demo_title')}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-gray-800 text-sm">{t('solution.feature2_example1')}</p>
                      </div>

                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-gray-800 text-sm">{t('solution.feature2_example2')}</p>
                      </div>

                      <div className="bg-soft-thread-gold/10 rounded-lg p-3 border-l-4 border-soft-thread-gold">
                        <div className="text-sm font-medium text-soft-thread-gold mb-1">
                          🤝 {t('solution.weaver_suggests')}
                        </div>
                        <p className="text-gray-700 text-sm">{t('solution.feature2_suggestion')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-truth-anchor-copper/20 rounded-full p-4">
                    <span className="text-4xl">🎤</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-deep-swedish-blue">
                    {t('solution.feature2_title')}
                  </h3>
                </div>

                <p className="text-lg text-gray-600 mb-6">{t('solution.feature2_description')}</p>

                <div className="space-y-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex items-start space-x-3">
                      <span className="text-sage-green text-xl">✓</span>
                      <span className="text-gray-700">{t(`solution.feature2_benefit${num}`)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <a
              href="/prova-weaver"
              className="bg-sacred-alliance-purple text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-sacred-alliance-purple/90 transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              {t('solution.cta')}
            </a>
          </div>
        </div>
      </section>

      {/* Technology/Deployment Section */}
      <section id="technology" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-deep-swedish-blue mb-6">
              {t('technology.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('technology.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Balans Hosted */}
            <div className="bg-gradient-to-br from-sacred-alliance-purple/5 to-sacred-alliance-purple/10 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-sacred-alliance-purple/20">
              <div className="text-center mb-6">
                <div className="bg-sacred-alliance-purple/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">☁️</span>
                </div>
                <h3 className="text-2xl font-semibold text-deep-swedish-blue mb-2">
                  {t('technology.option1_title')}
                </h3>
                <p className="text-sacred-alliance-purple font-medium">
                  {t('technology.option1_badge')}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="flex items-start space-x-3">
                    <span className="text-sage-green text-xl mt-1">✓</span>
                    <span className="text-gray-700">{t(`technology.option1_feature${num}`)}</span>
                  </div>
                ))}
              </div>

              <a
                href="/prova-weaver"
                className="block w-full text-center bg-sacred-alliance-purple text-white px-6 py-3 rounded-full font-semibold hover:bg-sacred-alliance-purple/90 transition-all duration-300"
              >
                {t('technology.option1_cta')}
              </a>
            </div>

            {/* WeaverMesh Open Source */}
            <div className="bg-gradient-to-br from-sage-green/5 to-sage-green/10 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-sage-green/20">
              <div className="text-center mb-6">
                <div className="bg-sage-green/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">💻</span>
                </div>
                <h3 className="text-2xl font-semibold text-deep-swedish-blue mb-2">
                  {t('technology.option2_title')}
                </h3>
                <p className="text-sage-green font-medium">{t('technology.option2_badge')}</p>
              </div>

              <div className="space-y-4 mb-8">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-start space-x-3">
                    <span className="text-sage-green text-xl mt-1">✓</span>
                    <span className="text-gray-700">{t(`technology.option2_feature${num}`)}</span>
                  </div>
                ))}
                <div className="flex items-start space-x-3">
                  <span className="text-soft-thread-gold text-xl mt-1">⚠</span>
                  <span className="text-gray-700">{t('technology.option2_warning')}</span>
                </div>
              </div>

              <a
                href="/prova-weaver"
                className="block w-full text-center bg-sage-green text-white px-6 py-3 rounded-full font-semibold hover:bg-sage-green/90 transition-all duration-300"
              >
                {t('technology.option2_cta')}
              </a>
            </div>

            {/* Home Appliance */}
            <div className="bg-gradient-to-br from-truth-anchor-copper/5 to-truth-anchor-copper/10 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-truth-anchor-copper/20">
              <div className="text-center mb-6">
                <div className="bg-truth-anchor-copper/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">🏠</span>
                </div>
                <h3 className="text-2xl font-semibold text-deep-swedish-blue mb-2">
                  {t('technology.option3_title')}
                </h3>
                <p className="text-truth-anchor-copper font-medium">
                  {t('technology.option3_badge')}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="flex items-start space-x-3">
                    <span className="text-sage-green text-xl mt-1">✓</span>
                    <span className="text-gray-700">{t(`technology.option3_feature${num}`)}</span>
                  </div>
                ))}
              </div>

              <a
                href="/prova-weaver"
                className="block w-full text-center bg-truth-anchor-copper text-white px-6 py-3 rounded-full font-semibold hover:bg-truth-anchor-copper/90 transition-all duration-300"
              >
                {t('technology.option3_cta')}
              </a>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">{t('technology.help_text')}</p>
            <a
              href="/hjalp-mig-valja"
              className="border-2 border-deep-swedish-blue text-deep-swedish-blue px-8 py-3 rounded-full font-semibold hover:bg-deep-swedish-blue hover:text-white transition-all duration-300"
            >
              {t('technology.help_cta')}
            </a>
          </div>
        </div>
      </section>

      {/* Trust Building Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-deep-swedish-blue mb-6">
              {t('trust.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('trust.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="text-center">
                <div className="bg-warm-birch-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-5xl mb-6">
                    {num === 1 ? '🛡️' : num === 2 ? '⚖️' : '👨‍👩‍👧‍👦'}
                  </div>
                  <h3 className="text-xl font-semibold text-deep-swedish-blue mb-4">
                    {t(`trust.feature${num}_title`)}
                  </h3>
                  <p className="text-gray-600">{t(`trust.feature${num}_description`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-deep-swedish-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-display font-bold">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-blue-100">{t('cta.subtitle')}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/prova-weaver"
                className="bg-sacred-alliance-purple text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-sacred-alliance-purple/90 transition-all duration-300"
              >
                {t('cta.primary')}
              </a>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-deep-swedish-blue transition-all duration-300">
                {t('cta.secondary')}
              </button>
            </div>

            <div className="text-sm text-blue-200">{t('cta.note')}</div>
          </div>
        </div>
      </section>
    </div>
  );
}

