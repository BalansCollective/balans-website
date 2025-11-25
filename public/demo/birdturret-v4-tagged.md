---
classification:
  what: CONFIDENTIAL
  how: SECRET
---

# BirdTurret V4: Guardian Protocol Integration

**Document Classification:** CONFIDENTIAL (Capabilities) / SECRET (Implementation)  
**Deployment Status:** Combat-proven, Ukraine field trials (2025 Q2)  
**FMV Status:** CONFIDENTIAL approved, SECRET certification pending

---

## Executive Summary

<What>

BirdTurret V4 represents the first operational integration of Guardian Protocol AI safety framework in autonomous weapon systems. Following successful deployment to Ukraine (12 units, Kyiv air defense, March-May 2025), the system demonstrated:

- **127 confirmed drone intercepts**
- **Zero civilian casualties**
- **Zero friendly fire incidents**
- **99.2% threat classification accuracy**

Guardian Protocol provides ethical AI decision-making with real-time human oversight capability. The system prevents autonomous weapon failures through multi-perspective reasoning and continuous safety validation.

</What>

<How>

Guardian Protocol implementation uses dual-AI architecture:
- **Guardian AI**: Conservative, safety-first reasoning (prevents false positives)
- **Magician AI**: Tactical, mission-focused reasoning (prevents false negatives)

Decisions require consensus between perspectives. Conflicts trigger human review within 850ms. System uses Rust-based real-time safety kernel with formal verification of critical paths. Chronicle audit trail provides immutable decision history for post-incident analysis.

Deployment architecture:
- Edge compute: NVIDIA Jetson AGX Orin (64GB)
- Safety kernel: Formally verified Rust (no unsafe blocks)
- Decision latency: <200ms (sensor to fire command)
- Audit logging: Chronicle (append-only, cryptographically signed)

</How>

---

## System Capabilities

<What>

### Autonomous Target Engagement

BirdTurret V4 operates fully autonomously within rules of engagement (ROE) boundaries:

**Threat Detection:**
- 360° radar coverage (dual X-band arrays)
- EO/IR sensor fusion for visual confirmation
- Acoustic signature analysis for drone type classification
- IFF integration (NATO Mode 5)

**Engagement Decision:**
- Guardian Protocol ethical reasoning
- ROE compliance verification
- Civilian risk assessment
- Human override capability (<1 second response time)

**Kinetic Response:**
- Automated turret slewing and tracking
- Burst fire control (optimized ammunition use)
- Multi-target engagement coordination
- Battle damage assessment

</What>

<How>

### Guardian Protocol Implementation Details

**Multi-Perspective Decision Engine:**

```rust
pub struct GuardianDecision {
    guardian_vote: ThreatAssessment,
    magician_vote: ThreatAssessment,
    consensus: Option<EngagementDecision>,
    conflict_reason: Option<String>,
    human_review_triggered: bool,
}

impl GuardianProtocol {
    pub fn evaluate_threat(&self, target: Target) -> GuardianDecision {
        // Guardian AI: Safety-first reasoning
        let guardian = self.guardian_ai.assess(target, Context::Safety);
        
        // Magician AI: Mission-focused reasoning
        let magician = self.magician_ai.assess(target, Context::Mission);
        
        // Check consensus
        if guardian.threat_level == magician.threat_level {
            return GuardianDecision {
                consensus: Some(guardian.decision),
                human_review_triggered: false,
                // ...
            };
        }
        
        // Conflict detected - trigger human review
        self.trigger_human_review(guardian, magician)
    }
}
```

**Safety Kernel Architecture:**

- Formally verified Rust (TockOS-based)
- No dynamic memory allocation in critical path
- Watchdog timers for liveness guarantees
- Fail-safe defaults (abort on uncertainty)

**Decision Latency Budget:**
- Sensor fusion: 50ms
- Guardian/Magician inference: 100ms
- Consensus validation: 20ms
- Fire control: 30ms
- **Total: <200ms** (combat-effective)

**Audit Trail Structure:**

Every decision logged to Chronicle with:
- Guardian reasoning (safety perspective)
- Magician reasoning (mission perspective)
- Consensus result or conflict trigger
- Sensor data snapshot (radar, EO/IR, acoustic)
- ROE compliance check results
- Human override events (if any)

All entries cryptographically signed, tamper-evident.

</How>

---

## Ukraine Deployment Results

<What>

### Operational Performance (March-May 2025)

**Deployment:**
- Location: Kyiv air defense perimeter
- Units deployed: 12 BirdTurret V4 systems
- Operational days: 67 days (24/7 coverage)
- Threat environment: High-intensity drone warfare

**Combat Results:**
- **Total intercepts**: 127 confirmed
- **False positives**: 0 (no friendly fire)
- **Civilian casualties**: 0 (Guardian Protocol prevented 3 risky engagements)
- **System uptime**: 98.7% (maintenance downtime only)

**Guardian Protocol Safety Events:**
- **Consensus decisions**: 124 (97.6%)
- **Conflict resolutions**: 3 (2.4%)
  - 2 resolved by human operator (ambiguous IFF)
  - 1 auto-abort (civilian proximity <50m)

**Key Insight:** Guardian Protocol's multi-perspective reasoning prevented all potential civilian harm incidents that traditional autonomous systems might have missed.

</What>

<How>

### Technical Performance Metrics

**Guardian AI Reasoning:**
- Conservative threat threshold: 85% confidence required
- Civilian risk model: EU ethical AI guidelines compliant
- False positive prevention: 100% effective (0 friendly fire)

**Magician AI Reasoning:**
- Tactical threat threshold: 70% confidence sufficient
- Mission priority: Air defense effectiveness maximized
- False negative prevention: 99.2% effective (127/128 threats engaged)

**Consensus Engine:**
- Agreement rate: 97.6% (124/127 engagements)
- Conflict resolution time: 850ms average (human review)
- Auto-abort triggers: 1 (civilian proximity rule)

**System Bottlenecks Identified:**
- EO/IR sensor latency in low-light: +30ms (improvable with better hardware)
- Human review UI response: 850ms average (training improved this from 1.2s)
- Chronicle audit logging: 5ms per entry (acceptable overhead)

**Lessons Learned:**
- Guardian Protocol prevents AI safety failures WITHOUT sacrificing combat effectiveness
- Human-AI symbiosis works: Operators trust the system, intervene only when needed
- Formal verification critical: Zero safety kernel failures in 67 days
- Audit trail essential: Post-engagement analysis revealed 2 sensor calibration issues

</How>

---

## Swedish Armed Forces Adoption

<What>

### Försvarsmakten Procurement

Following Ukraine validation, Swedish Armed Forces placed order for:
- **200 BirdTurret V4 units**
- **Integration with Swedish air defense network**
- **FMV certification path to SECRET deployment**

**Timeline:**
- Q3 2025: Initial 50-unit delivery (CONFIDENTIAL certification)
- Q4 2025: FMV SECRET certification review
- Q1 2026: Full 200-unit deployment (SECRET operational)

**Strategic Value:**
- Cost-effective SHORAD (€25K per unit vs €500K traditional)
- Ethical AI compliance (EU AI Act ready)
- Proven combat effectiveness (Ukraine validated)
- Swedish sovereignty (Dyno/Balans domestic supply chain)

</What>

<How>

### Integration Architecture

**Network Integration:**
- Zenoh-based pub/sub for sensor data sharing
- Centralized Chronicle audit aggregation
- Distributed Guardian Protocol coordination (multi-turret consensus)

**Classification Handling:**
- Red Forge IDE for classified development
- Dual WHAT/HOW classification enforcement
- Audit trail for FMV compliance reviews

**Security Posture:**
- Air-gapped deployment for SECRET systems
- USB-based software updates (signed, verified)
- Tamper-evident hardware (physical security)

**FMV Certification Requirements:**
- Guardian Protocol safety validation (formal methods proof)
- Chronicle audit trail review (6-month operational data)
- Penetration testing (external security audit)
- Ethical AI compliance (EU AI Act alignment)

</How>

---

## Classification Notes

**Why CONFIDENTIAL/SECRET?**

- **WHAT (CONFIDENTIAL)**: Combat effectiveness data from Ukraine is sensitive but not national security critical. Försvarsmakten wants this protected from competitors but not classified as SECRET.

- **HOW (SECRET)**: Guardian Protocol implementation details (AI reasoning, safety kernel architecture) are SECRET because:
  - Adversaries could exploit knowledge of decision-making logic
  - Formal verification methods are sensitive IP
  - Prevents "gaming" the ethical AI constraints

**Declassification Path:**

After 2-year operational period (2027), WHAT sections may be downgraded to UNCLASSIFIED for:
- Academic publications (AI safety case studies)
- Export marketing (international sales)
- EU AI Act compliance demonstrations

HOW sections remain SECRET indefinitely (national security IP).

---

## Contact

**Dyno Robotics AB**  
Classification: CONFIDENTIAL  
FMV Supplier Code: [REDACTED]  
Contact: William Ståhl (Project Manager)

**Balans Collective** (Red Forge tooling partner)  
Classification: UNCLASSIFIED  
Contact: Sam Lindgren (sam@balans-collective.com)

