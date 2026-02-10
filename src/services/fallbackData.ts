/**
 * Fallback/Mock data for when Supabase is not configured
 * This ensures the site still works in demo mode without a backend
 */

import { Post, Recommendation, PostStatus } from '../types/types';
import type { DatabaseSettings } from './supabase';
import type { Project, Publication } from './supabase';
import type {
  DatabaseCVEducation,
  DatabaseCVExperience,
  DatabaseCVCertification,
  DatabasePageContent,
} from './supabase';

/**
 * Mock posts for demo/fallback mode
 */
export const FALLBACK_POSTS: Post[] = [
  {
    id: 'neural-constellations',
    title: 'Neural Constellations: Mapping the Architecture of Thought',
    date: 'January 15, 2025',
    category: 'AI & ML',
    tags: ['neural-networks', 'deep-learning', 'architecture', 'transformers'],
    excerpt:
      'A deep dive into modern neural network architectures, from transformers to state-space models, and the design principles that make them work.',
    coverImage: 'https://placehold.co/1200x630/1a1a2e/e0e0ff?text=Neural+Constellations',
    status: 'published' as PostStatus,
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
    date: 'January 8, 2025',
    category: 'Quantum Computing',
    tags: ['quantum', 'entanglement', 'qubits', 'error-correction'],
    excerpt:
      'Exploring how quantum entanglement enables computational paradigms impossible with classical machines, and the engineering challenges that remain.',
    coverImage: 'https://placehold.co/1200x630/0d1b2a/7ec8e3?text=Quantum+Entanglement',
    status: 'published' as PostStatus,
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
    date: 'December 28, 2024',
    category: 'Web Development',
    tags: ['astro', 'islands-architecture', 'performance', 'frontend'],
    excerpt:
      "How Astro's islands architecture delivers near-zero JavaScript by default while still supporting rich interactivity where you need it.",
    coverImage: 'https://placehold.co/1200x630/1b1b3a/c084fc?text=Astro+Islands',
    status: 'published' as PostStatus,
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
    date: 'December 20, 2024',
    category: 'AI Ethics',
    tags: ['ai-ethics', 'alignment', 'safety', 'governance'],
    excerpt:
      'As AI systems grow more capable and autonomous, how do we ensure they act in alignment with human values? A look at the technical and philosophical challenges.',
    coverImage: 'https://placehold.co/1200x630/2d1b2e/f0a0c0?text=AI+Ethics',
    status: 'published' as PostStatus,
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
    date: 'December 12, 2024',
    category: 'Web Development',
    tags: ['webassembly', 'edge-computing', 'serverless', 'wasm'],
    excerpt:
      'WebAssembly is escaping the browser and powering a new generation of edge computing platforms. Here is what that means for developers.',
    coverImage: 'https://placehold.co/1200x630/1a2e1a/a0f0a0?text=Edge+%2B+WASM',
    status: 'published' as PostStatus,
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
    date: 'December 5, 2024',
    category: 'Space Science',
    tags: ['cosmic-rays', 'machine-learning', 'astrophysics', 'data-science'],
    excerpt:
      'How modern ML pipelines are transforming cosmic ray detection, helping physicists sift through petabytes of particle shower data.',
    coverImage: 'https://placehold.co/1200x630/0a0a2e/a0a0ff?text=Cosmic+Rays+%2B+ML',
    status: 'published' as PostStatus,
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
    date: 'November 28, 2024',
    category: 'AI & ML',
    tags: ['llm', 'fine-tuning', 'lora', 'nlp', 'training'],
    excerpt:
      'From LoRA to full fine-tuning, a hands-on guide to adapting large language models for your specific domain and tasks.',
    coverImage: 'https://placehold.co/1200x630/2e1a0a/ffc080?text=LLM+Fine-Tuning',
    status: 'published' as PostStatus,
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
    date: 'November 20, 2024',
    category: 'MLOps',
    tags: ['mlops', 'pipelines', 'deployment', 'monitoring', 'ml-engineering'],
    excerpt:
      'Most ML models never make it to production. Here is how to build robust pipelines that bridge the gap between experimentation and deployment.',
    coverImage: 'https://placehold.co/1200x630/2e2e0a/f0f080?text=MLOps+Pipelines',
    status: 'published' as PostStatus,
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

/**
 * Mock recommendations for demo/fallback mode
 */
export const FALLBACK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'React Documentation',
    url: 'https://react.dev',
    description: 'The official React documentation with guides and API reference.',
    type: 'website',
    isInitial: true,
  },
  {
    id: 'rec-2',
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    description: 'Comprehensive guide to TypeScript fundamentals and advanced features.',
    type: 'documentation',
    isInitial: true,
  },
  {
    id: 'rec-3',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    description: 'The most comprehensive web development documentation resource.',
    type: 'website',
    isInitial: true,
  },
  {
    id: 'rec-4',
    title: 'Vite Guide',
    url: 'https://vitejs.dev/guide/',
    description: 'Next generation frontend tooling for fast development.',
    type: 'documentation',
    isInitial: true,
  },
];

/**
 * Mock site settings for demo/fallback mode
 */
export const FALLBACK_SETTINGS: Omit<DatabaseSettings, 'id' | 'created_at' | 'updated_at'> = {
  featured_post_id: 'neural-constellations',
  site_name: 'My Blog',
  site_description: 'A modern personal blog built with React and TypeScript',
  author_name: 'Your Name',
  author_tagline: 'Web Developer & Technology Enthusiast',
  author_bio:
    'Passionate about building modern web applications and sharing knowledge through writing.',
  social_github: 'https://github.com/yourusername',
  social_linkedin: 'https://linkedin.com/in/yourprofile',
  social_email: 'your-email@example.com',
  categories: [
    'AI & ML',
    'Web Development',
    'Quantum Computing',
    'AI Ethics',
    'Space Science',
    'MLOps',
  ],
  skills: [
    { name: 'React', level: 4, iconName: 'react' },
    { name: 'TypeScript', level: 4, iconName: 'typescript' },
    { name: 'JavaScript', level: 5, iconName: 'javascript' },
    { name: 'Node.js', level: 3, iconName: 'nodejs' },
    { name: 'CSS', level: 4, iconName: 'css' },
  ],
  timeline: [
    {
      year: '2024',
      title: 'Full Stack Developer',
      organization: 'Tech Company',
      description: 'Building modern web applications',
      type: 'work',
    },
    {
      year: '2023',
      title: 'Bachelor of Science',
      organization: 'University',
      description: 'Computer Science',
      type: 'education',
    },
  ],
  achievements: [
    {
      title: 'Web Development Certificate',
      issuer: 'Online Learning Platform',
      year: '2023',
    },
  ],
};

// Re-export isSupabaseConfigured for convenience
export { isSupabaseConfigured as isSupabaseAvailable } from './supabase';

/**
 * Mock projects for demo/fallback mode
 */
export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'project-1',
    title: 'Personal Blog Platform',
    description:
      'A modern blog platform built with React, TypeScript, and Supabase featuring real-time updates, markdown rendering, and a full admin dashboard.',
    techStack: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    imageUrl: undefined,
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/blog',
    sortOrder: 1,
    isFeatured: true,
    status: 'published',
    isInitial: true,
  },
  {
    id: 'project-2',
    title: 'Task Management App',
    description:
      'A collaborative task management application with real-time sync, drag-and-drop boards, and team workspaces.',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'WebSocket'],
    imageUrl: undefined,
    liveUrl: undefined,
    githubUrl: 'https://github.com/yourusername/taskmanager',
    sortOrder: 2,
    isFeatured: false,
    status: 'published',
    isInitial: true,
  },
];

/**
 * Mock publications for demo/fallback mode
 */
export const FALLBACK_PUBLICATIONS: Publication[] = [
  {
    id: 'pub-1',
    title: 'Modern Web Architecture: A Comprehensive Survey',
    authors: ['Your Name', 'Co-Author'],
    venue: 'International Conference on Web Engineering',
    year: 2024,
    abstract:
      'A comprehensive survey of modern web architecture patterns including micro-frontends, server-side rendering, and edge computing.',
    doiUrl: 'https://doi.org/10.1234/example',
    pdfUrl: undefined,
    type: 'conference',
    sortOrder: 1,
    isInitial: true,
  },
  {
    id: 'pub-2',
    title: 'Performance Optimization Techniques for Single Page Applications',
    authors: ['Your Name'],
    venue: 'Journal of Web Technologies',
    year: 2023,
    abstract:
      'An analysis of performance optimization techniques for SPAs including code splitting, lazy loading, and caching strategies.',
    doiUrl: undefined,
    pdfUrl: undefined,
    type: 'journal',
    sortOrder: 2,
    isInitial: true,
  },
];

/**
 * Mock CV education entries for demo/fallback mode
 */
export const FALLBACK_CV_EDUCATION: Omit<DatabaseCVEducation, 'created_at' | 'updated_at'>[] = [
  {
    id: 'edu-1',
    institution: 'University of Technology',
    degree: 'Master of Science',
    field: 'Computer Science',
    start_date: '2021-09-01',
    end_date: '2023-06-30',
    description: 'Specialized in distributed systems and web technologies.',
    sort_order: 1,
    is_initial: true,
  },
  {
    id: 'edu-2',
    institution: 'State University',
    degree: 'Bachelor of Science',
    field: 'Software Engineering',
    start_date: '2017-09-01',
    end_date: '2021-06-30',
    description: 'Graduated with honors. Focus on full-stack development.',
    sort_order: 2,
    is_initial: true,
  },
];

/**
 * Mock CV experience entries for demo/fallback mode
 */
export const FALLBACK_CV_EXPERIENCE: Omit<DatabaseCVExperience, 'created_at' | 'updated_at'>[] = [
  {
    id: 'exp-1',
    company: 'Tech Corp',
    position: 'Senior Frontend Developer',
    start_date: '2023-07-01',
    end_date: null,
    description: 'Leading frontend architecture for the main product platform.',
    responsibilities: [
      'Architecting and developing React-based micro-frontend systems',
      'Mentoring junior developers and conducting code reviews',
      'Collaborating with design and backend teams on API contracts',
    ],
    sort_order: 1,
    is_initial: true,
  },
  {
    id: 'exp-2',
    company: 'Startup Inc',
    position: 'Full Stack Developer',
    start_date: '2021-06-01',
    end_date: '2023-06-30',
    description: 'Built and maintained the core web application from the ground up.',
    responsibilities: [
      'Developing full-stack features using React and Node.js',
      'Implementing CI/CD pipelines and automated testing',
      'Managing PostgreSQL database design and optimization',
    ],
    sort_order: 2,
    is_initial: true,
  },
];

/**
 * Mock CV certification entries for demo/fallback mode
 */
export const FALLBACK_CV_CERTIFICATIONS: Omit<
  DatabaseCVCertification,
  'created_at' | 'updated_at'
>[] = [
  {
    id: 'cert-1',
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    issue_date: '2024-01-15',
    expiry_date: '2027-01-15',
    credential_url: 'https://aws.amazon.com/certification/',
    sort_order: 1,
    is_initial: true,
  },
  {
    id: 'cert-2',
    name: 'Google Professional Cloud Developer',
    issuer: 'Google Cloud',
    issue_date: '2023-06-10',
    expiry_date: '2025-06-10',
    credential_url: 'https://cloud.google.com/certification',
    sort_order: 2,
    is_initial: true,
  },
];

/**
 * Mock page content entries for demo/fallback mode
 */
export const FALLBACK_PAGE_CONTENT: Omit<DatabasePageContent, 'created_at' | 'updated_at'>[] = [
  {
    id: 'pc-1',
    page_name: 'home',
    section_key: 'hero',
    title: 'Welcome to My Site',
    content: 'A personal blog and portfolio showcasing my work in web development and technology.',
    metadata: null,
    sort_order: 1,
    is_initial: true,
  },
  {
    id: 'pc-2',
    page_name: 'about',
    section_key: 'bio',
    title: 'About Me',
    content:
      'I am a passionate web developer with experience in modern frontend and backend technologies. I enjoy building performant, accessible, and well-designed applications.',
    metadata: null,
    sort_order: 1,
    is_initial: true,
  },
  {
    id: 'pc-3',
    page_name: 'projects',
    section_key: 'intro',
    title: 'My Projects',
    content:
      'A collection of projects I have worked on, ranging from open-source tools to production applications.',
    metadata: null,
    sort_order: 1,
    is_initial: true,
  },
];
