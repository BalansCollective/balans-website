---
classification: OPEN
classification_swedish: ÖPPEN
project: BirdTurret V1
summary: Proof-of-concept single-tower micro-assist targeting system
date: 2025-11-18
---

# BirdTurret V1: Micro-Assist Proof of Concept

## Classification: OPEN (Öppen - Unclassified)

## Mission Summary

**Goal**: Prove FPS interface + micro-assist enables fast reactive defense

**Core Innovation**: Operator aims coarse (±5°), AI fine-tunes (±0.5°), predictive lead compensation

## System Architecture

- **1 tower operator** (elevated position)
- **1 ground turret** (80m forward, fiber optic link)
- **Camera ON gimbal** (FPS interface - operator sees what turret sees)
- **Micro-assist only** (AI corrects operator's aim, doesn't replace it)
- **Low-latency focus** (150ms target: detection → fire)

## Success Criteria (Public Results)

1. ✅ FPS gamers effective in 2 hours (not 6 weeks traditional training)
2. ✅ Micro-assist reduces aim error to <0.5°
3. ✅ Sub-200ms reaction time achieved (153ms measured)
4. ✅ RF jamming limitations documented (forms basis for V2)

## Key Findings

- Training time: **252× faster** than traditional turret operators
- Reaction time: **153ms** average (detection to fire)
- Engagement success: **85%** for RF-controlled drones
- Human-in-loop: **Critical** for threat discrimination (prevented pigeon engagement)

## Budget

- V1 System Cost: €2,350
- Cost per engagement: ~€0.01 (RF jamming power)

## Next Steps

V1 proved interface viability. V2 adds multi-tower coordination and kinetic backup.

