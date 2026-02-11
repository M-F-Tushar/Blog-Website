import { createClient } from '@supabase/supabase-js';
import type {
  Post,
  Recommendation,
  SiteSettings,
  PostStatus,
  Project,
  Publication,
  PageContent,
  CVEducation,
  CVExperience,
  CVCertification,
} from './types';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ---------- Database row types ----------

export interface DatabasePost {
  id: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  status: string;
  cover_image: string | null;
  content: string;
  is_initial: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseRecommendation {
  id: string;
  title: string;
  url: string;
  description: string;
  type: string;
  is_initial: boolean;
  created_at: string;
  updated_at: string;
}

// ---------- Converters ----------

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export const postFromDatabase = (dbPost: DatabasePost): Post => ({
  id: dbPost.id,
  title: dbPost.title,
  slug: slugify(dbPost.title),
  date: dbPost.date,
  category: dbPost.category,
  tags: dbPost.tags,
  excerpt: dbPost.excerpt,
  status: dbPost.status as PostStatus,
  coverImage: dbPost.cover_image || undefined,
  content: dbPost.content,
  isInitial: dbPost.is_initial,
});

export const recommendationFromDatabase = (dbRec: DatabaseRecommendation): Recommendation => ({
  id: dbRec.id,
  title: dbRec.title,
  url: dbRec.url,
  description: dbRec.description,
  type: dbRec.type as any,
  isInitial: dbRec.is_initial,
});

// ---------- Data fetching (build-time) ----------

export async function getAllPosts(): Promise<Post[]> {
  if (!supabase) return FALLBACK_POSTS;

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false });

  if (error || !data) {
    console.error('Error fetching posts:', error);
    return FALLBACK_POSTS;
  }

  return data.map(postFromDatabase);
}

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.status === 'Published');
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug || p.id === slug);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!supabase) return FALLBACK_SETTINGS as SiteSettings;

  const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();

  if (error || !data) {
    console.error('Error fetching site settings:', error);
    return FALLBACK_SETTINGS as SiteSettings;
  }

  return data as SiteSettings;
}

/**
 * Check if a page is visible based on navigation settings.
 * Returns true by default if no navigation settings exist or the page is not listed.
 */
export function isPageVisible(settings: SiteSettings, pagePath: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav = (settings as any).navigation;
  if (!nav?.menuItems || !Array.isArray(nav.menuItems)) {
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item = nav.menuItems.find((i: any) => i.path === pagePath);
  return !item || item.visible !== false;
}

export async function getRecommendations(): Promise<Recommendation[]> {
  if (!supabase) return FALLBACK_RECOMMENDATIONS;

  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching recommendations:', error);
    return FALLBACK_RECOMMENDATIONS;
  }

  return data.map(recommendationFromDatabase);
}

// ---------- Fallback data ----------

const FALLBACK_POSTS: Post[] = [
  {
    id: 'neural-constellations',
    title: 'Neural Constellations: Mapping the Architecture of Thought',
    slug: 'neural-constellations-mapping-the-architecture-of-thought',
    date: 'January 15, 2025',
    category: 'AI & ML',
    tags: ['neural-networks', 'deep-learning', 'architecture', 'transformers'],
    excerpt:
      'A deep dive into modern neural network architectures, from transformers to state-space models, and the design principles that make them work.',
    coverImage: 'https://placehold.co/1200x630/1a1a2e/e0e0ff?text=Neural+Constellations',
    status: 'Published' as PostStatus,
    content: `# Neural Constellations: Mapping the Architecture of Thought

The landscape of neural network architectures has evolved at a breathtaking pace. What began with simple perceptrons has blossomed into an intricate cosmos of interconnected design patterns, each optimized for different facets of intelligence.

## The Transformer Revolution

When Vaswani et al. introduced the transformer in 2017, few predicted it would become the backbone of nearly every state-of-the-art model. The key insight was deceptively simple: replace recurrence with self-attention.

\\\`\\\`\\\`python
import torch
import torch.nn as nn

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model: int, num_heads: int):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)

    def scaled_dot_product_attention(self, Q, K, V, mask=None):
        scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.d_k ** 0.5)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))
        weights = torch.softmax(scores, dim=-1)
        return torch.matmul(weights, V)
\\\`\\\`\\\`

The beauty of self-attention lies in its ability to model relationships between any two positions in a sequence in constant depth, whereas recurrent networks require O(n) steps.

## Beyond Attention: State-Space Models

Despite the dominance of transformers, a new class of architectures has emerged: structured state-space models (SSMs). Models like Mamba leverage selective state spaces to achieve linear-time sequence modeling without sacrificing long-range dependency capture.

The core idea is to parameterize a continuous dynamical system:

- **State equation**: h'(t) = A h(t) + B x(t)
- **Output equation**: y(t) = C h(t) + D x(t)

By discretizing and making the parameters input-dependent, SSMs can selectively remember or forget information, similar to gating mechanisms in LSTMs but with far greater computational efficiency.

## Mixture of Experts

Another paradigm gaining traction is the Mixture of Experts (MoE) approach. Rather than activating every parameter for every input, MoE models route tokens through specialized sub-networks:

\\\`\\\`\\\`python
class MoELayer(nn.Module):
    def __init__(self, num_experts, d_model, top_k=2):
        super().__init__()
        self.experts = nn.ModuleList([
            FeedForward(d_model) for _ in range(num_experts)
        ])
        self.gate = nn.Linear(d_model, num_experts)
        self.top_k = top_k

    def forward(self, x):
        gate_scores = torch.softmax(self.gate(x), dim=-1)
        top_k_scores, top_k_indices = gate_scores.topk(self.top_k, dim=-1)
        # Route to selected experts only
        output = sum(
            score * self.experts[idx](x)
            for score, idx in zip(top_k_scores.unbind(-1), top_k_indices.unbind(-1))
        )
        return output
\\\`\\\`\\\`

This allows models to scale to trillions of parameters while keeping inference cost manageable.

## The Road Ahead

The next generation of architectures will likely combine these ideas: attention for global reasoning, state-space models for efficient long-context processing, and sparse expert routing for scalable parameter counts. The constellation of neural architectures is still expanding, and we are only beginning to chart its full extent.`,
    isInitial: true,
  },
  {
    id: 'quantum-entanglement-computing',
    title: 'Quantum Entanglement and the Future of Computing',
    slug: 'quantum-entanglement-and-the-future-of-computing',
    date: 'January 8, 2025',
    category: 'Quantum Computing',
    tags: ['quantum', 'entanglement', 'qubits', 'error-correction'],
    excerpt:
      'Exploring how quantum entanglement enables computational paradigms impossible with classical machines, and the engineering challenges that remain.',
    coverImage: 'https://placehold.co/1200x630/0d1b2a/7ec8e3?text=Quantum+Entanglement',
    status: 'Published' as PostStatus,
    content: `# Quantum Entanglement and the Future of Computing

Quantum computing promises to revolutionize fields from cryptography to drug discovery. At the heart of this revolution lies one of nature's strangest phenomena: entanglement.

## What Is Entanglement?

When two qubits become entangled, measuring one instantly determines the state of the other, regardless of the distance between them. Einstein famously called this "spooky action at a distance," but decades of experiments have confirmed it is very real.

In the language of quantum mechanics, an entangled Bell state looks like this:

|psi> = (1/sqrt(2)) ( |00> + |11> )

Measuring the first qubit as 0 guarantees the second is also 0, and vice versa. This correlation is stronger than anything achievable classically.

## Entanglement as a Computational Resource

Entanglement is not just a curiosity; it is a resource that enables quantum speedups. Key applications include:

- **Quantum Teleportation**: Transferring quantum states using entanglement and classical communication.
- **Superdense Coding**: Sending two classical bits using one entangled qubit.
- **Quantum Error Correction**: Distributing logical information across entangled physical qubits to protect it from noise.

\\\`\\\`\\\`python
from qiskit import QuantumCircuit

# Create a Bell state (maximally entangled pair)
qc = QuantumCircuit(2, 2)
qc.h(0)          # Put qubit 0 in superposition
qc.cx(0, 1)      # Entangle qubit 0 and qubit 1
qc.measure([0, 1], [0, 1])
\\\`\\\`\\\`

## The Error Correction Challenge

Real quantum hardware is noisy. Qubits decohere, gates introduce errors, and measurements are imperfect. The threshold theorem tells us that if individual gate error rates are below a certain threshold (roughly 0.1-1%), we can perform arbitrarily long quantum computations using error-correcting codes.

The surface code is the leading candidate:

- Arrange physical qubits on a 2D grid
- Use "syndrome" measurements to detect errors without collapsing the logical state
- Decode syndromes in real-time to apply corrections

Current hardware from Google, IBM, and others is approaching the error rates needed, but a fully fault-tolerant quantum computer may still require millions of physical qubits.

## Topological Quantum Computing

An alternative approach, championed by Microsoft, uses topological qubits based on exotic quasiparticles called anyons. The logical information is stored in the global topology of the system, making it inherently resistant to local errors. While experimentally challenging, recent progress on Majorana zero modes suggests this approach may eventually deliver the most stable qubits.

## Looking Forward

Quantum computing is transitioning from proof-of-concept to early utility. Entanglement is the thread that ties every quantum algorithm together, and our ability to create, maintain, and leverage entanglement at scale will determine how quickly this technology matures.`,
    isInitial: true,
  },
  {
    id: 'astro-islands-architecture',
    title: 'Astro Islands: Rethinking Frontend Architecture',
    slug: 'astro-islands-rethinking-frontend-architecture',
    date: 'December 28, 2024',
    category: 'Web Development',
    tags: ['astro', 'islands-architecture', 'performance', 'frontend'],
    excerpt:
      "How Astro's islands architecture delivers near-zero JavaScript by default while still supporting rich interactivity where you need it.",
    coverImage: 'https://placehold.co/1200x630/1b1b3a/c084fc?text=Astro+Islands',
    status: 'Published' as PostStatus,
    content: `# Astro Islands: Rethinking Frontend Architecture

For years, the frontend world has oscillated between server-rendered HTML and client-side JavaScript frameworks. Astro offers a compelling middle ground: ship zero JavaScript by default, and hydrate only the interactive "islands" that need it.

## The Problem with SPAs

Single-page applications revolutionized user experience but introduced significant costs:

- **Bundle size**: Even a simple blog might ship hundreds of kilobytes of JavaScript.
- **Time to interactive**: Users stare at loading spinners while the framework boots.
- **SEO challenges**: Search engines struggle with client-rendered content.

## The Islands Model

Astro pioneered the islands architecture, where each interactive component is an independent island that hydrates on its own schedule:

\\\`\\\`\\\`astro
---
// src/pages/index.astro
import Header from '../components/Header.astro';
import HeroSection from '../components/HeroSection.astro';
import SearchWidget from '../components/react/SearchWidget';
import Newsletter from '../components/react/Newsletter';
---

<Header />
<HeroSection />

<!-- Only these components ship JavaScript -->
<SearchWidget client:load />
<Newsletter client:visible />
\\\`\\\`\\\`

The directives tell Astro when to hydrate:

- **client:load** -- Hydrate immediately on page load
- **client:visible** -- Hydrate when the component enters the viewport
- **client:idle** -- Hydrate when the browser is idle
- **client:media** -- Hydrate when a CSS media query matches

## Framework Agnostic

One of Astro's most powerful features is its ability to mix frameworks. You can use React for a complex data visualization, Svelte for a lightweight toggle, and Vue for a form -- all on the same page:

\\\`\\\`\\\`astro
---
import ReactChart from '../components/react/Chart';
import SvelteToggle from '../components/svelte/Toggle.svelte';
import VueForm from '../components/vue/ContactForm.vue';
---

<ReactChart client:visible data={chartData} />
<SvelteToggle client:idle />
<VueForm client:load />
\\\`\\\`\\\`

Each island bundles only the framework code it needs. A page with one small Svelte toggle will not ship the React runtime.

## Content Collections

Astro 2.0 introduced content collections, providing type-safe frontmatter validation for markdown and MDX content:

\\\`\\\`\\\`typescript
// src/content/config.ts
import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog: blogCollection };
\\\`\\\`\\\`

This ensures every blog post conforms to a defined schema, catching errors at build time rather than in production.

## Performance Results

On a real-world blog migration from Next.js to Astro, the results were striking:

- **JavaScript shipped**: 287 KB to 12 KB (96% reduction)
- **Lighthouse Performance**: 62 to 99
- **Time to Interactive**: 3.2s to 0.8s
- **First Contentful Paint**: 1.8s to 0.4s

The islands architecture is not a silver bullet. Highly interactive applications like dashboards or editors may still benefit from a full SPA framework. But for content-rich sites -- blogs, documentation, marketing pages -- it is a paradigm shift.`,
    isInitial: true,
  },
  {
    id: 'ethics-of-autonomous-ai',
    title: 'The Ethics of Autonomous AI: Guardrails for a Thinking Machine',
    slug: 'the-ethics-of-autonomous-ai-guardrails-for-a-thinking-machine',
    date: 'December 20, 2024',
    category: 'AI Ethics',
    tags: ['ai-ethics', 'alignment', 'safety', 'governance'],
    excerpt:
      'As AI systems grow more capable and autonomous, how do we ensure they act in alignment with human values? A look at the technical and philosophical challenges.',
    coverImage: 'https://placehold.co/1200x630/2d1b2e/f0a0c0?text=AI+Ethics',
    status: 'Published' as PostStatus,
    content: `# The Ethics of Autonomous AI: Guardrails for a Thinking Machine

As AI systems become more capable of independent action -- writing code, making decisions, conducting research -- the question of alignment with human values becomes urgent. This is not a distant philosophical puzzle; it is an engineering challenge we face today.

## The Alignment Problem

At its core, the alignment problem asks: how do we specify what we actually want an AI to do? This sounds trivial, but consider the challenges:

- **Reward hacking**: An AI optimizing a poorly specified reward function may find unintended shortcuts. A cleaning robot told to minimize visible mess might learn to hide trash rather than dispose of it.
- **Distributional shift**: An AI trained in one environment may behave unpredictably in another. Medical AI trained on hospital data from one country may fail in a different healthcare system.
- **Goodhart's Law**: When a measure becomes a target, it ceases to be a good measure. Optimizing for a proxy of human satisfaction is not the same as producing genuine satisfaction.

## Constitutional AI and RLHF

Current approaches to alignment include Reinforcement Learning from Human Feedback (RLHF) and Constitutional AI (CAI):

**RLHF** trains a reward model from human preference data, then optimizes the AI policy against that reward model. The process involves:

1. Generate multiple responses to a prompt
2. Have humans rank them by quality
3. Train a reward model on these preferences
4. Fine-tune the language model to maximize the learned reward

**Constitutional AI** extends this by having the AI critique and revise its own outputs according to a set of principles (a "constitution"), reducing the need for human labeling.

## Interpretability: Opening the Black Box

We cannot trust what we cannot understand. Interpretability research aims to make neural network decision-making transparent:

- **Mechanistic interpretability**: Reverse-engineering specific circuits within neural networks to understand how they process information.
- **Probing classifiers**: Training simple classifiers on intermediate representations to test what information the model encodes at each layer.
- **Attention visualization**: Examining attention patterns to understand which parts of the input influence the output.

\\\`\\\`\\\`python
# Simplified example of probing a model's internal representations
from sklearn.linear_model import LogisticRegression
import numpy as np

def probe_for_concept(hidden_states: np.ndarray, labels: np.ndarray) -> float:
    """Train a linear probe to detect a concept in hidden states."""
    probe = LogisticRegression(max_iter=1000)
    probe.fit(hidden_states, labels)
    return probe.score(hidden_states, labels)
\\\`\\\`\\\`

## Governance and Policy

Technical solutions alone are insufficient. We also need governance frameworks:

- **Red-teaming and auditing**: Systematic adversarial testing before deployment.
- **Staged deployment**: Releasing capabilities gradually with monitoring at each stage.
- **International coordination**: AI safety is a global challenge requiring cooperation across borders.
- **Liability frameworks**: Clear legal accountability for AI-caused harms.

## The Path Forward

The goal is not to prevent AI from being capable, but to ensure that capability is directed toward beneficial outcomes. This requires a multidisciplinary effort spanning computer science, philosophy, law, and social science. The stakes are high: the decisions we make about AI governance in the next few years may shape the trajectory of human civilization.`,
    isInitial: true,
  },
  {
    id: 'edge-computing-webassembly',
    title: 'Edge Computing with WebAssembly: The Serverless Evolution',
    slug: 'edge-computing-with-webassembly-the-serverless-evolution',
    date: 'December 12, 2024',
    category: 'Web Development',
    tags: ['webassembly', 'edge-computing', 'serverless', 'wasm'],
    excerpt:
      'WebAssembly is escaping the browser and powering a new generation of edge computing platforms. Here is what that means for developers.',
    coverImage: 'https://placehold.co/1200x630/1a2e1a/a0f0a0?text=Edge+%2B+WASM',
    status: 'Published' as PostStatus,
    content: `# Edge Computing with WebAssembly: The Serverless Evolution

WebAssembly (Wasm) was originally designed to bring near-native performance to web browsers. But its portable, sandboxed execution model has made it the perfect runtime for a new generation of edge computing platforms.

## Why Wasm at the Edge?

Traditional serverless functions (AWS Lambda, Google Cloud Functions) run in centralized data centers. Edge computing moves computation closer to users, but running full containers at edge nodes is expensive. Wasm offers a sweet spot:

- **Cold start in microseconds**: Wasm modules spin up in under 1ms, compared to 100ms+ for containers.
- **Tiny footprint**: A Wasm module might be 1-5 MB versus hundreds of MB for a container image.
- **Sandboxed by default**: The Wasm runtime enforces memory safety and capability-based security without OS-level isolation.
- **Language agnostic**: Write in Rust, Go, C++, Python, or any language that compiles to Wasm.

## WASI: The System Interface

The WebAssembly System Interface (WASI) provides a standardized way for Wasm modules to interact with the outside world -- file systems, networking, clocks, and random number generation -- without compromising the sandbox model.

\\\`\\\`\\\`rust
// A simple Wasm edge function in Rust
use spin_sdk::http::{IntoResponse, Request, Response};
use spin_sdk::http_component;

#[http_component]
fn handle_request(req: Request) -> anyhow::Result<impl IntoResponse> {
    let uri = req.uri().to_string();
    let body = format!("Hello from the edge! You requested: {}", uri);

    Ok(Response::builder()
        .status(200)
        .header("content-type", "text/plain")
        .body(body)
        .build())
}
\\\`\\\`\\\`

## The Component Model

The Wasm Component Model is an emerging standard that allows Wasm modules to compose together, importing and exporting typed interfaces. Think of it as microservices at the function level:

\\\`\\\`\\\`wit
// WIT (Wasm Interface Type) definition
package edge:functions;

interface cache {
    get: func(key: string) -> option<string>;
    set: func(key: string, value: string, ttl-seconds: u32);
}

world edge-worker {
    import cache;
    export handler: func(request: request) -> response;
}
\\\`\\\`\\\`

Each component declares exactly what capabilities it needs, and the runtime provides only those capabilities. This is a fundamentally more secure model than giving every function access to the full operating system.

## Real-World Platforms

Several platforms now support Wasm at the edge:

- **Cloudflare Workers**: One of the first to adopt Wasm, running V8 isolates with Wasm support across 300+ edge locations.
- **Fermyon Spin**: A developer-friendly framework purpose-built for Wasm serverless, supporting multiple languages.
- **Fastly Compute**: Uses the Wasmtime runtime for high-performance edge computation.
- **Cosmonic (wasmCloud)**: Focuses on distributed Wasm applications with a lattice-based architecture.

## Performance Benchmarks

In a head-to-head comparison on a global latency test:

| Metric | Containers | Wasm Edge |
|--------|-----------|-----------|
| Cold start | 150ms | 0.5ms |
| p50 latency | 45ms | 12ms |
| p99 latency | 320ms | 28ms |
| Memory per instance | 128MB | 4MB |

The difference is stark, especially at the tail (p99), where edge deployment eliminates the long network hop to a centralized data center.

## The Road Ahead

As WASI matures and the Component Model stabilizes, we will see Wasm become the default runtime for edge workloads. The combination of security, performance, and portability is simply too compelling to ignore. For developers, now is the time to start experimenting with Wasm-based edge platforms.`,
    isInitial: true,
  },
  {
    id: 'cosmic-rays-machine-learning',
    title: 'Detecting Cosmic Rays with Machine Learning',
    slug: 'detecting-cosmic-rays-with-machine-learning',
    date: 'December 5, 2024',
    category: 'Space Science',
    tags: ['cosmic-rays', 'machine-learning', 'astrophysics', 'data-science'],
    excerpt:
      'How modern ML pipelines are transforming cosmic ray detection, helping physicists sift through petabytes of particle shower data.',
    coverImage: 'https://placehold.co/1200x630/0a0a2e/a0a0ff?text=Cosmic+Rays+%2B+ML',
    status: 'Published' as PostStatus,
    content: `# Detecting Cosmic Rays with Machine Learning

Every second, Earth is bombarded by high-energy particles from the depths of space. These cosmic rays carry information about the most violent events in the universe -- supernovae, active galactic nuclei, and perhaps physics beyond the Standard Model. The challenge is detecting and classifying them.

## The Detection Challenge

When a high-energy cosmic ray strikes the atmosphere, it produces an extensive air shower -- a cascade of billions of secondary particles spreading over several square kilometers. Observatories like the Pierre Auger Observatory use arrays of surface detectors and fluorescence telescopes to capture these showers.

The problem? The data is enormous, noisy, and the signals we care about are rare. For every genuine ultra-high-energy cosmic ray event, there are thousands of background triggers from atmospheric muons, lightning, and detector noise.

## Traditional vs. ML Approaches

Traditional analysis uses hand-crafted features: signal rise time, total integrated charge, lateral distribution function fits. These work but require deep domain expertise and miss subtle patterns.

Modern ML approaches learn directly from the raw detector signals:

\\\`\\\`\\\`python
import torch
import torch.nn as nn

class CosmicRayCNN(nn.Module):
    """Classify cosmic ray events from surface detector traces."""

    def __init__(self, num_stations: int = 6, trace_length: int = 768):
        super().__init__()
        # Process individual station traces
        self.station_encoder = nn.Sequential(
            nn.Conv1d(1, 32, kernel_size=7, padding=3),
            nn.ReLU(),
            nn.MaxPool1d(4),
            nn.Conv1d(32, 64, kernel_size=5, padding=2),
            nn.ReLU(),
            nn.AdaptiveAvgPool1d(32),
        )
        # Combine information across stations
        self.classifier = nn.Sequential(
            nn.Linear(64 * 32 * num_stations, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 3),  # background, proton, iron
        )

    def forward(self, traces):
        batch_size = traces.shape[0]
        # traces shape: (batch, num_stations, trace_length)
        station_features = []
        for i in range(traces.shape[1]):
            feat = self.station_encoder(traces[:, i:i+1, :])
            station_features.append(feat.flatten(1))
        combined = torch.cat(station_features, dim=1)
        return self.classifier(combined)
\\\`\\\`\\\`

## Mass Composition Analysis

One of the most important open questions in cosmic ray physics is the composition of the highest-energy particles. Are they protons, helium nuclei, or heavier elements like iron? The answer has profound implications for understanding their sources and the physics of acceleration.

ML models can estimate composition by analyzing the depth of shower maximum (Xmax) and the muon content. Graph neural networks are particularly promising here, as they naturally handle the irregular geometry of detector arrays:

- Represent each detector station as a node
- Connect nearby stations with edges
- Use message passing to aggregate spatial information
- Predict composition probabilities from the graph-level embedding

## Results and Impact

Recent studies show that ML-based classifiers achieve:

- **Event detection**: 98.5% recall vs. 94% for traditional cuts
- **Composition resolution**: 15% improvement in mass discrimination
- **Angular reconstruction**: 0.8 degree resolution vs. 1.2 degrees traditional
- **Processing speed**: 1000x faster than full Monte Carlo reconstruction

## Beyond Classification

ML is also being used to:

- **Generate synthetic air showers**: GANs trained on CORSIKA simulations produce realistic showers 10,000x faster than full simulation.
- **Anomaly detection**: Autoencoders flag unusual events that might indicate new physics.
- **Real-time triggering**: Edge ML models running on detector electronics make sub-millisecond trigger decisions.

## The Future of Astroparticle Physics

The next generation of observatories (GCOS, SWGO) will produce even more data. Machine learning is not just a convenience; it is becoming essential infrastructure for cosmic ray science. As these techniques mature, they will help answer one of the great questions: where do the most energetic particles in the universe come from?`,
    isInitial: true,
  },
  {
    id: 'llm-fine-tuning-guide',
    title: 'A Practical Guide to Fine-Tuning Large Language Models',
    slug: 'a-practical-guide-to-fine-tuning-large-language-models',
    date: 'November 28, 2024',
    category: 'AI & ML',
    tags: ['llm', 'fine-tuning', 'lora', 'nlp', 'training'],
    excerpt:
      'From LoRA to full fine-tuning, a hands-on guide to adapting large language models for your specific domain and tasks.',
    coverImage: 'https://placehold.co/1200x630/2e1a0a/ffc080?text=LLM+Fine-Tuning',
    status: 'Published' as PostStatus,
    content: `# A Practical Guide to Fine-Tuning Large Language Models

Pre-trained large language models are remarkably capable, but they often need adaptation -- to your domain, your data, or your specific task format. Fine-tuning bridges the gap between a general model and a specialized tool.

## When to Fine-Tune

Not every problem requires fine-tuning. Consider this decision framework:

1. **Prompt engineering first**: Can you get good results with careful prompting? If so, skip fine-tuning.
2. **Few-shot examples**: Does adding examples to the prompt solve the problem? This is cheaper than fine-tuning.
3. **RAG (Retrieval-Augmented Generation)**: If the model needs access to specific knowledge, retrieval may be more effective.
4. **Fine-tuning**: When you need consistent formatting, domain-specific behavior, or significant quality improvements that prompting cannot achieve.

## LoRA: Efficient Adaptation

Low-Rank Adaptation (LoRA) is the most popular fine-tuning technique for its efficiency. Instead of updating all model weights, LoRA adds small trainable matrices to each layer:

\\\`\\\`\\\`python
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

# Load base model
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3-8B",
    torch_dtype=torch.bfloat16,
    device_map="auto",
)

# Configure LoRA
lora_config = LoraConfig(
    r=16,                      # Rank of the update matrices
    lora_alpha=32,             # Scaling factor
    target_modules=[           # Which layers to adapt
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj",
    ],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)

# Apply LoRA
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# Output: trainable params: 13.6M || all params: 8.0B || trainable%: 0.17%
\\\`\\\`\\\`

With LoRA, you train only 0.1-1% of the parameters while achieving results comparable to full fine-tuning for many tasks.

## Data Preparation

The quality of your fine-tuning data matters far more than the quantity. Key principles:

- **Diversity**: Cover the range of inputs the model will encounter.
- **Quality**: Every example should be a gold-standard demonstration.
- **Format consistency**: Use a consistent chat template or instruction format.
- **Deduplication**: Remove near-duplicate examples that would bias the model.

A typical dataset might have 1,000 to 50,000 high-quality examples, structured as instruction-response pairs:

\\\`\\\`\\\`json
{
  "messages": [
    {"role": "system", "content": "You are a medical coding assistant."},
    {"role": "user", "content": "Assign ICD-10 codes: Patient presents with acute bronchitis and mild dehydration."},
    {"role": "assistant", "content": "J20.9 - Acute bronchitis, unspecified\\nE86.0 - Dehydration"}
  ]
}
\\\`\\\`\\\`

## Training Configuration

Key hyperparameters to tune:

- **Learning rate**: 1e-5 to 5e-5 for full fine-tuning, 1e-4 to 3e-4 for LoRA.
- **Batch size**: As large as your GPU memory allows. Use gradient accumulation if needed.
- **Epochs**: 1-3 epochs for large datasets; more for small, high-quality datasets.
- **Warmup**: 5-10% of total steps with linear warmup prevents early instability.

## Evaluation Beyond Loss

Training loss tells you the model is learning, but not whether it is learning the right things. Evaluate with:

- **Task-specific metrics**: BLEU, ROUGE, exact match -- whatever matters for your use case.
- **Human evaluation**: Have domain experts rate outputs on a rubric.
- **Regression testing**: Ensure fine-tuning has not degraded general capabilities.
- **Adversarial testing**: Probe for failure modes and safety issues.

## Deployment Considerations

After fine-tuning, you need to serve the model efficiently:

- **Merge LoRA weights**: For production, merge the LoRA adapters back into the base model to eliminate inference overhead.
- **Quantization**: Apply GPTQ or AWQ quantization to reduce memory and increase throughput.
- **vLLM or TGI**: Use optimized serving frameworks with continuous batching and PagedAttention.

Fine-tuning is a powerful tool in the LLM toolkit, but it should be used judiciously. Start with the simplest approach that works and escalate only when needed.`,
    isInitial: true,
  },
  {
    id: 'mlops-production-pipelines',
    title: 'MLOps: Building Production ML Pipelines That Actually Work',
    slug: 'mlops-building-production-ml-pipelines-that-actually-work',
    date: 'November 20, 2024',
    category: 'MLOps',
    tags: ['mlops', 'pipelines', 'deployment', 'monitoring', 'ml-engineering'],
    excerpt:
      'Most ML models never make it to production. Here is how to build robust pipelines that bridge the gap between experimentation and deployment.',
    coverImage: 'https://placehold.co/1200x630/2e2e0a/f0f080?text=MLOps+Pipelines',
    status: 'Published' as PostStatus,
    content: `# MLOps: Building Production ML Pipelines That Actually Work

The dirty secret of machine learning is that the model is the easy part. Getting a model to work in a Jupyter notebook is a weekend project; keeping it running reliably in production is a multi-year engineering challenge.

## The MLOps Lifecycle

A production ML system is a living organism with distinct phases:

1. **Data ingestion and validation**
2. **Feature engineering and storage**
3. **Model training and evaluation**
4. **Model packaging and registry**
5. **Deployment and serving**
6. **Monitoring and retraining**

Each phase has its own failure modes, and the connections between phases are where most bugs hide.

## Data Validation: The First Line of Defense

Data quality issues are the number one cause of ML production failures. Use schema validation to catch problems before they propagate:

\\\`\\\`\\\`python
import pandera as pa
from pandera import Column, Check, DataFrameSchema

# Define expected data schema
training_schema = DataFrameSchema({
    "user_id": Column(int, Check.gt(0)),
    "feature_1": Column(float, Check.in_range(-1.0, 1.0)),
    "feature_2": Column(float, nullable=False),
    "label": Column(int, Check.isin([0, 1])),
    "timestamp": Column(pa.DateTime, Check(
        lambda s: s.max() - s.min() < pd.Timedelta(days=90),
        error="Data spans more than 90 days"
    )),
})

# Validate incoming data
validated_df = training_schema.validate(raw_df)
\\\`\\\`\\\`

Beyond schema validation, monitor for distributional drift. A feature that was normally distributed last month might become bimodal today, silently degrading model performance.

## Feature Stores: Single Source of Truth

Feature stores solve the training-serving skew problem by providing a single definition for each feature used in both training and inference:

- **Offline store**: For batch training on historical data (e.g., data warehouse, Parquet files).
- **Online store**: For low-latency serving (e.g., Redis, DynamoDB).
- **Feature registry**: Metadata about each feature including ownership, lineage, and freshness SLAs.

Tools like Feast, Tecton, and Hopsworks provide this infrastructure out of the box.

## Model Registry and Versioning

Every model artifact should be versioned and tracked. MLflow is the de facto standard:

\\\`\\\`\\\`python
import mlflow

with mlflow.start_run():
    # Log parameters
    mlflow.log_params({
        "learning_rate": 0.001,
        "batch_size": 256,
        "architecture": "transformer-small",
    })

    # Log metrics
    mlflow.log_metrics({
        "val_accuracy": 0.943,
        "val_f1": 0.921,
        "inference_latency_p99_ms": 12.5,
    })

    # Log the model with dependencies
    mlflow.pytorch.log_model(
        model,
        "model",
        registered_model_name="fraud-detector",
        pip_requirements=["torch==2.1.0", "transformers==4.36.0"],
    )
\\\`\\\`\\\`

## Deployment Patterns

Choose the right deployment pattern for your use case:

- **Shadow mode**: Run the new model alongside the current one without serving its predictions. Compare outputs to detect issues.
- **Canary deployment**: Route a small percentage of traffic to the new model. Gradually increase if metrics look good.
- **Blue-green deployment**: Maintain two identical environments. Switch traffic atomically when ready.
- **A/B testing**: Route traffic based on user segments. Measure business-level outcomes, not just model metrics.

## Monitoring: The Unsexy Superpower

Production monitoring should track:

- **Input drift**: Are the features changing over time?
- **Prediction drift**: Is the distribution of predictions shifting?
- **Performance drift**: Are ground truth labels (when available) showing accuracy degradation?
- **System metrics**: Latency, throughput, error rates, memory usage.

Set alerts on statistical tests (KS-test, PSI) rather than simple thresholds. A model that gradually drifts 1% per week can be catastrophic over a quarter while never triggering a fixed threshold alert.

## The Retraining Decision

Automated retraining sounds appealing but requires careful design:

- **Trigger**: Calendar-based (weekly), drift-based (PSI > 0.1), or performance-based (accuracy < threshold).
- **Validation gate**: Never auto-deploy a retrained model without passing comprehensive evaluation.
- **Rollback plan**: Always maintain the ability to instantly revert to the previous model version.

Building MLOps infrastructure is an investment, but it is the difference between a model that works once and a system that delivers value continuously.`,
    isInitial: true,
  },
];

const FALLBACK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'React Documentation',
    url: 'https://react.dev',
    description: 'The official React documentation with guides and API reference.',
    type: 'Article' as any,
    isInitial: true,
  },
  {
    id: 'rec-2',
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    description: 'Comprehensive guide to TypeScript fundamentals and advanced features.',
    type: 'Article' as any,
    isInitial: true,
  },
];

const FALLBACK_SETTINGS = {
  id: 'default',
  featured_post_id: 'neural-constellations',
  site_name: 'Mahir Faysal Tushar',
  site_description:
    'AI/ML Researcher & CS Student - Exploring the frontiers of artificial intelligence, machine learning, and technology.',
  author_name: 'Mahir Faysal Tushar',
  author_tagline: 'CS Student | AI/ML Enthusiast | Aspiring Researcher',
  author_bio:
    'Passionate about artificial intelligence, machine learning, and building intelligent systems. Currently pursuing Computer Science and sharing my learning journey through this blog.',
  social_github: 'https://github.com/M-F-Tushar',
  social_linkedin: 'https://linkedin.com/in/',
  social_email: 'contact@example.com',
  categories: [
    'AI & ML',
    'Web Development',
    'Quantum Computing',
    'AI Ethics',
    'Space Science',
    'MLOps',
  ],
  skills: [
    { name: 'Python', level: 4 },
    { name: 'Machine Learning', level: 3 },
    { name: 'React', level: 4 },
    { name: 'TypeScript', level: 4 },
    { name: 'Deep Learning', level: 3 },
    { name: 'MLOps', level: 2 },
  ],
  timeline: [
    {
      year: '2024',
      title: 'CS Student & Researcher',
      organization: 'University',
      description: 'Studying Computer Science with focus on AI/ML research.',
      type: 'education',
    },
  ],
  achievements: [
    {
      title: 'Research Blog Launch',
      issuer: 'Self',
      year: '2024',
    },
  ],
  navigation: {
    menuItems: [
      { id: 'home', label: 'Home', path: '/', isExternal: false, visible: true, order: 1 },
      { id: 'about', label: 'About', path: '/about', isExternal: false, visible: true, order: 2 },
      { id: 'blog', label: 'Blog', path: '/blog', isExternal: false, visible: true, order: 3 },
      {
        id: 'publications',
        label: 'Publications',
        path: '/publications',
        isExternal: false,
        visible: true,
        order: 4,
      },
      {
        id: 'projects',
        label: 'Projects',
        path: '/projects',
        isExternal: false,
        visible: true,
        order: 5,
      },
      {
        id: 'playground',
        label: 'Playground',
        path: '/playground',
        isExternal: false,
        visible: true,
        order: 6,
      },
      { id: 'cv', label: 'CV', path: '/cv', isExternal: false, visible: true, order: 7 },
      {
        id: 'contact',
        label: 'Contact',
        path: '/contact',
        isExternal: false,
        visible: true,
        order: 8,
      },
    ],
  },
};

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Blog Website',
    description:
      'A modern, full-featured blog platform built with Astro, React, and Tailwind CSS. Features include admin dashboard, Supabase backend, Markdown/MDX support, and GitHub Pages deployment.',
    github_url: 'https://github.com/M-F-Tushar/Blog-Website',
    demo_url: 'https://mahirfaysaltusherblog.is-a.dev',
    tags: ['Astro', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    status: 'active',
    featured: true,
    sort_order: 0,
    isInitial: true,
  },
  {
    id: 'proj-2',
    title: 'ML Pipeline Framework',
    description:
      'An end-to-end machine learning pipeline framework for automating data preprocessing, model training, hyperparameter tuning, and deployment.',
    github_url: 'https://github.com/M-F-Tushar/ml-pipeline',
    tags: ['Python', 'MLflow', 'Docker', 'MLOps'],
    status: 'active',
    featured: true,
    sort_order: 1,
    isInitial: true,
  },
  {
    id: 'proj-3',
    title: 'LLM Fine-Tuning Toolkit',
    description:
      'A toolkit for fine-tuning large language models using LoRA and QLoRA techniques. Supports Hugging Face models with efficient memory management.',
    github_url: 'https://github.com/M-F-Tushar/llm-finetune',
    tags: ['Python', 'PyTorch', 'Transformers', 'LoRA'],
    status: 'experimental',
    featured: false,
    sort_order: 2,
    isInitial: true,
  },
  {
    id: 'proj-4',
    title: 'Data Visualization Dashboard',
    description:
      'Interactive data visualization dashboard for exploring datasets with charts, graphs, and statistical summaries.',
    github_url: 'https://github.com/M-F-Tushar/viz-dashboard',
    tags: ['React', 'D3.js', 'TypeScript'],
    status: 'archived',
    featured: false,
    sort_order: 3,
    isInitial: true,
  },
];

const FALLBACK_PUBLICATIONS: Publication[] = [
  {
    id: 'pub-1',
    title: 'Exploring Large Language Models for Code Generation: A Comprehensive Survey',
    authors: ['Mahir Faysal Tushar', 'Research Collaborator'],
    venue: 'arXiv Preprint',
    year: 2025,
    type: 'preprint',
    abstract:
      'A comprehensive survey of recent advances in large language models for automated code generation, covering architectures, training methodologies, and evaluation benchmarks.',
    arxiv_url: 'https://arxiv.org/abs/2501.00000',
    code_url: 'https://github.com/M-F-Tushar/llm-code-gen-survey',
    featured: true,
    sort_order: 0,
    isInitial: true,
  },
  {
    id: 'pub-2',
    title: 'Efficient Fine-Tuning Strategies for Domain-Specific NLP Tasks',
    authors: ['Mahir Faysal Tushar'],
    venue: 'Workshop on Efficient NLP',
    year: 2024,
    type: 'workshop',
    abstract:
      'An investigation of parameter-efficient fine-tuning methods including LoRA, prefix tuning, and adapter layers for domain adaptation in resource-constrained settings.',
    featured: false,
    sort_order: 1,
    isInitial: true,
  },
];

const FALLBACK_PAGE_CONTENT: PageContent[] = [
  {
    id: 'pc-home-hero',
    page_name: 'home',
    section_key: 'hero',
    content: {
      title: 'Mahir Faysal Tushar',
      taglines: ['AI/ML Researcher', 'CS Student', 'Open Source Contributor', 'Tech Blogger'],
      description:
        'Exploring the frontiers of artificial intelligence, machine learning, and technology.',
    },
    sort_order: 0,
    is_visible: true,
  },
  {
    id: 'pc-home-stats',
    page_name: 'home',
    section_key: 'stats',
    content: {
      items: [
        { label: 'Articles', value: 10, icon: 'document' },
        { label: 'Projects', value: 8, icon: 'code' },
        { label: 'Publications', value: 3, icon: 'academic' },
        { label: 'Topics', value: 6, icon: 'tag' },
      ],
    },
    sort_order: 1,
    is_visible: true,
  },
  {
    id: 'pc-about-intro',
    page_name: 'about',
    section_key: 'intro',
    content: {
      heading: 'About Me',
      text: 'Passionate about artificial intelligence, machine learning, and building intelligent systems.',
    },
    sort_order: 0,
    is_visible: true,
  },
  {
    id: 'pc-contact-info',
    page_name: 'contact',
    section_key: 'info',
    content: {
      heading: 'Get in Touch',
      availability: 'Available for collaborations and research opportunities',
      faq: [
        { q: 'What are your research interests?', a: 'AI/ML, NLP, and MLOps.' },
        {
          q: 'Are you open to collaboration?',
          a: 'Yes! Feel free to reach out via email or GitHub.',
        },
      ],
    },
    sort_order: 0,
    is_visible: true,
  },
];

const FALLBACK_CV_EDUCATION: CVEducation[] = [
  {
    id: 'edu-1',
    institution: 'University (placeholder)',
    degree: 'B.Sc. in Computer Science and Engineering',
    field: 'Computer Science',
    start_year: 2022,
    description: 'Focused on AI/ML, data structures, algorithms, and software engineering.',
    courses: [
      'Machine Learning',
      'Deep Learning',
      'Natural Language Processing',
      'Computer Vision',
      'Data Structures & Algorithms',
      'Database Systems',
    ],
    sort_order: 0,
  },
];

const FALLBACK_CV_EXPERIENCE: CVExperience[] = [
  {
    id: 'exp-1',
    company: 'Various Projects',
    role: 'Open Source Contributor',
    start_date: '2023',
    description: 'Contributing to open-source ML/AI projects and building research tools.',
    highlights: [
      'Developed ML pipeline automation tools',
      'Contributed to LLM fine-tuning frameworks',
      'Built data visualization dashboards',
    ],
    is_current: true,
    sort_order: 0,
  },
];

const FALLBACK_CV_CERTIFICATIONS: CVCertification[] = [
  {
    id: 'cert-1',
    name: 'Research Blog Launch',
    issuer: 'Self',
    year: 2024,
    sort_order: 0,
  },
];

// ---------- Projects ----------

export async function getProjects(): Promise<Project[]> {
  if (!supabase) return FALLBACK_PROJECTS;
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching projects:', error);
    return FALLBACK_PROJECTS;
  }
  return data.map((p: any) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    long_description: p.long_description,
    github_url: p.github_url,
    demo_url: p.demo_url,
    image_url: p.image_url,
    tags: p.tags || [],
    status: p.status || 'active',
    featured: p.featured || false,
    sort_order: p.sort_order || 0,
    isInitial: p.is_initial || false,
    created_at: p.created_at,
    updated_at: p.updated_at,
  }));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
}

// ---------- Publications ----------

export async function getPublications(): Promise<Publication[]> {
  if (!supabase) return FALLBACK_PUBLICATIONS;
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('year', { ascending: false })
    .order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching publications:', error);
    return FALLBACK_PUBLICATIONS;
  }
  return data.map((p: any) => ({
    id: p.id,
    title: p.title,
    authors: p.authors || [],
    venue: p.venue,
    year: p.year,
    type: p.type || 'preprint',
    abstract: p.abstract,
    doi: p.doi,
    arxiv_url: p.arxiv_url,
    pdf_url: p.pdf_url,
    code_url: p.code_url,
    slides_url: p.slides_url,
    bibtex: p.bibtex,
    featured: p.featured || false,
    sort_order: p.sort_order || 0,
    isInitial: p.is_initial || false,
    created_at: p.created_at,
  }));
}

// ---------- Page Content ----------

export async function getPageContent(pageName: string): Promise<PageContent[]> {
  if (!supabase) return FALLBACK_PAGE_CONTENT.filter((c) => c.page_name === pageName);
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('page_name', pageName)
    .eq('is_visible', true)
    .order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching page content:', error);
    return FALLBACK_PAGE_CONTENT.filter((c) => c.page_name === pageName);
  }
  return data as PageContent[];
}

export async function getPageSection(
  pageName: string,
  sectionKey: string
): Promise<PageContent | undefined> {
  const sections = await getPageContent(pageName);
  return sections.find((s) => s.section_key === sectionKey);
}

// ---------- CV Data ----------

export async function getCVEducation(): Promise<CVEducation[]> {
  if (!supabase) return FALLBACK_CV_EDUCATION;
  const { data, error } = await supabase
    .from('cv_education')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching CV education:', error);
    return FALLBACK_CV_EDUCATION;
  }
  return data as CVEducation[];
}

export async function getCVExperience(): Promise<CVExperience[]> {
  if (!supabase) return FALLBACK_CV_EXPERIENCE;
  const { data, error } = await supabase
    .from('cv_experience')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching CV experience:', error);
    return FALLBACK_CV_EXPERIENCE;
  }
  return data as CVExperience[];
}

export async function getCVCertifications(): Promise<CVCertification[]> {
  if (!supabase) return FALLBACK_CV_CERTIFICATIONS;
  const { data, error } = await supabase
    .from('cv_certifications')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching CV certifications:', error);
    return FALLBACK_CV_CERTIFICATIONS;
  }
  return data as CVCertification[];
}

// ---------- Custom Pages ----------

export interface CustomPageData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  layout: string;
  status: string;
  sort_order: number;
  show_in_navigation: boolean;
}

export interface CustomPageSectionData {
  id: string;
  page_id: string;
  section_type: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  metadata: Record<string, any> | null;
  sort_order: number;
  visible: boolean;
}

export async function getCustomPages(): Promise<CustomPageData[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('custom_pages')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching custom pages:', error);
    return [];
  }
  return data as CustomPageData[];
}

export async function getCustomPageBySlug(slug: string): Promise<CustomPageData | undefined> {
  if (!supabase) return undefined;
  const { data, error } = await supabase
    .from('custom_pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error || !data) {
    return undefined;
  }
  return data as CustomPageData;
}

export async function getCustomPageSections(pageId: string): Promise<CustomPageSectionData[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('custom_page_sections')
    .select('*')
    .eq('page_id', pageId)
    .eq('visible', true)
    .order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching custom page sections:', error);
    return [];
  }
  return data as CustomPageSectionData[];
}

export async function getNavigationCustomPages(): Promise<CustomPageData[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('custom_pages')
    .select('*')
    .eq('status', 'published')
    .eq('show_in_navigation', true)
    .order('sort_order', { ascending: true });
  if (error || !data) {
    return [];
  }
  return data as CustomPageData[];
}
