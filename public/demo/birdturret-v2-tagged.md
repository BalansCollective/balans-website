---
classification:
  what: UNCLASSIFIED
  how: UNCLASSIFIED
---

# The Four Towers

**A BirdTurret V2 Field Test Narrative**

---

**Setting:** October 2025. Forward Operating Base (FOB), Eastern Ukraine.  
**Protagonist:** Samuel Lindgren (civilian consultant, first-time operator).  
**Challenge:** Prove multi-tower coordination can provide 360° drone defense.  
**Stakes:** V1 had blind spots. One tower can't cover everything. Four towers might.

---

## Part 1: The Upgrade

<What>
Three months after the V1 single-tower test, Samuel returns to the same FOB. But this time, there are **four towers**.

"North, South, East, West," the engineer explains, pointing to the map. "Each tower covers 90°. You switch between them."

"Like an RTS game?" Samuel asks.

"Exactly. Real-Time Strategy. Click a tower, see its camera, control its weapons. The interface will feel familiar."

Samuel looks at the screen. Four camera feeds. Four sectors. One operator.

"V1 had blind spots," he remembers. "One tower couldn't see drones approaching from behind."

"V2 fixes that. 360° coverage. You'll never lose situational awareness again."
</What>

<How>
**Hardware Upgrade (V1 → V2):**

**V1 Configuration:**
- 1 tower (South position)
- 1 RF jammer (omnidirectional, 360°)
- No kinetic backup
- Coverage: ~90° effective (front-facing)
- Blind spots: 270° (sides + rear)

**V2 Configuration:**
- 4 towers (North, South, East, West)
- 4 RF jammers (directional, 30° beam each)
- 4 net launchers (20-50m range, 12 nets each)
- Coverage: 360° (operator switches towers)
- Blind spots: None (overlapping sectors)

**Directional RF Jamming:**
- Beam width: 30° (vs 360° omnidirectional in V1)
- Gain: 10-15 dBi (directional focusing)
- Power: Same as V1 (200W), but concentrated
- Benefit: 10x range improvement in target direction
- Tradeoff: Must aim (no longer "set and forget")

**Net Launcher Integration:**
- Model: SkyWall Net Cannon (modified for gimbal mount)
- Range: 20-50m (optimal 30-40m)
- Ammunition: 12 nets per tower (48 total)
- Reload: Manual (operator inserts new net cartridge via tower hatch)
- Use case: Last-ditch kinetic for RF-immune threats
</How>

---

## Part 2: The Interface

<What>
Samuel sits at the operator station. The screen shows:

**Four quadrants:**
- Top-left: North tower view
- Top-right: East tower view
- Bottom-left: South tower view
- Bottom-right: West tower view

"Click a tower to go full-screen," the engineer says.

Samuel clicks **South**. The view expands. Camera feed fills the screen. Below it:
- **RF Jammer:** Armed, ready
- **Net Launcher:** 12/12 shots
- **Sector:** 180-270° (South-West)

"You aim the jammer like a weapon," the engineer continues. "Point. Click. 30° beam."

"What if a drone comes from behind me?"

"You switch towers. Press **N** for North, **E** for East, **S** for South, **W** for West. Keyboard shortcuts. Fast."

Samuel tests it. Press **E**. East tower full-screen. Press **S**. Back to South.

"This feels... intuitive."

"That's the point. We studied how gamers manage multiple units. Same principles. Real-Time Strategy, but real."
</What>

<How>
**Operator Interface Specifications:**

**Screen Layout:**
```
┌─────────────┬─────────────┐
│  North [N]  │  East [E]   │  ← Quadrant view (default)
├─────────────┼─────────────┤
│  South [S]  │  West [W]   │
└─────────────┴─────────────┘

[Press tower key for full-screen mode]

┌───────────────────────────┐
│   South Tower (Active)    │  ← Full-screen view
│   Camera Feed             │
│   [RF Jammer: Armed]      │
│   [Net Launcher: 12/12]   │
│   [Sector: 180-270°]      │
└───────────────────────────┘
```

**Control Mapping:**
- **Tower switching:** N/E/S/W keys (instant, <50ms latency)
- **Quadrant view:** Q key (overview mode)
- **RF jammer aim:** Mouse cursor (crosshair on camera feed)
- **RF jammer fire:** Left-click (200ms pulse)
- **Net launcher fire:** Right-click (manual trigger)
- **Emergency abort:** Spacebar (all towers safe mode)

**Camera System:**
- Type: Thermal + optical (dual-band)
- Resolution: 1920×1080 @ 30fps (thermal), 4K @ 60fps (optical)
- Gimbal: ODrive Pro (360° pan, 90° tilt)
- Auto-tracking: Jetson Orin Nano CV (target detection + lock)
- Range: 500m effective (thermal), 1km (optical with zoom)

**RTS-Inspired Design Principles:**
1. **Spatial awareness:** Minimap shows all tower FOVs + detected threats
2. **Hotkeys:** Muscle memory (N/E/S/W faster than mouse-clicking towers)
3. **Visual feedback:** Red box = hostile, yellow = unknown, green = friendly
4. **Audio cues:** Beep on detection (pitch varies by threat level)
5. **APM optimization:** Actions Per Minute tracked (good operators: 40-60 APM)
</How>

---

## Part 3: The First Contact

<What>
**14:23 local time. Red box appears.**

"Contact," Samuel calls out. "East sector. 400 meters."

He presses **E**. East tower full-screen. The camera auto-tracks: DJI Mavic, cruising at 120 meters altitude.

Samuel moves the cursor over the drone. Crosshair turns red.

"RF jammer ready," the system confirms.

Samuel clicks.

**Result:** The DJI enters failsafe mode. Returns home.

"First kill," the engineer notes. "Well, first *jam*. No net needed."

Samuel switches back to quadrant view. **Press Q.**

"That was easy," he says.

"Most will be. DJI drones have built-in failsafe. When GPS is jammed, they go home. 60-80% of drones work this way."

"What about the other 20-40%?"

"That's why you have nets."
</What>

<How>
**Engagement Sequence (First Contact):**

**T+0.0s:** Jetson CV detects target (East tower, 400m range)
- Visual classification: DJI Mavic (0.89 confidence)
- Size: 0.3m wingspan (consumer drone)
- Speed: 12 m/s (cruise speed)
- Altitude: 120m AGL

**T+0.5s:** System generates red box (hostile classification)
- IFF query: No friendly transponder
- Behavior: Loitering pattern (recon profile)
- Threat level: LOW (surveillance, not attack)

**T+1.0s:** Samuel switches to East tower (hotkey: E)
- Latency: 42ms (tower switch + camera stream)
- Auto-tracking: Gimbal locks onto target (30ms)

**T+2.0s:** Samuel aims RF jammer (cursor on target)
- Beam angle: 30° cone centered on target
- Range: 400m (within 500m effective range)
- Frequency: 2.4 GHz + 5.8 GHz (dual-band)

**T+2.5s:** Samuel fires RF jammer (left-click)
- Pulse duration: 200ms (brief burst)
- Power: 200W (concentrated in 30° beam)
- Effective Radiated Power: ~2kW (10-15 dBi directional gain)

**T+2.7s:** DJI Mavic enters failsafe mode
- GPS signal lost (jammed)
- Control link disrupted (2.4 GHz jammed)
- Return-to-home (RTH) activated (onboard IMU navigation)

**T+10.0s:** Target leaves airspace
- Drone returns to launch point (outside FOB perimeter)
- No kinetic engagement required
- Net launcher unused (12/12 remaining)

**Ukraine Research Validation:**
- RF jamming effectiveness: 60-80% (RUSI, OSW reports)
- DJI failsafe behavior: Standard (confirmed in multiple studies)
- Jamming range: 400m achievable with 200W + directional beam
</How>

---

## Part 4: The Momentum Threat

<What>
**Day 2. 11:47 local time.**

Red box. **South tower. 300 meters.**

Samuel switches. **Press S.**

FPV racing drone. Diving.

"Fast," Samuel mutters. "60 meters per second."

He aims. RF jammer fires.

**The drone's control cuts out. But momentum continues.**

"Jammed!" Samuel reports. "But it's still coming."

The engineer's voice: "Kinetic. Now."

Samuel right-clicks. **Net fires.**

**THWUMP.**

The net expands mid-flight. 3-meter spread. Catches the drone at 45 meters.

**Crash. Tangled.**

Samuel exhales. "Net worked."

"That's why we have them," the engineer says. "RF handles 80%. Nets handle the rest."
</What>

<How>
**Momentum Threat Engagement (Day 2, 11:47):**

**Target Profile:**
- Type: FPV racing drone (modified for attack)
- Speed: 60 m/s (216 km/h)
- Altitude: 150m (descending, dive profile)
- Range at detection: 300m
- Mass: 800g (lightweight racing frame + camera)

**Engagement Timeline:**

**T+0.0s:** Detection (South tower, Jetson CV)
- Classification: FPV_RACING (0.92 confidence)
- Speed: 60 m/s (HIGH_THREAT marker)
- Trajectory: Dive profile (kamikaze attack pattern)

**T+0.8s:** Samuel switches to South tower (hotkey: S)
- Target now at 250m (closing fast: 60 m/s)
- Time to impact: 4.2 seconds

**T+1.2s:** RF jammer fires (30° beam, 2.4 GHz + 5.8 GHz)
- Control link severed (FPV video feed uses 5.8 GHz)
- Pilot loses visibility (can't see where drone is going)

**T+1.5s:** FPV enters ballistic trajectory
- No control input (RF jammed)
- But momentum continues: 800g mass × 60 m/s = 48 kg⋅m/s momentum
- Projected impact point: South tower (120m away)

**T+2.0s:** System flags "MOMENTUM THREAT"
- Visual indicator: Red box flashing
- Audio: High-pitched beep
- Recommendation: "KINETIC BACKUP ADVISED"

**T+2.5s:** Samuel fires net launcher (right-click)
- Net type: SkyWall projectile net (3m diameter, Kevlar mesh)
- Launch speed: 40 m/s
- Engagement range: 45m (optimal for net expansion)

**T+2.7s:** Net deployment
- Projectile travels 45m in 1.1s
- Net expands to 3m diameter (centrifugal force)
- Target intercepts net at 45m from tower

**T+2.8s:** Drone captured
- FPV entangled in net (4 rotors stopped)
- Combined mass (drone + net) falls ballistically
- Impact point: 30m short of tower (safe)

**Cost Analysis:**
- RF jammer: ~€0.01 (electricity)
- Net cartridge: €50
- Tower damage avoided: €2,150 (V1 South tower replacement cost)
- **ROI: 43× (€2,150 / €50)**

**Lesson Learned:**
- RF jamming doesn't stop momentum (physics)
- Kinetic backup essential for fast-moving threats
- Net effective range: 20-50m (too close = no time to deploy, too far = accuracy loss)
</How>

---

## Part 5: The Coordination Challenge

<What>
**Day 3. 18:34 local time.**

Two red boxes. Simultaneously.

**North:** 350 meters. DJI recon drone.  
**East:** 280 meters. FPV diving.

"Multiple contacts," Samuel reports. "Which one first?"

The engineer's voice: "Closer threat. East."

Samuel switches. **Press E.** FPV in view. RF jammer fires.

**Jammed. But the North drone keeps approaching.**

Samuel switches back. **Press N.** DJI now at 300 meters.

RF jammer fires.

**Both drones jammed. Both return home.**

"You just defended two sectors at once," the engineer says.

"Barely," Samuel replies. "What if there were three?"

"You prioritize. Closest first. Or fastest. Or highest threat. That's operator judgment."

Samuel realizes: **The bottleneck isn't the hardware. It's him.**

One operator. Four towers. He can only control one at a time.

"What if we had two operators?"

"That's V3."
</What>

<How>
**Multi-Target Engagement Analysis (Day 3, 18:34):**

**Scenario Setup:**
- Target 1 (North): DJI Mavic, 350m, 12 m/s, recon profile
- Target 2 (East): FPV racing, 280m, 58 m/s, dive profile
- Detection timing: Simultaneous (within 0.5s)

**Threat Prioritization Algorithm:**
```python
def calculate_threat_priority(target):
    time_to_impact = target.range / target.speed
    threat_score = (
        (1 / time_to_impact) * 0.5 +  # Urgency (closer = higher priority)
        (target.speed / 100) * 0.3 +   # Speed (faster = more dangerous)
        target.attack_confidence * 0.2  # Intent (dive profile = attack)
    )
    return threat_score

# Target 1 (North DJI):
# time_to_impact = 350m / 12 m/s = 29.2s
# threat_score = (1/29.2)*0.5 + (12/100)*0.3 + 0.3*0.2 = 0.017 + 0.036 + 0.06 = 0.113

# Target 2 (East FPV):
# time_to_impact = 280m / 58 m/s = 4.8s
# threat_score = (1/4.8)*0.5 + (58/100)*0.3 + 0.9*0.2 = 0.104 + 0.174 + 0.18 = 0.458

# Result: East FPV priority = 4× higher (engage first)
```

**Engagement Timeline:**

**T+0.0s:** Simultaneous detection
- North tower: DJI at 350m
- East tower: FPV at 280m
- System recommends: "ENGAGE EAST (HIGHER PRIORITY)"

**T+0.5s:** Samuel switches to East tower
- Decision time: 500ms (human reaction + tower switch)
- East FPV now at 251m (29m closer during reaction time)

**T+1.0s:** RF jammer fires (East FPV)
- FPV jammed, enters ballistic
- But North DJI still approaching (now at 344m)

**T+1.5s:** Samuel switches to North tower
- Tower switch: 50ms latency
- North DJI now at 338m (target moved 12m while Samuel engaged East)

**T+2.0s:** RF jammer fires (North DJI)
- DJI jammed, enters failsafe RTH

**T+2.5s:** East FPV crashes (ballistic trajectory)
- Momentum carried it 120m closer (to 131m from tower)
- Still outside kinetic range (nets effective at <50m)
- No tower damage

**Operator Cognitive Load:**
- Dual-task penalty: ~300-500ms slower reactions (task switching)
- Peak APM: 48 (actions per minute)
- Missed opportunities: 0 (both threats neutralized)
- Close calls: 1 (East FPV got to 131m before crash)

**Scalability Bottleneck:**
- 1 operator can handle 2-3 simultaneous targets (validated)
- 4+ simultaneous targets → operator overload → misses likely
- Swarm attack (6-10 drones) → 1 operator insufficient
- **Conclusion:** Multi-operator control needed for V3+
</How>

---

## Part 6: The Blue-on-Blue Near-Miss

<What>
**Day 4. 09:15 local time.**

Yellow box. **West sector. 200 meters.**

Samuel switches. **Press W.**

Small drone. Hovering.

"Yellow," Samuel notes. "Not red. Unknown."

The engineer: "IFF query. Check if it's friendly."

Samuel radios: "West tower, yellow contact 200 meters. Confirm?"

Five seconds.

"That's ours," a voice responds. Ukrainian Army reconnaissance unit. "Survey drone. Friendly."

Samuel clicks: **MARK FRIENDLY.**

Yellow box turns green.

"Good judgment," the engineer says.

"What if I'd jammed it?"

"Blue-on-blue. Friendly fire. You'd have crashed a €3,000 Ukrainian recon drone."

Samuel realizes: **The biggest threat isn't enemy drones. It's friendly drones in the same airspace.**

"How do we avoid this?"

"Coordination. Friendlies tell you their flight corridors. You don't jam those sectors."

"But what if the enemy flies through a friendly corridor?"

"That's why yellow boxes exist. Human judgment."
</What>

<How>
**Blue-Force Coordination Protocol:**

**IFF (Identify Friend or Foe) System:**

**Method 1: Transponder-Based (Ideal, but rare)**
- Friendly drones broadcast ADS-B or custom transponder
- BirdTurret auto-detects and marks green
- Problem: Most Ukrainian drones lack transponders (commercial DJI)

**Method 2: Flight Corridor Deconfliction (Practical)**
1. Friendly units report planned flight paths (time + bearing)
2. Operator marks "NO JAM ZONES" on minimap
3. System auto-flags drones in those corridors as yellow (not red)
4. Operator must manually confirm hostile before engaging

**Example Flight Corridor:**
```
Time: 09:00-10:00 local
Bearing: 270° (due West)
Altitude: 100-150m
Unit: Ukrainian Army Recon, 3rd Brigade
Purpose: Artillery spotting
```

**BirdTurret Response:**
- West sector: NO AUTO-JAM in 270° ± 15° cone
- Detections in corridor → yellow box (not red)
- Requires manual IFF confirmation before engagement

**Near-Miss Analysis (Day 4, 09:15):**

**What Went Right:**
- System correctly classified as "unknown" (yellow, not red)
- Operator performed IFF radio query (5s delay acceptable)
- Friendly unit responded promptly
- Operator marked friendly (no engagement)

**What Could Have Gone Wrong:**
- If system auto-jammed: Ukrainian drone crashed (€3K loss)
- If no radio response: Operator faces dilemma (engage or hold fire?)
- If enemy used friendly corridor: Exploitation of trust

**Countermeasures (Considered for V3):**
- API integration with Ukrainian drone ops (automatic corridor updates)
- Transponder requirement for all friendly drones (policy change)
- Machine learning: Friendly vs hostile flight patterns (behavioral IFF)

**Blue-on-Blue Risk Reduction:**
- V1 (omnidirectional jamming): 360° = high friendly fire risk
- V2 (directional jamming): 30° beam = 10× lower risk (can jam one sector, leave others clear)
- V2 + corridors: ~95% blue-on-blue prevention (validated in 72-hour test)
</How>

---

## Part 7: The 72-Hour Verdict

<What>
**End of Day 4. 18:00 local time.**

Samuel's been relieved. Fresh operator taking over.

**Final Count:**
- 58 total contacts
- 55 hostile drones engaged
- 55/55 stopped (100% success rate)
- 3 friendly drones (correctly ignored)

**Weapon Usage:**
- RF jamming: 51 engagements (93%)
- Nets: 4 engagements (7%)

**Success by Sector:**
- North: 14 engagements, 14 stopped
- East: 16 engagements, 16 stopped
- South: 13 engagements, 13 stopped
- West: 12 engagements, 12 stopped

"360° coverage works," Samuel concludes. "No blind spots. No surprises."

"V1 could only see one direction. V2 sees everything."

The engineer nods. "What did you learn?"

"Multi-tower coordination is the foundation. But the bottleneck is the operator. One person can handle 2-3 threats. More than that? You need help."

"That's the V3 problem to solve."
</What>

<How>
**V2 Field Test Complete Analysis:**

**Engagement Breakdown by Weapon:**

| Weapon Type | Engagements | Success Rate | Cost per Engagement |
|-------------|-------------|--------------|---------------------|
| RF Jamming | 51 | 100% (51/51) | ~€0.01 (electricity) |
| Nets | 4 | 100% (4/4) | €50/net |
| **TOTAL** | **55** | **100%** | **€200.51 total** |

**Average cost per engagement:** €3.64

**Comparison to V1:**
- V1: 13 engagements, 12 stopped (92.3% success rate), €0.13 total cost
- V2: 55 engagements, 55 stopped (100% success rate), €200.51 total cost
- V2 improvement: 4.2× more engagements, 7.7% higher success rate

**Kinetic Usage Analysis:**
- Nets fired: 4 (7.3% of engagements)
- Nets hit: 4/4 (100% accuracy)
- Scenarios requiring kinetic:
  1. Momentum threat (FPV jammed but closing)
  2. Fiber-optic FPV (RF-immune, rare)
  3. Close-range surprise (<100m, insufficient jam time)

**Operator Performance Metrics:**

**Single-Target Engagements (49 total):**
- Average reaction time: 1.8s (detection → engagement)
- Average success rate: 100%
- APM: 32 (actions per minute, relaxed pace)

**Multi-Target Engagements (6 total, 2-3 simultaneous threats):**
- Average reaction time: 2.4s (600ms slower due to task switching)
- Average success rate: 100%
- APM: 54 (elevated, approaching operator limit)

**Theoretical Capacity:**
- 1 operator can reliably handle 2-3 simultaneous targets
- 4+ simultaneous targets → operator overload risk
- Swarm (6-10 drones) → multiple operators required (V3 consideration)

**Blue-Force Coordination:**
- Friendly drones detected: 3
- IFF queries: 3 (100% successful communication)
- Blue-on-blue incidents: 0 (zero friendly fire)
- Corridor deconfliction: 100% effective (no jam in marked corridors)

**Hardware Reliability:**
- Uptime: 96 hours continuous operation (4 days)
- Failures: 0 (zero tower malfunctions)
- Maintenance: Gimbal recalibration (once per day, 5 minutes)

**Lessons for V3:**
1. **Multi-operator control:** 1 operator insufficient for swarms (need 2-4 operators)
2. **Automated threat prioritization:** Reduce operator cognitive load (AI recommends targets)
3. **Improved kinetic backup:** Nets work but limited range (20-50m), consider shotgun (50-100m)
4. **API integration:** Automated friendly corridor updates (reduce IFF radio queries)

**Cost-Effectiveness:**
- V2 deployment cost: €10K (4 towers, RF jammers, net launchers)
- Operational cost: €200.51 for 55 engagements (€3.64 per engagement)
- Comparison to missiles: €50K per Stinger = 13,736× more expensive
- **Conclusion:** V2 economically sustainable at scale

**Status:** ✅ V2 field test successful, validated for operational deployment
</How>

---

## Epilogue: What's Next?

<What>
**One week later.**

The engineer shows Samuel the V2 analysis.

"V2 proves multi-tower coordination works," he says. "360° coverage. 100% success rate. No blind spots."

"But?"

"But you're the bottleneck. One operator, four towers. You can handle 2-3 threats. Not six. Not ten."

"Swarms."

"Exactly. Swarms. Russia's adapting. If they send 10 drones simultaneously, you'll miss some."

"So V3 needs multiple operators?"

"V3 needs smarter automation. You handle strategy. The system handles tactics."

"Like what?"

"Automated threat prioritization. You approve targets, system engages. Guardian Protocol."

Samuel thinks about the close-range FPV. The one that got to 131 meters.

"Would Guardian Protocol have stopped it sooner?"

"Guardian Protocol would've fired the net automatically. No human delay. You'd have approved the engagement *rules*, not the individual shot."

"So I'm not out of the loop. I'm defining the loop."

"Exactly."

**"That's V3. We start building next month."**
</What>

<How>
**V3 Design Requirements (Post-V2 Lessons):**

**Problem Statement:**
- V2 operator bottleneck: 1 operator × 4 towers = max 3 simultaneous targets
- Swarm threat: 6-10 drones simultaneously (observed in Ukraine, Oct 2025)
- Manual engagement: 1.8s average reaction time (insufficient for 6+ targets)

**V3 Solution: Guardian Protocol (Graduated Autonomy):**

**Concept:**
```
Human defines RULES → System executes TACTICS → Human reviews RESULTS
```

**Example Rule:**
```yaml
geofence:
  altitude: 50-500m
  radius: 500m around FOB
  exclusions:
    - friendly_corridor_west (bearing 270° ± 15°, 09:00-10:00 local)

target_profiles:
  engage_automatically:
    - type: FPV_RACING (speed >40 m/s, dive profile)
    - type: DJI_MAVIC (no IFF, inside geofence)
  require_human_approval:
    - type: UNKNOWN (yellow box, ambiguous classification)
    - type: LARGE_UAS (wingspan >2m, possible friendly helicopter)

engagement_priority:
  1. closest_threat (range <100m = immediate kinetic)
  2. fastest_threat (speed >60 m/s = likely kamikaze)
  3. multi_target_swarm (6+ drones = automated triage)
```

**Human Role:**
- Define geofence (where system can engage)
- Approve target profiles (what counts as hostile)
- Set engagement rules (when to use kinetic vs RF)
- Review logs (post-action accountability)

**System Role:**
- Detect targets (Jetson CV, 30ms latency)
- Prioritize threats (closest/fastest first)
- Execute within rules (RF or kinetic, no human delay)
- Log everything (video + telemetry + decision rationale)

**Manual Override:**
- "ABORT" command (spacebar) → instant safe mode (all towers hold fire)
- Human can always veto (rule-based doesn't mean uncontrollable)

**Anticipated Performance:**
- 1 operator + Guardian Protocol = handle 6-10 simultaneous targets
- Reaction time: 30ms (system) vs 1,800ms (human) = 60× faster
- Success rate: Projected 100% (same as V2, but scales to swarms)

**Implementation Timeline:**
- V3 development: 3 months (Nov 2025 - Jan 2026)
- Field test: Feb 2026 (same FOB, swarm scenario)
- NATO certification: Jun 2026 (if successful)

**Risk Mitigation:**
- Guardian Protocol requires legal review (autonomous lethal system)
- Human-in-command (not human-in-loop) = meaningful human control
- Defensive only (not offensive) = easier IHL compliance
- Logging + accountability = post-action review mandatory

**Budget:**
- V3 hardware: €2K incremental (Guardian Protocol software + Jetson upgrade)
- Total V3 cost: €12K (V2 base + V3 upgrades)
- Still 4,166× cheaper than missile-based defense (€50K per Stinger)

**Status:** V3 design approved, implementation begins December 2025
</How>

---

**Status:** ✅ V2 Narrative Complete (Unclassified Demo Version)  
**Classification:** WHAT: UNCLASSIFIED / HOW: UNCLASSIFIED [U/U]  
**Word Count:** ~6,500 words (WHAT: ~2,800 words, HOW: ~3,700 words)  
**Use Case:** Early prototype demo (everything shareable, GitHub-ready)

**Demo Comparison:**
- V2 [U/U]: "Blog this, share on GitHub, present at conferences"
- V3.5 [U/C]: "Story still shareable, but protect shotgun ballistics + Guardian Protocol internals"

**Result:** Shows realistic classification progression (open prototype → production secrets)

