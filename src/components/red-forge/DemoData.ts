import { ClassifiedFile } from '../lib/red-forge/types';

export const DEMO_FILES: ClassifiedFile[] = [
  {
    id: 'lumen-1',
    name: 'red-forge-overview.md',
    dualClassification: { what: 'UNCLASSIFIED', how: 'CONFIDENTIAL' },
    language: 'markdown',
    lastModified: new Date(),
    content: `---
classification:
  what: UNCLASSIFIED
  how: CONFIDENTIAL
---

# Red Forge System Overview

> *"Classification-aware development for Swedish defense tech."*

<What>
Red Forge provides a classification-aware IDE for working on CONFIDENTIAL content with on-prem AI assistance. The system supports dual WHAT/HOW classification, allowing public API documentation while protecting implementation details.
</What>

<How>
Implementation uses three network zones: White (internet), Yellow (on-prem AI), and Red (air-gapped). Data flows through Zenoh-based software diodes with Chronicle audit logging. The IDE enforces classification boundaries through visual encoding and keyword detection.
</How>

## Architecture

<What>
The system consists of three main components:
- Red Forge IDE (classification-aware editor)
- Red Forge LLM (on-premises AI)
- Pragmatic RED network (secure workspace)
</What>

<How>
Technical stack:
- Frontend: React + Monaco Editor + Zenoh pub/sub
- Backend: Rust + Zenoh router + Chronicle database
- Security: Software diodes (one-way data flow) + audit trail
- Deployment: Stationary workstations (Mac/Windows/Linux)
</How>

## Use Cases

<What>
Designed for Swedish defense startups working on CONFIDENTIAL projects. Enables AI-assisted development without violating FMV security policies. Costs 30x less than traditional SCIF while providing better actual security through usability.
</What>
`
  },
  
  {
    id: 'pub-1',
    name: 'publisher.ts',
    dualClassification: { what: 'UNCLASSIFIED', how: 'SECRET' },
    language: 'typescript',
    lastModified: new Date(),
    content: `// Publisher API - Classified Component
// WHAT: UNCLASSIFIED (public interface)
// HOW: SECRET (implementation details)

/**
 * <What>
 * Publisher allows sending messages to topics with automatic serialization.
 * Supports QoS configuration for reliability guarantees.
 * </What>
 */
export interface Publisher<T> {
  /**
   * <What>
   * Publish a message to the configured topic.
   * Returns a promise that resolves when delivery is confirmed.
   * </What>
   */
  publish(msg: T): Promise<void>;
  
  /**
   * <What>
   * Close the publisher and release resources.
   * </What>
   */
  close(): Promise<void>;
}

/**
 * <How>
 * Internal implementation uses Zenoh PUT operation with MessagePack serialization.
 * Custom priority queue handles QoS=Reliable with 3-retry exponential backoff.
 * Buffer size: 1000 messages. Encryption: AES-256 with per-topic key derivation.
 * </How>
 */
class PublisherImpl<T> implements Publisher<T> {
  private zenohSession: ZenohSession;
  private cryptoKey: Uint8Array;
  private priorityQueue: PriorityQueue<T>;
  
  constructor(topic: string, qos: QoS) {
    // <How>
    // Custom key derivation: HKDF-SHA256(topic, salt=deployment_id)
    this.cryptoKey = deriveTopicKey(topic);
    // Zenoh session with custom congestion control
    this.zenohSession = openZenohSession({ cc: 'custom', buffer: 1000 });
    // Priority queue with exponential backoff retry strategy
    this.priorityQueue = new PriorityQueue(qos);
    // </How>
  }
  
  async publish(msg: T): Promise<void> {
    // <How>
    // 1. Serialize with MessagePack (faster than JSON, smaller payloads)
    const serialized = msgpack.encode(msg);
    // 2. Encrypt with AES-256-GCM
    const encrypted = await aes256Encrypt(serialized, this.cryptoKey);
    // 3. Route through priority queue if QoS=Reliable
    if (this.qos === 'reliable') {
      await this.priorityQueue.enqueue(encrypted);
    }
    // 4. Zenoh PUT with retry logic (3 attempts, exponential backoff)
    await this.zenohSession.put(this.topic, encrypted, { retries: 3 });
    // </How>
  }
  
  async close(): Promise<void> {
    // <How>
    await this.priorityQueue.flush();
    await this.zenohSession.close();
    // Securely wipe crypto key from memory
    this.cryptoKey.fill(0);
    // </How>
  }
}

/**
 * <What>
 * Create a new publisher for the specified topic.
 * </What>
 */
export function createPublisher<T>(topic: string, qos?: QoS): Publisher<T> {
  return new PublisherImpl<T>(topic, qos ?? 'besteffort');
}
`
  },
  
  {
    id: 'spec-1',
    name: 'classification-guide.md',
    classification: 'CONFIDENTIAL', // Single classification example
    language: 'markdown',
    lastModified: new Date(),
    content: `# Classification Guidelines

This document uses SINGLE classification (legacy mode).
Everything in this file is CONFIDENTIAL.

## When to Use WHAT vs HOW

**WHAT (Capability/Interface):**
- Public API signatures (traits, interfaces, types)
- Observable behavior (what users can do)
- Feature descriptions (without implementation details)
- Black-box test cases (inputs/outputs, no internals)

**HOW (Implementation):**
- Algorithms and data structures
- Performance optimizations
- Cryptographic details
- Internal architecture
- Vendor-specific integrations

## Keyword Detection

The IDE will warn you if it detects HOW keywords in WHAT sections:

**HOW Keywords:**
- "implements", "algorithm", "internally", "optimized"
- "uses [library]", "depends on", "caches", "buffers"
- Specific numbers (buffer sizes, retry counts, thresholds)

**WHAT Keywords:**
- "allows", "enables", "provides", "supports"
- "returns", "accepts", "expects", "produces"
- "interface", "API", "capability", "feature"

## Declassification Process

1. Tag code sections as WHAT or HOW
2. Right-click file → "Extract for AI"
3. Preview shows what will be sent (WHAT only)
4. AI reviews for accidental leaks
5. Human approves
6. Sent to on-prem AI (Yellow Network)
7. Response imported with classification tags
`
  }
];

