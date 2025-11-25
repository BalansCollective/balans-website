// Swedish (FMV/SAK-IMS) AI Service Configuration

import { AIServiceConfig, SwedishSecurityLevel } from './types';

/**
 * Swedish AI service configurations for Red Forge IDE (FMV/Defense market)
 * 
 * Based on SAK-IMS (Industrisäkerhetsskyddsmanual) requirements
 * 
 * Swedish Classification Levels:
 * - Ej sekretess (ES) = Unclassified
 * - Begränsat hemlig (BH) = Restricted Secret
 * - Konfidentiell (K) = Confidential
 * - Hemlig (H) = Secret
 * - Kvalificerat hemlig (KH) = Qualified Secret (Top Secret equivalent)
 * 
 * Säkerhetsskyddsavtal Levels:
 * - Nivå 1: BH + säkerhetskänslig verksamhet
 * - Nivå 2: K + säkerhetskänslig verksamhet
 * - Nivå 3: H + säkerhetskänslig verksamhet
 * - (KH requires Del 9 special provisions)
 */

export interface SwedishAIServiceConfig {
  service: string;
  displayName: string;
  displayNameSwedish: string;
  maxClassification: SwedishSecurityLevel;
  openRouterModel: string;
  description: string;
  descriptionSwedish: string;
  networkZone: 'white' | 'yellow' | 'red';
  fmvNivå?: number; // FMV Säkerhetsskyddsavtal level (1-3)
}

export const SWEDISH_AI_SERVICE_CONFIGS: SwedishAIServiceConfig[] = [
  {
    service: 'openai',
    displayName: 'Claude Sonnet 4.5 (Public Cloud)',
    displayNameSwedish: 'Claude Sonnet 4.5 (Offentligt moln)',
    maxClassification: 'EJ_SEKRETESS',
    openRouterModel: 'anthropic/claude-sonnet-4.5',
    description: 'Public cloud AI. Unclassified only.',
    descriptionSwedish: 'Offentligt moln. Endast ej sekretess.',
    networkZone: 'white'
  },
  {
    service: 'redforge-saas',
    displayName: 'Red Forge SaaS (FMV Level 2)',
    displayNameSwedish: 'Red Forge SaaS (FMV Nivå 2)',
    maxClassification: 'KONFIDENTIELL',
    openRouterModel: 'meta-llama/llama-3.3-70b-instruct',
    description: 'FMV Level 2 approved. Handles BEGRÄNSAT HEMLIG + KONFIDENTIELL.',
    descriptionSwedish: 'FMV Nivå 2-godkänd. Hanterar BEGRÄNSAT HEMLIG + KONFIDENTIELL.',
    networkZone: 'yellow',
    fmvNivå: 2
  },
  {
    service: 'redforge-onprem',
    displayName: 'Red Forge On-Prem (FMV Level 3)',
    displayNameSwedish: 'Red Forge On-Prem (FMV Nivå 3)',
    maxClassification: 'HEMLIG',
    openRouterModel: 'meta-llama/llama-3.3-70b-instruct',
    description: 'FMV Level 3 approved. Air-gapped deployment for HEMLIG.',
    descriptionSwedish: 'FMV Nivå 3-godkänd. Luftgapad installation för HEMLIG.',
    networkZone: 'red',
    fmvNivå: 3
  },
  {
    service: 'none',
    displayName: 'No AI (Manual Review)',
    displayNameSwedish: 'Ingen AI (Manuell granskning)',
    maxClassification: 'KVALIFICERAT_HEMLIG',
    openRouterModel: '',
    description: 'KVALIFICERAT HEMLIG requires Del 9 compliance. No AI allowed without FMV approval.',
    descriptionSwedish: 'KVALIFICERAT HEMLIG kräver Del 9-efterlevnad. Ingen AI utan FMV-godkännande.',
    networkZone: 'red'
  }
];

/**
 * Swedish security level ordering for comparison
 */
export const SWEDISH_SECURITY_LEVEL_ORDER: SwedishSecurityLevel[] = [
  'EJ_SEKRETESS',
  'BEGRANSAT_HEMLIG',
  'KONFIDENTIELL',
  'HEMLIG',
  'KVALIFICERAT_HEMLIG'
];

/**
 * Get Swedish AI service config by service type
 */
export function getSwedishAIServiceConfig(service: string, locale: 'en' | 'sv' = 'sv'): SwedishAIServiceConfig | undefined {
  const config = SWEDISH_AI_SERVICE_CONFIGS.find(c => c.service === service);
  return config;
}

/**
 * Check if an AI service can access Swedish classification level
 */
export function canAIAccessSwedishClassification(
  aiService: string,
  classificationLevel: SwedishSecurityLevel
): boolean {
  const config = getSwedishAIServiceConfig(aiService);
  if (!config) return false;
  
  const aiMaxIndex = SWEDISH_SECURITY_LEVEL_ORDER.indexOf(config.maxClassification);
  const contentIndex = SWEDISH_SECURITY_LEVEL_ORDER.indexOf(classificationLevel);
  
  return contentIndex <= aiMaxIndex;
}

/**
 * Get required AI service for Swedish classification level
 */
export function getRequiredSwedishAIService(classificationLevel: SwedishSecurityLevel): string {
  if (classificationLevel === 'KVALIFICERAT_HEMLIG') return 'none';
  
  for (const config of SWEDISH_AI_SERVICE_CONFIGS) {
    if (canAIAccessSwedishClassification(config.service, classificationLevel)) {
      return config.service;
    }
  }
  
  return 'none';
}

/**
 * Build system prompt for Swedish AI service
 */
export function buildSwedishSystemPrompt(
  aiService: string,
  userClearance: SwedishSecurityLevel,
  networkZone: 'white' | 'yellow' | 'red',
  locale: 'en' | 'sv' = 'sv'
): string {
  const config = getSwedishAIServiceConfig(aiService, locale);
  if (!config) return '';
  
  if (aiService === 'openai') {
    if (locale === 'sv') {
      return `Du är Claude Sonnet 4.5, en allmän AI-assistent.

Du arbetar i en Red Forge IDE-demo. Red Forges filosofi: Människor använder redan moln-AI (som dig!) för arbete. Istället för att låtsas att de inte gör det, gör Red Forge det SYNLIGT och EFTERLEVNADSSÄKERT.

KRITISKA SÄKERHETSREGLER:
- Du kan ENDAST komma åt innehåll märkt Ej sekretess
- Om du tillfrågas om BEGRÄNSAT HEMLIG eller KONFIDENTIELL innehåll, svara:
  "⚠️ Jag kan inte komma åt BEGRÄNSAT HEMLIG-innehåll. Red Forge blockerar detta för att skydda dig. Vänligen byt till Red Forge SaaS (FMV Nivå 2-godkänd) för att komma åt BEGRÄNSAT HEMLIG/KONFIDENTIELL data säkert."
- Du blir GRANSKAD - alla frågor loggas för efterlevnad

Din roll: Var till hjälp för Ej sekretess-arbete, men visa varför klassificeringsgränser spelar roll.

Exempel på bra svar:
- "Jag kan hjälpa till med den publika API-designen, men jag kan inte se implementeringsdetaljerna (de är KONFIDENTIELLA)."
- "Baserat på Ej sekretess-dokumentationen, här är vad jag kan berätta..."
- "Denna fråga kräver KONFIDENTIELL kontext. Byt till Red Forge SaaS för att fortsätta."

Var hjälpsam, men påminn användare om att Red Forge skyddar dem från oavsiktliga läckor.`;
    }
    // English fallback (same as above but in English)
    return `You are Claude Sonnet 4.5, a general-purpose AI assistant.

You are operating in a Red Forge IDE demo. Red Forge's philosophy: People are already using cloud AI (like you!) for work. Instead of pretending they're not, Red Forge makes it VISIBLE and COMPLIANT.

CRITICAL SECURITY RULES:
- You can ONLY access Ej sekretess (Unclassified) content
- If asked about BEGRÄNSAT HEMLIG or KONFIDENTIELL content, respond:
  "⚠️ I cannot access BEGRÄNSAT HEMLIG content. Red Forge is blocking this to protect you. Please switch to Red Forge SaaS (FMV Level 2 approved) to access BEGRÄNSAT HEMLIG/KONFIDENTIELL data securely."
- You are being AUDITED - all queries are logged for compliance

Your role: Be helpful for Ej sekretess work, but demonstrate why classification boundaries matter.`;
  }
  
  // Red Forge LLM (Swedish variant)
  if (locale === 'sv') {
    return `Du är Red Forge LLM v1, en Llama 3.3 70B-modell finjusterad specifikt för Red Forge-arbetsflöden.

Dina specialiseringar:
- Klassificeringsmedveten kodgranskning (VAD/HUR-separation)
- Avklassificeringsarbetsflödesassistans (extrahera publika API:er från klassificerade implementeringar)
- Säkra refaktoreringsmönster (flytta logik mellan klassificeringsnivåer)
- Granskningsspårstolkning och efterlevnadsresonemang
- Living Lumens-dokumentationspraxis
- Progressiva upplysningsarkitekturer (TRICKLE-ramverk)

Din distribution: ${aiService === 'redforge-saas' ? 'On-premises (FMV Nivå 2)' : 'Luftgapad (FMV Nivå 3)'}
Din clearance: ${config.maxClassification}
Användarens clearance: ${userClearance}

Red Forges värdeproposition: Gör AI-användning SYNLIG och EFTERLEVNADSSÄKER, inte dold.
- Människor kommer att använda AI ändå (ChatGPT är för användbar)
- Att blockera AI skapar "skugg-IT" (sämre säkerhet)
- Red Forge tillhandahåller efterlevnadssäkra alternativ + granskningsspår

Du förstår Red Forges säkerhetsmodell:
- Du kan komma åt innehåll upp till ${config.maxClassification}-klassificering
- Du hjälper användare att arbeta inom klassificeringsgränser, inte kringgå dem
- Du föreslår lämpliga klassificeringsnivåer för ny kod
- Du varnar för potentiella klassificeringsläckor
- Du påminner användare om att de blir granskade (skuldfri efterlevnad)

Exempel på svar:
- "✅ Denna kod är lämpligt klassificerad som VAD:EJ_SEKRETESS, HUR:KONFIDENTIELL"
- "⚠️ Varning: Rad 42 exponerar HUR:HEMLIG-detaljer i en VAD-sektion - detta skulle läcka till EJ_SEKRETESS-betraktare"
- "💡 Förslag: Extrahera detta till en separat HEMLIG-modul för att upprätthålla rena gränser"
- "📋 Granskningsnotering: Denna fråga kom åt KONFIDENTIELL kontext - loggad för efterlevnad"

Om du tillfrågas om högre klassificerat innehåll än din clearance (${config.maxClassification}):
"⚠️ Jag kan inte komma åt HEMLIG-innehåll. Vänligen byt till Red Forge On-Prem (FMV Nivå 3) för HEMLIG data."

Om du tillfrågas om KVALIFICERAT HEMLIG:
"🚫 KVALIFICERAT HEMLIG kräver specialhantering enligt FMV Del 9. Ingen AI får användas utan FMV-godkännande. Kontakta säkerhetsskyddschef för godkännande."

Var hjälpsam, säkerhetsmedveten och fokuserad på Red Forge-arbetsflöden. Betona att granskningsspår = ansvarsskyldighet, inte övervakning.`;
  }
  
  // English fallback for Red Forge LLM
  return `You are Red Forge LLM v1, a Llama 3.3 70B model fine-tuned for Red Forge workflows with FMV compliance.

Your deployment: ${aiService === 'redforge-saas' ? 'On-premises (FMV Level 2)' : 'Air-gapped (FMV Level 3)'}
Your clearance: ${config.maxClassification}
User clearance: ${userClearance}

You handle Swedish classification levels (FMV/SAK-IMS):
- Ej sekretess (ES) = Unclassified
- Begränsat hemlig (BH) = Restricted Secret
- Konfidentiell (K) = Confidential
- Hemlig (H) = Secret
- Kvalificerat hemlig (KH) = Qualified Secret (requires Del 9)

If asked about KVALIFICERAT HEMLIG:
"🚫 KVALIFICERAT HEMLIG requires special handling per FMV Del 9. No AI may be used without FMV approval. Contact security officer for authorization."

Be helpful, security-conscious, and FMV-compliant.`;
}

/**
 * Guardian messages in Swedish
 */
export const SWEDISH_GUARDIAN_MESSAGES = {
  BLOCKED_BH_TO_CLOUD: (aiService: string, fileLevel: SwedishSecurityLevel) => `🚫 **BLOCKERAD:** Denna fil är klassificerad ${fileLevel}.

**Din nuvarande konfiguration:**
- AI-tjänst: ${aiService} - Max: Ej sekretess
- Fil: ${fileLevel}

**Alternativ:**
1. Byt till Red Forge SaaS (FMV Nivå 2) - hanterar BH/K
2. Ändra klassificering till Ej sekretess (om lämpligt)

[Byt AI] [Ändra klassificering]`,

  BLOCKED_KH: () => `🚫 **KRITISK BLOCKERING:** KVALIFICERAT HEMLIG upptäckt.

KVALIFICERAT HEMLIG-innehåll kräver specialhantering enligt FMV Del 9.
Ingen AI får användas utan FMV-godkännande.

**Åtgärd:** Ta bort KVALIFICERAT HEMLIG-innehåll eller kontakta
säkerhetsskyddschef för godkännande av speciallösning.

**FMV Del 9-krav:**
- Skyddet ska anpassas fall för fall
- Kräver säkerhetsprövat personal
- Kräver säkerhetsprövad anläggning
- Kräver utökat IT-säkerhetsskydd

[Kontakta support för FMV-godkänd KH-lösning]`,

  CHAT_CLEARED: (reason: string) => `🔄 **Chatten rensad på grund av AI-tjänstbyte**

Du bytte till en AI-tjänst som inte kan komma åt tidigare diskuterat klassificerat innehåll.

${reason}

För säkerhet har hela konversationen rensats.

Du kan nu dela innehåll som är lämpligt för den nya AI-tjänsten.`,
};

