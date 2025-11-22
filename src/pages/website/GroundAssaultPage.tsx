import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";

export function GroundAssaultPage() {
  const { t } = useTranslation("ground-assault");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const context = sessionStorage.getItem("lastContext");
    setIsDarkMode(context === "dark");
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0a0e14] text-birch-white" : "bg-[#f8f6f0] text-gray-950"}`}>
      <Navigation />

      <div className="max-w-4xl mx-auto px-6 lg:px-12 pt-24 pb-8">
        <span className="text-sm text-gray-500">{t("reading_time")}</span>
      </div>

      <article
        className={`max-w-4xl mx-auto px-6 lg:px-12 py-8 prose prose-lg ${
          isDarkMode ? "prose-invert prose-headings:text-birch-white prose-p:text-birch-white/90 prose-strong:text-birch-white prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-code:text-gray-100" : "prose-headings:text-gray-950 prose-p:text-gray-950/90 prose-strong:text-gray-950 prose-pre:bg-gray-100 prose-pre:text-gray-900 prose-code:text-gray-900"
        }`}
      >
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-xl mb-6">{t("subtitle")}</p>

        {/* Question First */}
        <h2>{t("question.title")}</h2>
        <p>{t("question.p1")}</p>
        <p>{t("question.p2")}</p>
        <p>{t("question.p3")}</p>
        <p><strong>{t("question.p4")}</strong></p>
        <p>{t("question.p5")}</p>

        {/* Ukraine Problem */}
        <h2>{t("ukraine.title")}</h2>
        <p>{t("ukraine.p1")}</p>
        <p>{t("ukraine.p2")}</p>
        <p>{t("ukraine.p3")}</p>
        <p><strong>{t("ukraine.results_title")}</strong></p>
        <ul>
          <li>{t("ukraine.r1")}</li>
          <li>{t("ukraine.r2")}</li>
          <li>{t("ukraine.r3")}</li>
          <li>{t("ukraine.r4")}</li>
        </ul>
        <p><strong>{t("ukraine.then")}</strong></p>

        {/* Adaptation */}
        <h2>{t("adaptation.title")}</h2>
        <p><strong>{t("adaptation.time")}</strong></p>
        <p>{t("adaptation.p1")}</p>
        <p>{t("adaptation.p2")}</p>
        <p>{t("adaptation.p3")}</p>
        <p>{t("adaptation.p4")}</p>
        <p><strong>{t("adaptation.protocol_title")}</strong></p>
        <ul>
          <li>{t("adaptation.proto1")}</li>
          <li>{t("adaptation.proto2")}</li>
          <li><strong>{t("adaptation.proto3")}</strong></li>
        </ul>
        <p>{t("adaptation.p5")}</p>

        {/* System Design */}
        <h2>{t("system.title")}</h2>
        <p><strong>{t("system.primary_title")}</strong></p>
        <ul>
          <li>{t("system.prim1")}</li>
          <li>{t("system.prim2")}</li>
          <li>{t("system.prim3")}</li>
          <li>{t("system.prim4")}</li>
          <li>{t("system.prim5")}</li>
        </ul>
        <p><strong>{t("system.why_shotguns")}</strong> {t("system.shotguns_reason")}</p>
        <p><strong>{t("system.dire_title")}</strong></p>
        <ul>
          <li>{t("system.dire1")}</li>
          <li>{t("system.dire2")}</li>
          <li><strong>{t("system.dire3")}</strong></li>
          <li>{t("system.dire4")}</li>
        </ul>
        <p><strong>{t("system.constraints_title")}</strong></p>
        <ul>
          <li>{t("system.con1")}</li>
          <li>{t("system.con2")}</li>
          <li>{t("system.con3")}</li>
          <li>{t("system.con4")}</li>
        </ul>
        <p>{t("system.p6")}</p>
        <p>{t("system.p7")}</p>

        {/* The Assault */}
        <h2>{t("assault.title")}</h2>
        <p><strong>{t("assault.time")}</strong></p>
        <p>{t("assault.p1")}</p>
        <p>{t("assault.p2")}</p>
        <p>{t("assault.p3")}</p>
        <p>{t("assault.p4")}</p>
        <pre><code>{t("assault.code")}</code></pre>
        <p><strong>{t("assault.if_nothing")}</strong> {t("assault.nothing_result")}</p>
        <p><strong>{t("assault.if_authorize")}</strong> {t("assault.authorize_result")}</p>
        <p><strong>{t("assault.audit_capture")}</strong> {t("assault.audit_result")}</p>
        <p>{t("assault.p5")}</p>

        {/* The Decision */}
        <h2>{t("decision.title")}</h2>
        <p>{t("decision.p1")}</p>
        <p>{t("decision.p2")}</p>
        <p>{t("decision.p3")}</p>
        <p>{t("decision.p4")}</p>
        <p><strong>{t("decision.q1")}</strong></p>
        <p>{t("decision.a1")}</p>
        <p><strong>{t("decision.q2")}</strong></p>
        <p>{t("decision.a2")}</p>
        <p>{t("decision.p5")}</p>
        <p><strong>{t("decision.petrov1")}</strong></p>
        <p><strong>{t("decision.elena1")}</strong></p>
        <p>{t("decision.p6")}</p>
        <p><strong>{t("decision.petrov2")}</strong></p>
        <p>{t("decision.p7")}</p>
        <p>{t("decision.p8")}</p>
        <p><strong>{t("decision.elena_speaks")}</strong></p>
        <pre><code>{t("decision.code")}</code></pre>
        <p><strong>{t("decision.turrets")}</strong></p>

        {/* Engagement */}
        <h2>{t("engagement.title")}</h2>
        <p>{t("engagement.p1")}</p>
        <p>{t("engagement.p2")}</p>
        <p>{t("engagement.p3")}</p>
        <p><strong>{t("engagement.boom1")}</strong></p>
        <p>{t("engagement.result1")}</p>
        <p><strong>{t("engagement.boom2")}</strong></p>
        <p>{t("engagement.result2")}</p>
        <p><strong>{t("engagement.boom3")}</strong></p>
        <p>{t("engagement.result3")}</p>
        <p>{t("engagement.p4")}</p>
        <p><strong>{t("engagement.boom4")}</strong></p>
        <p>{t("engagement.result4")}</p>
        <p>{t("engagement.p5")}</p>
        <p><strong>{t("engagement.not_wonder")}</strong></p>
        <p>{t("engagement.p6")}</p>
        <p>{t("engagement.p7")}</p>
        <p>{t("engagement.log_title")}</p>
        <pre><code>{t("engagement.code")}</code></pre>
        <p><strong>{t("engagement.over")}</strong></p>
        <p>{t("engagement.p8")}</p>
        <p>{t("engagement.p9")}</p>
        <p>{t("engagement.p10")}</p>

        {/* Reveal */}
        <h2>{t("reveal.title")}</h2>
        <p>{t("reveal.p1")}</p>
        <p>{t("reveal.p2")}</p>
        <p>{t("reveal.p3")}</p>
        <p>{t("reveal.p4")}</p>
        <p><strong>{t("reveal.colonel1")}</strong></p>
        <p>{t("reveal.explanation")}</p>
        <p>{t("reveal.p5")}</p>
        <p><strong>{t("reveal.purpose")}</strong> {t("reveal.purpose_text")}</p>
        <p>{t("reveal.p6")}</p>
        <pre><code>{t("reveal.code")}</code></pre>
        <p>{t("reveal.p7")}</p>
        <p>{t("reveal.elena_q")}</p>
        <p><strong>{t("reveal.answer")}</strong></p>
        <p><strong>{t("reveal.elena_q2")}</strong></p>
        <p>{t("reveal.answer2")}</p>

        {/* What Happened */}
        <h2>{t("happened.title")}</h2>
        <p><strong>{t("happened.system_title")}</strong></p>
        <ul>
          <li>{t("happened.s1")}</li>
          <li>{t("happened.s2")}</li>
          <li><strong>{t("happened.s3")}</strong></li>
          <li>{t("happened.s4")}</li>
          <li>{t("happened.s5")}</li>
          <li>{t("happened.s6")}</li>
        </ul>
        <p><strong>{t("happened.judgment_title")}</strong></p>
        <ul>
          <li>{t("happened.j1")}</li>
          <li><strong>{t("happened.j2")}</strong></li>
          <li>{t("happened.j3")}</li>
          <li>{t("happened.j4")}</li>
          <li><strong>{t("happened.j5")}</strong></li>
        </ul>
        <p><strong>{t("happened.audit_title")}</strong></p>
        <ul>
          <li>{t("happened.a1")}</li>
          <li>{t("happened.a2")}</li>
          <li>{t("happened.a3")}</li>
          <li>{t("happened.a4")}</li>
          <li>{t("happened.a5")}</li>
          <li><strong>{t("happened.a6")}</strong></li>
        </ul>
        <p><strong>{t("happened.question")}</strong></p>
        <p>{t("happened.question_text")}</p>
        <p>{t("happened.p8")}</p>
        <p><strong>{t("happened.battle")}</strong></p>

        {/* Investigation */}
        <h2>{t("investigation.title")}</h2>
        <p><strong>{t("investigation.board_title")}</strong></p>
        <ul>
          <li>{t("investigation.b1")}</li>
          <li>{t("investigation.b2")}</li>
          <li>{t("investigation.b3")}</li>
          <li>{t("investigation.b4")}</li>
        </ul>
        <p><strong>{t("investigation.q1_title")}</strong></p>
        <p><strong>{t("investigation.military")}</strong> {t("investigation.mil_answer")}</p>
        <p><strong>{t("investigation.legal")}</strong> {t("investigation.legal_answer")}</p>
        <p><strong>{t("investigation.technical")}</strong> {t("investigation.tech_answer")}</p>
        <p><strong>{t("investigation.verdict_title")}</strong> <strong>{t("investigation.verdict")}</strong></p>
        <p><strong>{t("investigation.elena_title")}</strong></p>
        <ul>
          <li>{t("investigation.e1")}</li>
          <li>{t("investigation.e2")}</li>
          <li>{t("investigation.e3")}</li>
          <li>{t("investigation.e4")}</li>
          <li>{t("investigation.e5")}</li>
        </ul>
        <p><strong>{t("investigation.system_title")}</strong></p>
        <ul>
          <li>{t("investigation.sys1")}</li>
          <li>{t("investigation.sys2")}</li>
          <li>{t("investigation.sys3")}</li>
        </ul>
        <p><strong>{t("investigation.test_title")}</strong></p>
        <ul>
          <li>{t("investigation.t1")}</li>
          <li>{t("investigation.t2")}</li>
          <li>{t("investigation.t3")}</li>
        </ul>

        {/* Three Who Passed */}
        <h2>{t("three.title")}</h2>
        <p><strong>{t("three.question")}</strong></p>
        <p><strong>{t("three.two_title")}</strong></p>
        <p>{t("three.two_text")}</p>
        <p><strong>{t("three.response_title")}</strong> {t("three.response")}</p>
        <p>{t("three.outcome1")}</p>
        <p><strong>{t("three.one_title")}</strong></p>
        <p>{t("three.one_text")}</p>
        <p>{t("three.commander")}</p>
        <p>{t("three.outcome2")}</p>
        <p><strong>{t("three.key")}</strong> {t("three.key_text")}</p>

        {/* Six Months Later */}
        <h2>{t("sixmonths.title")}</h2>
        <p>{t("sixmonths.p1")}</p>
        <p><strong>{t("sixmonths.framework_title")}</strong></p>
        <ul>
          <li>{t("sixmonths.f1")}</li>
          <li><strong>{t("sixmonths.f2")}</strong></li>
          <li>{t("sixmonths.f3")}</li>
        </ul>
        <p><strong>{t("sixmonths.deployment")}</strong></p>
        <p>{t("sixmonths.scenario")}</p>
        <p>{t("sixmonths.request")}</p>
        <p><strong>{t("sixmonths.command_title")}</strong> {t("sixmonths.command")}</p>
        <p>{t("sixmonths.outcome")}</p>
        <p><strong>{t("sixmonths.review_title")}</strong> {t("sixmonths.review")}</p>

        {/* What This Reveals */}
        <h2>{t("reveals.title")}</h2>
        <p>{t("reveals.p1")}</p>
        <p>{t("reveals.p2")}</p>
        <p><strong>{t("reveals.eight")}</strong> {t("reveals.eight_text")}</p>
        <p><strong>{t("reveals.question")}</strong></p>
        <h3>{t("reveals.policy_title")}</h3>
        <p><strong>{t("reveals.adaptation")}</strong></p>
        <p>{t("reveals.examples")}</p>
        <p><strong>{t("reveals.question2")}</strong> {t("reveals.question2_text")}</p>
        <p><strong>{t("reveals.elena_title")}</strong></p>
        <ul>
          <li>{t("reveals.el1")}</li>
          <li>{t("reveals.el2")}</li>
          <li><strong>{t("reveals.el3")}</strong></li>
        </ul>
        <p><strong>{t("reveals.conclusion")}</strong></p>

        {/* For NATO/EU */}
        <h2>{t("nato.title")}</h2>
        <p>{t("nato.intro")}</p>
        <h3>{t("nato.creep_title")}</h3>
        <p>{t("nato.creep_text")}</p>
        <p><strong>{t("nato.creep_conclusion")}</strong></p>
        <h3>{t("nato.field_title")}</h3>
        <p>{t("nato.field_text")}</p>
        <p><strong>{t("nato.field_conclusion")}</strong></p>
        <p>{t("nato.field_text2")}</p>
        <h3>{t("nato.graduated_title")}</h3>
        <p>{t("nato.graduated_intro")}</p>
        <ul>
          <li><strong>{t("nato.g1_title")}</strong> {t("nato.g1")}</li>
          <li><strong>{t("nato.g2_title")}</strong> {t("nato.g2")}</li>
          <li><strong>{t("nato.g3_title")}</strong> {t("nato.g3")}</li>
        </ul>
        <p><strong>{t("nato.graduated_conclusion")}</strong></p>

        {/* Invitation */}
        <h2>{t("invitation.title")}</h2>
        <p>{t("invitation.p1")}</p>
        <ul>
          <li>{t("invitation.i1")}</li>
          <li>{t("invitation.i2")}</li>
          <li>{t("invitation.i3")}</li>
        </ul>
        <p><strong>{t("invitation.not_validated")}</strong></p>
        <p>{t("invitation.seeking")}</p>
        <ul>
          <li>{t("invitation.s1")}</li>
          <li>{t("invitation.s2")}</li>
          <li>{t("invitation.s3")}</li>
          <li>{t("invitation.s4")}</li>
        </ul>
        <p><strong>{t("invitation.resonates")}</strong></p>
        <p>{t("invitation.question")}</p>
        <p><strong>{t("invitation.testing")}</strong></p>

        {/* Author's Note */}
        <h2>{t("authornote.title")}</h2>
        <p>{t("authornote.intro")}</p>
        <p><strong>{t("authornote.drones_title")}</strong> {t("authornote.drones")}</p>
        <p><strong>{t("authornote.turrets_title")}</strong> {t("authornote.turrets")}</p>
        <p><strong>{t("authornote.adaptation_title")}</strong> {t("authornote.adaptation")}</p>
        <p><strong>{t("authornote.creep_title")}</strong> {t("authornote.creep")}</p>
        <p><strong>{t("authornote.shotguns_title")}</strong> {t("authornote.shotguns")}</p>
        <p><strong>{t("authornote.guardian_title")}</strong> {t("authornote.guardian")}</p>

        {/* Contact */}
        <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
          <p><strong>{t("contact.resonates")}</strong></p>
          <p><strong>{t("contact.label")}</strong> {t("contact.email")}<br />
          <strong>{t("contact.more_label")}</strong> <a href="https://balans-collective.com/guardian-protocol" className="text-blue-600 hover:underline">{t("contact.more_link")}</a></p>
          <p className="mt-4">{t("contact.bio")}</p>
        </div>
      </article>
    </div>
  );
}

