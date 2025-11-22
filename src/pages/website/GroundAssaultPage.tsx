import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";

export function GroundAssaultPage() {
  const { t } = useTranslation("ground-assault");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showT2, setShowT2] = useState(false);

  useEffect(() => {
    const context = sessionStorage.getItem("lastContext");
    setIsDarkMode(context === "dark");
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0a0e14] text-birch-white" : "bg-[#f8f6f0] text-gray-950"}`}>
      <Navigation />

      <div className="max-w-4xl mx-auto px-6 lg:px-12 pt-24 pb-8">
        <div className="inline-block px-4 py-2 bg-sage-green/20 rounded-full mb-4">
          <span className="text-sm font-semibold text-sage-green uppercase tracking-wider">
            {showT2 ? t("tier2_badge") : t("tier1_badge")}
          </span>
        </div>
        <span className="block text-sm text-gray-500">{showT2 ? t("tier2_reading_time") : t("tier1_reading_time")}</span>
      </div>

      <article
        className={`max-w-4xl mx-auto px-6 lg:px-12 py-8 ${
          isDarkMode ? "text-birch-white/90" : "text-gray-950/90"
        }`}
      >
        <h1 className={`text-4xl font-bold mb-6 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("title")}</h1>

        {/* Tier 1: The Hook */}
        <section className="mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("question.title")}</h2>
          <p className="text-lg leading-relaxed mb-4">{t("question.p1")}</p>
          <p className="text-lg leading-relaxed mb-4">{t("question.p2")}</p>
          <p className="text-lg leading-relaxed mb-4">{t("question.p3")}</p>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("question.p4")}</strong></p>
        </section>

        <section className="mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("ukraine.title")}</h2>
          <p className="text-lg leading-relaxed mb-4">{t("ukraine.p1")}</p>
          <p className="text-lg leading-relaxed mb-4">{t("ukraine.p2")}</p>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("ukraine.results")}</strong></p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>{t("ukraine.r1")}</li>
            <li>{t("ukraine.r2")}</li>
            <li>{t("ukraine.r3")}</li>
            <li>{t("ukraine.r4")}</li>
          </ul>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("ukraine.then")}</strong></p>
        </section>

        <section className="mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("decision.title")}</h2>
          <p className="text-lg leading-relaxed mb-4 font-semibold">{t("decision.time")}</p>
          <p className="text-lg leading-relaxed mb-4">{t("decision.p1")}</p>
          <p className="text-lg leading-relaxed mb-4">{t("decision.p2")}</p>
          <p className="text-lg leading-relaxed mb-4">{t("decision.p3")}</p>
          <p className="text-lg leading-relaxed mb-4">{t("decision.p4")}</p>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("decision.elena")}</strong></p>
          <pre className={`p-4 rounded-lg mb-4 overflow-x-auto ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}><code className="text-sm">{t("decision.code")}</code></pre>
          <p className="text-lg leading-relaxed mb-4">{t("decision.verify")}</p>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("decision.clear")}</strong></p>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("decision.turrets")}</strong></p>
        </section>

        <section className="mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("engagement.title")}</h2>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("engagement.boom")}</strong></p>
          <p className="text-lg leading-relaxed mb-4">{t("engagement.result")}</p>
          <p className="text-lg leading-relaxed mb-4">{t("engagement.checkin")}</p>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("engagement.five")}</strong></p>
          <p className="text-lg leading-relaxed mb-4">{t("engagement.should_be_six")}</p>
        </section>

        <section className="mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("discovery.title")}</h2>
          <p className="text-lg leading-relaxed mb-4">{t("discovery.p1")}</p>
          <p className="text-lg leading-relaxed mb-4 font-semibold">{t("discovery.log_title")}</p>
          <pre className={`p-4 rounded-lg mb-4 overflow-x-auto ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}><code className="text-sm">{t("discovery.code")}</code></pre>
          <p className="text-lg leading-relaxed mb-4">{t("discovery.p2")}</p>
          <p className="text-lg leading-relaxed mb-4">{t("discovery.p3")}</p>
          <p className="text-lg leading-relaxed mb-4">{t("discovery.p4")}</p>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("discovery.worked")}</strong></p>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("discovery.not_built")}</strong></p>
        </section>

        <section className="mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("investigation_t1.title")}</h2>
          <p className="text-lg leading-relaxed mb-4 font-semibold">{t("investigation_t1.results_title")}</p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>{t("investigation_t1.r1")}</li>
            <li><strong>{t("investigation_t1.r2")}</strong></li>
            <li>{t("investigation_t1.r3")}</li>
          </ul>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("investigation_t1.question")}</strong></p>
          <p className="text-lg leading-relaxed mb-4">{t("investigation_t1.board")}</p>
          <p className="text-lg leading-relaxed mb-4">{t("investigation_t1.ballistics")}</p>
          <p className="text-lg leading-relaxed mb-4">{t("investigation_t1.iff")}</p>
          <p className="text-lg leading-relaxed mb-4">{t("investigation_t1.authorization")}</p>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("investigation_t1.git_logs")}</strong></p>
        </section>

        <section className="mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("developer.title")}</h2>
          <pre className={`p-4 rounded-lg mb-4 overflow-x-auto ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}><code className="text-sm">{t("developer.code")}</code></pre>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("developer.documented")}</strong></p>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("developer.not_in_training")}</strong></p>
        </section>

        <section className="mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("verdict_t1.title")}</h2>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>{t("verdict_t1.elena")}</li>
            <li>{t("verdict_t1.petrov")}</li>
            <li>{t("verdict_t1.system")}</li>
            <li>{t("verdict_t1.andersson")}</li>
            <li>{t("verdict_t1.training")}</li>
            <li>{t("verdict_t1.chaos")}</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("reveals_t1.title")}</h2>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("reveals_t1.worked")}</strong></p>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("reveals_t1.mission_creep")}</strong> {t("reveals_t1.mission_creep_text")}</p>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("reveals_t1.accountability")}</strong> {t("reveals_t1.accountability_text")}</p>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("reveals_t1.policy")}</strong> {t("reveals_t1.policy_text")}</p>
        </section>

        {/* Tier 2 Expansion Toggle */}
        {!showT2 && (
          <div className={`mt-12 p-8 rounded-2xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gradient-to-br from-deep-swedish-blue/5 to-sacred-alliance-purple/5 border-deep-swedish-blue/20"}`}>
            <h3 className="text-2xl font-bold mb-4">{t("tier2_cta.title")}</h3>
            <p className="mb-4">{t("tier2_cta.p1")}</p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>{t("tier2_cta.includes1")}</li>
              <li>{t("tier2_cta.includes2")}</li>
              <li>{t("tier2_cta.includes3")}</li>
              <li>{t("tier2_cta.includes4")}</li>
            </ul>
            <button
              onClick={() => setShowT2(true)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${isDarkMode ? "bg-red-600 hover:bg-red-700 text-white" : "bg-blue-700 hover:bg-purple-700 text-white"}`}
            >
              {t("tier2_cta.button")} →
            </button>
          </div>
        )}

        {/* Tier 2: Full Investigation */}
        {showT2 && (
          <>
            <div className={`mt-12 mb-8 p-4 rounded-lg border-l-4 ${isDarkMode ? "bg-gray-800 border-purple-500" : "bg-purple-50 border-purple-600"}`}>
              <p className="font-semibold">{t("tier2_intro")}</p>
            </div>

            <section className="mb-12">
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("technical.title")}</h2>
              <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("technical.ballistics_title")}</h3>
              <p className="text-lg leading-relaxed mb-4 italic">{t("technical.ballistics")}</p>
              <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("technical.iff_title")}</h3>
              <p className="text-lg leading-relaxed mb-4 italic">{t("technical.iff")}</p>
            </section>

            <section className="mb-12">
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("authorization.title")}</h2>
              <pre className={`p-4 rounded-lg mb-4 overflow-x-auto ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}><code className="text-sm">{t("authorization.code")}</code></pre>
            </section>

            <section className="mb-12">
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("developer_full.title")}</h2>
              <pre className={`p-4 rounded-lg mb-4 overflow-x-auto ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}><code className="text-sm">{t("developer_full.code")}</code></pre>
              <p className="text-lg leading-relaxed mb-4"><strong>{t("developer_full.discovery")}</strong></p>
              <p className="text-lg leading-relaxed mb-4"><strong>{t("developer_full.but")}</strong></p>
            </section>

            <section className="mb-12">
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("training.title")}</h2>
              <p className="text-lg leading-relaxed mb-4">{t("training.audit")}</p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>✅ {t("training.covered1")}</li>
                <li>✅ {t("training.covered2")}</li>
                <li>✅ {t("training.covered3")}</li>
                <li>❌ <strong>{t("training.missing1")}</strong></li>
                <li>❌ <strong>{t("training.missing2")}</strong></li>
                <li>❌ <strong>{t("training.missing3")}</strong></li>
              </ul>
              <p className="text-lg leading-relaxed mb-4 italic">{t("training.testimony")}</p>
            </section>

            <section className="mb-12">
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("verdict_full.title")}</h2>
              <p className="text-lg leading-relaxed mb-6">{t("verdict_full.intro")}</p>

              <div className="mb-6">
                <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("verdict_full.elena_title")}</h3>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("verdict_full.elena_finding")}</strong> {t("verdict_full.elena_finding_text")}</p>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("verdict_full.elena_limitation")}</strong> {t("verdict_full.elena_limitation_text")}</p>
                <p className="text-lg leading-relaxed mb-2"><strong>{t("verdict_full.elena_mitigating")}</strong></p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>{t("verdict_full.elena_m1")}</li>
                  <li>{t("verdict_full.elena_m2")}</li>
                  <li>{t("verdict_full.elena_m3")}</li>
                </ul>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("verdict_full.elena_recommendation")}</strong> {t("verdict_full.elena_rec_text")}</p>
              </div>

              <div className="mb-6">
                <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("verdict_full.petrov_title")}</h3>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("verdict_full.petrov_finding")}</strong> {t("verdict_full.petrov_finding_text")}</p>
                <p className="text-lg leading-relaxed mb-2"><strong>{t("verdict_full.petrov_mitigating")}</strong></p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>{t("verdict_full.petrov_m1")}</li>
                  <li>{t("verdict_full.petrov_m2")}</li>
                  <li>{t("verdict_full.petrov_m3")}</li>
                </ul>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("verdict_full.petrov_recommendation")}</strong> {t("verdict_full.petrov_rec_text")}</p>
              </div>

              <div className="mb-6">
                <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("verdict_full.system_title")}</h3>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("verdict_full.system_finding")}</strong> {t("verdict_full.system_finding_text")}</p>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("verdict_full.system_but")}</strong> {t("verdict_full.system_but_text")}</p>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("verdict_full.system_problem")}</strong> {t("verdict_full.system_problem_text")}</p>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("verdict_full.system_recommendation")}</strong> {t("verdict_full.system_rec_text")}</p>
              </div>

              <div className="mb-6">
                <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("verdict_full.andersson_title")}</h3>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("verdict_full.andersson_finding")}</strong> {t("verdict_full.andersson_finding_text")}</p>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("verdict_full.andersson_but")}</strong> {t("verdict_full.andersson_but_text")}</p>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("verdict_full.andersson_recommendation")}</strong> {t("verdict_full.andersson_rec_text")}</p>
              </div>

              <div className="mb-6">
                <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("verdict_full.training_authority_title")}</h3>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("verdict_full.training_finding")}</strong> {t("verdict_full.training_finding_text")}</p>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("verdict_full.training_recommendation")}</strong> {t("verdict_full.training_rec_text")}</p>
              </div>

              <div className="mb-6">
                <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("verdict_full.chaos_title")}</h3>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("verdict_full.chaos_finding")}</strong> {t("verdict_full.chaos_finding_text")}</p>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("verdict_full.chaos_convergence")}</strong></p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("testimony.title")}</h2>
              <p className="text-lg leading-relaxed mb-4">{t("testimony.intro")}</p>
              <p className="text-lg leading-relaxed mb-4"><strong>{t("testimony.p1")}</strong></p>
              <p className="text-lg leading-relaxed mb-4"><strong>{t("testimony.p2")}</strong></p>
              <p className="text-lg leading-relaxed mb-4"><strong>{t("testimony.p3")}</strong></p>
              <p className="text-lg leading-relaxed mb-4"><strong>{t("testimony.p4")}</strong></p>
              <p className="text-lg leading-relaxed mb-4"><strong>{t("testimony.p5")}</strong></p>
              <p className="text-lg leading-relaxed mb-4"><strong>{t("testimony.p6")}</strong></p>
              <p className="text-lg leading-relaxed mb-4"><strong>{t("testimony.p7")}</strong></p>
              <p className="text-lg leading-relaxed mb-4"><strong>{t("testimony.p8")}</strong></p>
            </section>

            <section className="mb-12">
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("protocols.title")}</h2>
              
              <div className="mb-6">
                <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("protocols.mission_title")}</h3>
                <p className="text-lg leading-relaxed mb-2">{t("protocols.mission_p1")}</p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>{t("protocols.mission_r1")}</li>
                  <li>{t("protocols.mission_r2")}</li>
                  <li>{t("protocols.mission_r3")}</li>
                </ul>
                <p className="text-lg leading-relaxed mb-2">{t("protocols.mission_p2")}</p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>{t("protocols.mission_allowed1")}</li>
                  <li>{t("protocols.mission_allowed2")}</li>
                  <li>{t("protocols.mission_allowed3")}</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("protocols.critical_title")}</h3>
                <p className="text-lg leading-relaxed mb-2">{t("protocols.critical_p1")}</p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>{t("protocols.critical_eng")}</li>
                  <li>{t("protocols.critical_op")}</li>
                  <li><strong>{t("protocols.critical_crit")}</strong></li>
                </ul>
                <p className="text-lg leading-relaxed mb-4">{t("protocols.critical_p2")}</p>
              </div>

              <div className="mb-6">
                <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("protocols.training_title")}</h3>
                <p className="text-lg leading-relaxed mb-2">{t("protocols.training_p1")}</p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>{t("protocols.training_i1")}</li>
                  <li>{t("protocols.training_i2")}</li>
                  <li>{t("protocols.training_i3")}</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("protocols.dev_title")}</h3>
                <p className="text-lg leading-relaxed mb-2">{t("protocols.dev_p1")}</p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>{t("protocols.dev_i1")}</li>
                  <li>{t("protocols.dev_i2")}</li>
                  <li><strong>{t("protocols.dev_i3")}</strong></li>
                </ul>
                <p className="text-lg leading-relaxed mb-4">{t("protocols.dev_p2")}</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("nato.title")}</h2>
              <p className="text-lg leading-relaxed mb-6">{t("nato.intro")}</p>

              <div className="mb-6">
                <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("nato.cert_title")}</h3>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("nato.cert_current")}</strong> {t("nato.cert_current_text")}</p>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("nato.cert_problem")}</strong> {t("nato.cert_problem_text")}</p>
                <p className="text-lg leading-relaxed mb-2"><strong>{t("nato.cert_better")}</strong></p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>✅ {t("nato.cert_certified")}</li>
                  <li>❌ <strong>{t("nato.cert_not")}</strong></li>
                </ul>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("nato.cert_conclusion")}</strong></p>
              </div>

              <div className="mb-6">
                <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("nato.prov_title")}</h3>
                <p className="text-lg leading-relaxed mb-2">{t("nato.prov_trace")}</p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>{t("nato.prov_who")}</li>
                  <li>{t("nato.prov_what")}</li>
                  <li>{t("nato.prov_why")}</li>
                  <li>{t("nato.prov_limits")}</li>
                </ul>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("nato.prov_without")}</strong></p>
                <p className="text-lg leading-relaxed mb-2">{t("nato.prov_require")}</p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>{t("nato.prov_req1")}</li>
                  <li>{t("nato.prov_req2")}</li>
                  <li>{t("nato.prov_req3")}</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("nato.acct_title")}</h3>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("nato.acct_elena")}</strong> {t("nato.acct_elena_text")}</p>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("nato.acct_dev")}</strong> {t("nato.acct_dev_text")}</p>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("nato.acct_shared")}</strong></p>
                <p className="text-lg leading-relaxed mb-4">{t("nato.acct_list")}</p>
                <p className="text-lg leading-relaxed mb-4"><strong>{t("nato.acct_everyone")}</strong></p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("invitation.title")}</h2>
              <p className="text-lg leading-relaxed mb-2">{t("invitation.based")}</p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>{t("invitation.i1")}</li>
                <li>{t("invitation.i2")}</li>
                <li>{t("invitation.i3")}</li>
                <li>{t("invitation.i4")}</li>
                <li>{t("invitation.i5")}</li>
              </ul>
              <p className="text-lg leading-relaxed mb-4"><strong>{t("invitation.not_validated")}</strong></p>
              <p className="text-lg leading-relaxed mb-2"><strong>{t("invitation.questions")}</strong></p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>{t("invitation.q1")}</li>
                <li>{t("invitation.q2")}</li>
                <li>{t("invitation.q3")}</li>
                <li>{t("invitation.q4")}</li>
              </ul>
              <p className="text-lg leading-relaxed mb-2"><strong>{t("invitation.seeking")}</strong></p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>{t("invitation.s1")}</li>
                <li>{t("invitation.s2")}</li>
                <li>{t("invitation.s3")}</li>
                <li>{t("invitation.s4")}</li>
              </ul>
            </section>
          </>
        )}

        {/* Contact */}
        <div className={`mt-12 pt-8 border-t ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
          <p className="text-lg mb-4"><strong>{t("contact.label")}</strong> {t("contact.email")}</p>
          <p className="text-lg">{t("contact.bio")}</p>
        </div>
      </article>
    </div>
  );
}

