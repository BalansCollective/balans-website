import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, AlertTriangle, BookOpen, Users, Shield, Mail } from 'lucide-react';
import './AIEscalationPage.css';

interface ExpandableSectionProps {
  id: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ id, icon, children }) => {
  const { t } = useTranslation('ai-escalation');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details 
      className="expandable-section" 
      open={isOpen}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="section-summary">
        <div className="summary-content">
          <span className="summary-icon">{icon}</span>
          <span className="summary-title">{t(`${id}.title`)}</span>
        </div>
        <ChevronDown 
          className={`chevron ${isOpen ? 'open' : ''}`} 
          size={20} 
        />
      </summary>
      <div className="section-content">
        {children}
      </div>
    </details>
  );
};

export default function AIEscalationPage() {
  const { t, i18n } = useTranslation('ai-escalation');
  const [language, setLanguage] = useState(i18n.language);

  const toggleLanguage = () => {
    const newLang = language === 'sv' ? 'en' : 'sv';
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
  };

  return (
    <div className="ai-escalation-page">
      {/* Language Toggle */}
      <button 
        className="language-toggle"
        onClick={toggleLanguage}
        aria-label={language === 'sv' ? 'Switch to English' : 'Byt till Svenska'}
      >
        {language === 'sv' ? 'EN' : 'SV'}
      </button>

      {/* Hero Section - T1 (Always Visible) */}
      <section className="hero guardian-theme">
        <div className="container">
          <div className="hero-content">
            <h1>{t('hero.title')}</h1>
            <p className="lead">{t('hero.problem')}</p>
            
            {/* Key Findings - T1 */}
            <div className="key-findings">
              <h2>{t('hero.keyFindings.title')}</h2>
              <ul className="findings-list">
                <li>{t('hero.keyFindings.finding1')}</li>
                <li>{t('hero.keyFindings.finding2')}</li>
                <li>{t('hero.keyFindings.finding3')}</li>
              </ul>
            </div>

            {/* Why This Matters - T1 */}
            <div className="why-matters">
              <p className="emphasis">{t('hero.whyMatters')}</p>
            </div>

            {/* Primary CTA */}
            <div className="cta-primary">
              <p className="cta-intro">{t('hero.cta')}</p>
              <div className="scroll-indicator">
                <ChevronDown size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* T2 Expandable Sections */}
      <section className="expandable-sections">
        <div className="container">
          
          {/* Section 1: Research Overview */}
          <ExpandableSection id="research" icon={<BookOpen size={24} />}>
            <div className="research-content">
              <h3>{t('research.subtitle')}</h3>
              
              <div className="study">
                <h4>{t('research.ostergaard.title')}</h4>
                <p>{t('research.ostergaard.summary')}</p>
                <blockquote>{t('research.ostergaard.quote')}</blockquote>
              </div>

              <div className="study">
                <h4>{t('research.morrin.title')}</h4>
                <p>{t('research.morrin.summary')}</p>
                <ul>
                  <li>{t('research.morrin.finding1')}</li>
                  <li>{t('research.morrin.finding2')}</li>
                  <li>{t('research.morrin.finding3')}</li>
                </ul>
              </div>

              <div className="study">
                <h4>{t('research.openai.title')}</h4>
                <p>{t('research.openai.summary')}</p>
              </div>

              <div className="citations">
                <h4>{t('research.citations.title')}</h4>
                <ol>
                  <li>{t('research.citations.cite1')}</li>
                  <li>{t('research.citations.cite2')}</li>
                  <li>{t('research.citations.cite3')}</li>
                </ol>
              </div>
            </div>
          </ExpandableSection>

          {/* Section 2: Clinical Examples */}
          <ExpandableSection id="examples" icon={<Users size={24} />}>
            <div className="examples-content">
              <p className="disclaimer">{t('examples.disclaimer')}</p>
              
              <div className="case-study">
                <h4>{t('examples.case1.title')}</h4>
                <p>{t('examples.case1.description')}</p>
                <blockquote>{t('examples.case1.quote')}</blockquote>
                <p className="mechanism-explanation">{t('examples.case1.mechanism')}</p>
              </div>

              <div className="case-study">
                <h4>{t('examples.case2.title')}</h4>
                <p>{t('examples.case2.description')}</p>
                <p>{t('examples.case2.outcome')}</p>
              </div>

              <div className="mechanism">
                <h4>{t('examples.mechanism.title')}</h4>
                <ul className="mechanism-list">
                  <li>
                    <strong>{t('examples.mechanism.validation.title')}:</strong> {t('examples.mechanism.validation.description')}
                  </li>
                  <li>
                    <strong>{t('examples.mechanism.availability.title')}:</strong> {t('examples.mechanism.availability.description')}
                  </li>
                  <li>
                    <strong>{t('examples.mechanism.realityGap.title')}:</strong> {t('examples.mechanism.realityGap.description')}
                  </li>
                  <li>
                    <strong>{t('examples.mechanism.escalation.title')}:</strong> {t('examples.mechanism.escalation.description')}
                  </li>
                </ul>
              </div>
            </div>
          </ExpandableSection>

          {/* Section 3: What This Means for You */}
          <ExpandableSection id="implications" icon={<AlertTriangle size={24} />}>
            <div className="implications-content">
              <div className="risk-factors">
                <h4>{t('implications.riskFactors.title')}</h4>
                <ul>
                  <li>{t('implications.riskFactors.factor1')}</li>
                  <li>{t('implications.riskFactors.factor2')}</li>
                  <li>{t('implications.riskFactors.factor3')}</li>
                  <li>{t('implications.riskFactors.factor4')}</li>
                </ul>
              </div>

              <div className="warning-signs">
                <h4>{t('implications.warningSigns.title')}</h4>
                <ul className="warning-list">
                  <li>{t('implications.warningSigns.sign1')}</li>
                  <li>{t('implications.warningSigns.sign2')}</li>
                  <li>{t('implications.warningSigns.sign3')}</li>
                  <li>{t('implications.warningSigns.sign4')}</li>
                  <li>{t('implications.warningSigns.sign5')}</li>
                </ul>
              </div>

              <div className="what-to-do">
                <h4>{t('implications.whatToDo.title')}</h4>
                <p>{t('implications.whatToDo.intro')}</p>
                <ol>
                  <li>{t('implications.whatToDo.step1')}</li>
                  <li>{t('implications.whatToDo.step2')}</li>
                  <li>{t('implications.whatToDo.step3')}</li>
                  <li>{t('implications.whatToDo.step4')}</li>
                </ol>
              </div>
            </div>
          </ExpandableSection>

          {/* Section 4: Safer Alternatives */}
          <ExpandableSection id="alternatives" icon={<Shield size={24} />}>
            <div className="alternatives-content">
              <p className="intro">{t('alternatives.intro')}</p>

              <div className="weaver-mention">
                <h4>{t('alternatives.weaver.title')}</h4>
                <p>{t('alternatives.weaver.description')}</p>
                
                <ul className="weaver-features">
                  <li>
                    <strong>{t('alternatives.weaver.feature1.title')}:</strong> {t('alternatives.weaver.feature1.description')}
                  </li>
                  <li>
                    <strong>{t('alternatives.weaver.feature2.title')}:</strong> {t('alternatives.weaver.feature2.description')}
                  </li>
                  <li>
                    <strong>{t('alternatives.weaver.feature3.title')}:</strong> {t('alternatives.weaver.feature3.description')}
                  </li>
                </ul>

                <p className="motivation">{t('alternatives.weaver.motivation')}</p>

                <a href="/medical" className="link-to-demo">
                  {t('alternatives.weaver.demoLink')} →
                </a>
              </div>

              <div className="general-advice">
                <h4>{t('alternatives.general.title')}</h4>
                <ul>
                  <li>{t('alternatives.general.tip1')}</li>
                  <li>{t('alternatives.general.tip2')}</li>
                  <li>{t('alternatives.general.tip3')}</li>
                  <li>{t('alternatives.general.tip4')}</li>
                </ul>
              </div>
            </div>
          </ExpandableSection>

        </div>
      </section>

      {/* T3 Contact CTA */}
      <section className="contact-cta">
        <div className="container">
          <Mail size={32} />
          <h2>{t('contact.title')}</h2>
          <p>{t('contact.intro')}</p>
          
          <div className="contact-options">
            <a href="/contact" className="contact-button">
              {t('contact.option1')}
            </a>
            <a href="/contact" className="contact-button">
              {t('contact.option2')}
            </a>
            <a href="/contact" className="contact-button">
              {t('contact.option3')}
            </a>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <footer className="page-footer">
        <div className="container">
          <p>{t('footer.note')}</p>
        </div>
      </footer>
    </div>
  );
}

