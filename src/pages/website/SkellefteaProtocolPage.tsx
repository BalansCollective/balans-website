import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";

export function SkellefteaProtocolPage() {
  const { t } = useTranslation("skelleftea-protocol");
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
        <h2 className={`text-2xl font-semibold mb-8 ${isDarkMode ? "text-birch-white/80" : "text-gray-950/80"}`}>{t("subtitle")}</h2>

        {/* Reading Guide */}
        <section className="mb-12 p-6 bg-sage-green/10 rounded-lg border border-sage-green/30">
          <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("reading_guide.title")}</h3>
          <ul className="space-y-2 mb-4">
            <li className="mb-4">{t("reading_guide.ai_risk")}</li>
            <li className="mb-4">{t("reading_guide.tier1")}</li>
            <li className="mb-4">{t("reading_guide.tier2")}</li>
          </ul>
          <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("reading_guide.if_you_are")}</h4>
          <ul className="space-y-2">
            <li className="mb-4">{t("reading_guide.new_to_hypomania")}</li>
            <li className="mb-4">{t("reading_guide.family_member")}</li>
            <li className="mb-4">{t("reading_guide.medical_professional")}</li>
            <li className="mb-4">{t("reading_guide.ai_researcher")}</li>
          </ul>
        </section>

        {/* AI Risk Section */}
        <section className="mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("ai_risk.title")}</h2>
          <p className="text-lg leading-relaxed mb-4">{t("ai_risk.p1")}</p>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("ai_risk.p2")}</strong></p>
          <p className="text-lg leading-relaxed mb-4">{t("ai_risk.p3")}</p>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("ai_risk.both_sides")}</strong></p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li className="mb-4">{t("ai_risk.amplification")}</li>
            <li className="mb-4">{t("ai_risk.anchoring")}</li>
          </ul>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("ai_risk.countermeasure")}</strong></p>

          <h3 className={`text-2xl font-bold mt-8 mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("ai_risk.prerequisites.title")}</h3>
          <p className="text-lg leading-relaxed mb-4">{t("ai_risk.prerequisites.intro")}</p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li className="mb-4">{t("ai_risk.prerequisites.medical")}</li>
            <li className="mb-4">{t("ai_risk.prerequisites.family")}</li>
            <li className="mb-4">{t("ai_risk.prerequisites.technical")}</li>
            <li className="mb-4">{t("ai_risk.prerequisites.insight")}</li>
            <li className="mb-4">{t("ai_risk.prerequisites.stability")}</li>
          </ul>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("ai_risk.prerequisites.warning")}</strong></p>

          <h3 className={`text-2xl font-bold mt-8 mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("ai_risk.what_this_shows.title")}</h3>
          <p className="text-lg leading-relaxed mb-4">{t("ai_risk.what_this_shows.intro")}</p>
          <ol className="list-decimal list-inside mb-4 space-y-2">
            <li className="mb-4">{t("ai_risk.what_this_shows.point1")}</li>
            <li className="mb-4">{t("ai_risk.what_this_shows.point2")}</li>
            <li className="mb-4">{t("ai_risk.what_this_shows.point3")}</li>
            <li className="mb-4">{t("ai_risk.what_this_shows.point4")}</li>
          </ol>
          <p className="text-lg leading-relaxed mb-4"><strong>{t("ai_risk.disclaimer")}</strong></p>
        </section>

        {/* Tier 1: The Hook */}
        <section className="mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("tier1.title")}</h2>
          <p className="text-sm text-gray-500 mb-6">{t("tier1.meta")}</p>

          <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("tier1.recognition.title")}</h3>
          {t("tier1.recognition.content", { returnObjects: true }).map((para: string, i: number) => (
            <p key={i} className="text-lg leading-relaxed mb-4">{para}</p>
          ))}

          <h3 className={`text-2xl font-bold mt-8 mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("tier1.break.title")}</h3>
          {t("tier1.break.content", { returnObjects: true }).map((para: string, i: number) => (
            <p key={i} className="text-lg leading-relaxed mb-4">{para}</p>
          ))}

          <h3 className={`text-2xl font-bold mt-8 mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("tier1.cost.title")}</h3>
          {t("tier1.cost.content", { returnObjects: true }).map((para: string, i: number) => (
            <p key={i} className="text-lg leading-relaxed mb-4">{para}</p>
          ))}

          <h3 className={`text-2xl font-bold mt-8 mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("tier1.build.title")}</h3>
          {t("tier1.build.content", { returnObjects: true }).map((para: string, i: number) => (
            <p key={i} className="text-lg leading-relaxed mb-4">{para}</p>
          ))}

          <h3 className={`text-2xl font-bold mt-8 mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("tier1.resolution.title")}</h3>
          {t("tier1.resolution.content", { returnObjects: true }).map((para: string, i: number) => (
            <p key={i} className="text-lg leading-relaxed mb-4">{para}</p>
          ))}

          <div className="mt-8 p-6 bg-sage-green/10 rounded-lg border border-sage-green/30">
            <p className="text-lg leading-relaxed"><strong>{t("tier1.pattern")}</strong></p>
          </div>
        </section>

        {/* Expand T2 Button */}
        <div className="flex justify-center my-12">
          <button
            onClick={() => setShowT2(!showT2)}
            className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
              isDarkMode
                ? "bg-sage-green/20 text-sage-green hover:bg-sage-green/30 border border-sage-green/50"
                : "bg-sage-green text-white hover:bg-sage-green/90"
            }`}
          >
            {showT2 ? t("collapse_t2") : t("expand_t2")}
          </button>
        </div>

        {/* Tier 2: Full Investigation */}
        {showT2 && (
          <section className="mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("tier2.title")}</h2>
            <p className="text-lg leading-relaxed mb-8 text-gray-500">{t("tier2.note")}</p>
            <p className="text-lg leading-relaxed mb-4">{t("tier2.coming_soon")}</p>
          </section>
        )}

        {/* Contact Section */}
        <section className="mt-16 p-8 bg-sage-green/10 rounded-lg border border-sage-green/30">
          <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-birch-white" : "text-gray-950"}`}>{t("contact.title")}</h3>
          <p className="text-lg leading-relaxed mb-4">{t("contact.p1")}</p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-sage-green text-white rounded-lg hover:bg-sage-green/90 transition-colors"
          >
            {t("contact.button")}
          </a>
        </section>
      </article>
    </div>
  );
}

export default SkellefteaProtocolPage;

