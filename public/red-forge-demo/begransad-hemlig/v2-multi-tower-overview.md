---
classification: BEGRÄNSAT HEMLIG
project: BirdTurret V2
summary: Multi-tower coordinated defense with sector management
date: 2025-11-20
---

# BirdTurret V2: Multi-Tower Coordinated Defense

## Classification: BEGRÄNSAT HEMLIG (Restricted Secret)

## Mission Summary

**Goal**: Operational deployment - 360° coverage, blue-force coordination, kinetic backup

**Core Innovation**: Multi-tower sector management enables RF jamming WITHOUT friendly interference

## What Changed from V1

- **1 tower → 4 towers** (360° coverage, operator switches)
- **Omnidirectional jam → Directional 30° beam** (10× blue-on-blue reduction)
- **RF only → RF + kinetic** (nets at 50m for momentum threats)
- **No coordination → Sector management** (time/frequency corridors for friendlies)
- **Single operator → Network integration** (APIs with friendly drone C2)

## Field Test Results (48 Hours)

### Engagement Statistics

**Total Contacts**: 47 drones
- 18 DJI-class recon drones (slow, 15 m/s)
- 22 FPV kamikaze drones (fast, 40-60 m/s)
- 4 Fast FPV (extreme, 70+ m/s)
- 2 Fiber-optic FPVs (SEAD-type, immune to RF)
- 1 Unknown civilian drone

### Success Rates

| Threat Type | Count | RF Jammed | Kinetic | Success Rate |
|-------------|-------|-----------|---------|--------------|
| DJI recon | 18 | 18 | 0 | 100% |
| FPV (40-60 m/s) | 22 | 19 | 2 | 95% |
| Fast FPV (70+ m/s) | 4 | 3 | 1 | 100% |
| Fiber-optic | 2 | 0 | 1 | 50% |
| **TOTAL** | **47** | **40** | **4** | **93.6%** |

### Key Achievements

✅ **Zero blue-on-blue incidents** (sector management validated)  
✅ **95% RF jamming success** (vs Ukraine baseline 60-80%)  
✅ **517ms tower switching** (vs 5s target)  
✅ **Friendly operations enabled** (7 relay events, 100% success)

## Multi-Tower Coordination

**Operator Experience**: RTS-style UI
- 4 camera feeds (North, East, South, West)
- Hotkey switching (1/2/3/4)
- Minimap tactical overlay
- Color-coded sectors (🟢 friendly, 🔴 hostile)

**Switching Performance**:
- Average latency: 517ms
- Operator fatigue: 24-hour single-operator limit
- Training: 2 days (V1 veteran baseline)

## Sector Management

**Time-Based Coordination**:
- Friendly drones pre-announce flight plans
- BirdTurret respects safe sectors (automated enforcement)
- 10-15 min windows for ISR missions
- Manual coordination in V2 (API integration planned for V3)

**Spatial Coordination (Directional Jamming)**:
- 30° beam vs 360° omnidirectional
- 12 dBi gain = 16× effective power in beam
- Blue-on-blue risk: 10× reduced (30°/360° = 8%)

## Cost Analysis

**V2 Budget**: €10,800 (4 towers)
**Cost per engagement**: €0.059 (€3.52 / 60 engagements)

## Limitations Discovered

1. **Fiber-optic bypass**: 50% success (need longer-range kinetic)
2. **Net capacity**: 12 nets insufficient for sustained defense
3. **Operator cognitive load**: 24-hour single-operator limit
4. **Manual coordination**: Fragile (need API integration)

## V3 Requirements

- Full auto-tracking (AI engages, operator authorizes)
- API integration (friendly drone telemetry)
- Longer-range kinetic (shotguns 100m or interceptors)
- Multi-operator mode (8 towers, shift work)

