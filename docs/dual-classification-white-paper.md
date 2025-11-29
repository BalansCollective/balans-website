# Dual-Classification in Defense AI: Terminology and Best Practices

**Technical White Paper**  
**Target Audience:** Security Officers, Technical Architects, FMV Compliance

---

## Background and Need for Dual Classification

In traditional Swedish defense security (FSR – Försvarets säkerhetsregler), systems have a single classification level (often color-coded as Red/Yellow/Green) that dictates the handling of all information in that system. This one-dimensional approach is simpler but inflexible – everything in a "red" system is treated as highly classified even if some outputs are benign. As we introduce AI tools (models, agents, CLI utilities) into defense workflows, we face scenarios like a red system producing green data, i.e. a highly classified AI system generating unclassified outputs. This raises the need for dual classification: distinguishing the security level of the system or component itself versus the classification of data it processes or produces. In practice, this means defining a clear ubiquitous language to discuss:

- The classification of the system/algorithm (how it's built, what data/training it contains).
- The classification of the interface/capabilities (what it does, APIs or functions exposed).
- The classification of the content/output the system produces.

By establishing industry-aligned terminology for these dimensions, we can better design ML infrastructure that respects security rules while enabling usability. Below, we explore existing terms and approaches from NATO, U.S. DoD, and industry, and propose language suitable for conservative defense contexts (especially Swedish FMV/Saab).

---

## Established Terminology: System Classification vs Data Classification

NATO and U.S. DoD doctrine traditionally classify information (documents, data) and then accredit systems for a maximum classification level. It's common to refer to a system by the highest sensitivity of data it can handle – often called operating in "system-high" mode. In system-high operation, all data in the system is treated at the highest level present, and all users must be cleared to that level. This is a blunt but secure approach that avoids complex filtering. The downside is obvious: it over-classifies benign data, restricting lower-cleared users unnecessarily.

To counter that, the U.S. security community distinguishes between information classification and system classification as separate concepts. For example, Washington University's infosec policy explicitly differentiates "Data and information classification" (public, confidential, etc.) from "System classification" (how critical or sensitive an IT system is based on the data it handles). In that policy, system classification is determined by "the type of information [the system] stores and accesses" and the necessary controls, which maps to the highest data classification on that system. This mirrors DoD practice, where a system inherits the classification of its most sensitive content. In NATO terms, a system might be described as "NATO Secret accredited" versus the data which could range down to NATO Unclassified.

Crucially, NATO and allied militaries have developed vocabulary for multi-class systems. Multilevel Security (MLS) refers to systems designed to handle multiple data classification levels simultaneously, with internal segregation. An MLS system aims to "process information with incompatible classifications (different security levels), permit access by users with different clearances, and prevent users from obtaining access to information for which they lack authorization." In other words, it enforces that a user on the "green" side can only see green (unclassified) data even if the system also has red (secret) data in memory. Truly robust MLS systems are rare and require special operating systems or hypervisors with separation kernels.

A more common term in NATO circles is Multiple Independent Levels of Security (MILS) – essentially running separate single-level systems (one per classification) and carefully controlling exchange between them. MILS relies on physical or logical separation (e.g. separate networks/environments for Unclassified, Secret, etc.), and uses guards or cross-domain gateways to transfer data if needed. This is likely what FSR's "Red/Yellow/Green" environments correspond to. MILS avoids MLS's complexity by not mixing levels in one system – instead, you have, say, a Red network and a Green network, and a controlled interface between them.

---

## Key NATO/US Terms

Based on the above, the following terms are well-established and could be adopted in our context:

- **System Classification (System Security Level)** – the approved classification level of the system or component as a whole (e.g. "system-high SECRET"). This indicates the highest classification of data it can process and implies all content is treated at that level unless downgraded. The Swedish equivalent might be "systemets säkerhetsklass".

- **Data (Information) Classification** – the classification level of a specific piece of information or output (e.g. "this file is UNCLASSIFIED"). In Swedish: "informationsklassificering".

- **Multi-Level Security (MLS)** – a property of systems or software that enforce separation of data by classification within a single environment. Likely translated simply as "multinivå-säkerhet", though MLS is a known acronym in security circles.

- **Cross Domain Solution (CDS)** – an approved mechanism or system to transfer or share information between different classification domains (e.g. from a Secret network to an Unclassified network) without compromising security. In Sweden, this might be described functionally (e.g. "skyddad överföring mellan säkerhetsdomäner").

- **System-High Mode** – operating a system at the highest needed classification, thereby elevating all contained data to that level. This term is understood in US/NATO communities and highlights the limitation that everything gets classified as, say, SECRET by default.

- **Downgrading / Declassification** – the process of reviewing and re-marking information from a higher classification to a lower one (Swedish security regulations often use "sekretessgranskning" for the review step). For example, an analyst might declassify (or sanitize) certain outputs from a Secret AI model so they can be released as Unclassified.

Using these terms, we can articulate scenarios like: "This ML model runs system-high SECRET, but it can produce Unclassified (GREEN) outputs after a downgrading review." Such phrasing would be familiar to NATO-aligned security personnel.

---

## Red Forge Implementation

Red Forge implements dual-classification principles through:

1. **System-High Development Mode** - Development happens on classified (Yellow/Red) PCs, treating all code as SECRET during development.

2. **Zenoh Data Diode** - Functions as a Cross-Domain Solution (CDS), allowing one-way data flow from unclassified (Black PC) to classified (Yellow PC), while maintaining complete isolation in reverse.

3. **Classification-Aware IDE** - Tracks classification levels of code artifacts, suggesting safe downgrading paths for outputs that can be declassified.

4. **Chronicle Audit Logging** - Complete provenance tracking for all AI-assisted development, supporting post-hoc declassification reviews.

This approach balances:
- **Security:** Maintains strict separation (MILS approach)
- **Usability:** Enables AI assistance without compromising classified code
- **Compliance:** Meets ISM-2022 requirements for classified system development

---

## For More Information

**Contact:** Weaver Defense AB  
**Email:** samuel@dynorobotics.se  
**Website:** https://balans-collective.com/defense

This white paper supports:
- FMV compliance documentation
- NATO DIANA proposals
- iMUGS2 project architecture
- Defense contractor RFP responses

