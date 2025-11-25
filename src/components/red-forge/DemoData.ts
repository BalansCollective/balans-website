import { ClassifiedFile } from '../../lib/red-forge/types';
import type { DemoFileTree, DemoFile } from './DemoDataLoader';

// Import BirdTurret demo content
import birdturretV2Content from '../../../public/demo/birdturret-v2-tagged.md?raw';
import birdturretV35Content from '../../../public/demo/birdturret-v3.5-tagged.md?raw';
import birdturretV4Content from '../../../public/demo/birdturret-v4-tagged.md?raw';

// Type for simplified file tree (used by KISS demo page)
export interface SimpleFile {
  id: string;
  name: string;
  classification: 'oklassificerad' | 'begransad-hemlig' | 'konfidentiell' | 'hemlig';
}

export interface FileTreeFolder {
  name: string;
  path: string;
  files: SimpleFile[];
  subfolders?: FileTreeFolder[];
}

/**
 * Convert DemoFileTree to FileTreeFolder for simplified file tree rendering
 * (Used by RedForgeDemoPage.tsx)
 */
export function convertToFileTree(demoFiles: DemoFileTree): FileTreeFolder {
  const root: FileTreeFolder = {
    name: 'Red Forge Demo',
    path: '/',
    files: [],
    subfolders: []
  };

  // Helper to convert DemoFile to SimpleFile
  const toSimpleFile = (file: DemoFile): SimpleFile => ({
    id: file.path,
    name: file.title,
    classification: file.classification
  });

  // Add each classification level as a subfolder
  const levels = [
    { key: 'oklassificerad', name: 'Oklassificerad (OPEN)' },
    { key: 'begransad-hemlig', name: 'Begränsad Hemlig (BH)' },
    { key: 'konfidentiell', name: 'Konfidentiell (K)' },
    { key: 'hemlig', name: 'Hemlig (H)' }
  ] as const;

  root.subfolders = levels.map(level => ({
    name: level.name,
    path: `/${level.key}`,
    files: demoFiles[level.key].map(toSimpleFile),
    subfolders: []
  }));

  return root;
}

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
    content: `/**
 * @classification WHAT:UNCLASSIFIED HOW:SECRET
 * @file publisher.ts
 * @description Publisher API for message publishing with QoS support
 */

/**
 * Publisher allows sending messages to topics with automatic serialization.
 * Supports QoS configuration for reliability guarantees.
 */
export interface Publisher<T> {
  /**
   * Publish a message to the configured topic.
   * Returns a promise that resolves when delivery is confirmed.
   */
  publish(msg: T): Promise<void>;
  
  /**
   * Close the publisher and release resources.
   */
  close(): Promise<void>;
}

/**
 * Internal implementation - SECRET
 * Uses Zenoh PUT operation with MessagePack serialization.
 * Custom priority queue handles QoS=Reliable with 3-retry exponential backoff.
 * Buffer size: 1000 messages. Encryption: AES-256 with per-topic key derivation.
 */
class PublisherImpl<T> implements Publisher<T> {
  private zenohSession: ZenohSession;
  private cryptoKey: Uint8Array;
  private priorityQueue: PriorityQueue<T>;
  
  constructor(topic: string, qos: QoS) {
    // Custom key derivation: HKDF-SHA256(topic, salt=deployment_id)
    this.cryptoKey = deriveTopicKey(topic);
    
    // Zenoh session with custom congestion control
    this.zenohSession = openZenohSession({ cc: 'custom', buffer: 1000 });
    
    // Priority queue with exponential backoff retry strategy
    this.priorityQueue = new PriorityQueue(qos);
  }
  
  async publish(msg: T): Promise<void> {
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
  }
  
  async close(): Promise<void> {
    await this.priorityQueue.flush();
    await this.zenohSession.close();
    
    // Securely wipe crypto key from memory
    this.cryptoKey.fill(0);
  }
}

/**
 * Create a new publisher for the specified topic.
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
  },
  
  // BirdTurret V2 (Early Prototype - Fully Unclassified)
  {
    id: 'birdturret-v2',
    name: 'birdturret-v2-field-test.md',
    dualClassification: { what: 'UNCLASSIFIED', how: 'UNCLASSIFIED' },
    language: 'markdown',
    lastModified: new Date(),
    content: birdturretV2Content
  },
  
  // BirdTurret V3.5 (Production - Mixed Classification)
  {
    id: 'birdturret-v3.5',
    name: 'birdturret-v3.5-field-test.md',
    dualClassification: { what: 'UNCLASSIFIED', how: 'CONFIDENTIAL' },
    language: 'markdown',
    lastModified: new Date(),
    content: birdturretV35Content
  },
  
  // BirdTurret V4 (Combat-Proven Ukraine - SECRET Implementation)
  {
    id: 'birdturret-v4',
    name: 'birdturret-v4-guardian-protocol.md',
    dualClassification: { what: 'CONFIDENTIAL', how: 'SECRET' },
    language: 'markdown',
    lastModified: new Date(),
    content: birdturretV4Content
  },
  
  // Placeholder files (user doesn't have clearance to see)
  {
    id: 'classified-1',
    name: '[REDACTED]',
    classification: 'SECRET',
    language: 'markdown',
    lastModified: new Date(),
    showPlaceholder: true,
    showFilename: false, // Completely hidden
    content: `# Access Denied

You do not have sufficient clearance to view this document.

**Required Clearance:** SECRET  
**Your Clearance:** CONFIDENTIAL

Contact your security officer to request access.`
  },
  
  {
    id: 'classified-2',
    name: '[REDACTED]',
    classification: 'TOP_SECRET',
    language: 'markdown',
    lastModified: new Date(),
    showPlaceholder: true,
    showFilename: false, // Completely hidden
    content: `# Access Denied

You do not have sufficient clearance to view this document.

**Required Clearance:** TOP_SECRET  
**Your Clearance:** CONFIDENTIAL

Contact your security officer to request access.`
  }
];

// File tree structure for hierarchical display
export interface FileTreeFolder {
  name: string;
  path: string;
  files: ClassifiedFile[];
  subfolders?: FileTreeFolder[];
}

export const FILE_TREE: FileTreeFolder = {
  name: 'root',
  path: '/',
  files: [],
  subfolders: [
    {
      name: 'demos',
      path: '/demos',
      files: [
        DEMO_FILES.find(f => f.id === 'birdturret-v2')!,
        DEMO_FILES.find(f => f.id === 'birdturret-v3.5')!,
        DEMO_FILES.find(f => f.id === 'birdturret-v4')!,
      ].filter(Boolean),
      subfolders: []
    },
    {
      name: 'docs',
      path: '/docs',
      files: [
        DEMO_FILES.find(f => f.id === 'lumen-1')!,
        DEMO_FILES.find(f => f.id === 'spec-1')!, // classification-guide.md
      ].filter(Boolean),
      subfolders: []
    },
    {
      name: 'src',
      path: '/src',
      files: [
        DEMO_FILES.find(f => f.id === 'pub-1')!, // publisher.ts
      ].filter(Boolean),
      subfolders: []
    },
    {
      name: 'classified',
      path: '/classified',
      files: [
        DEMO_FILES.find(f => f.id === 'classified-1')!,
        DEMO_FILES.find(f => f.id === 'classified-2')!,
      ].filter(Boolean),
      subfolders: []
    }
  ]
};

