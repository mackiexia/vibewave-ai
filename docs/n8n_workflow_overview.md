# VibeWave — AI Agent Workflow Overview (n8n)

This document explains the **agentic AI backend design** behind VibeWave.

While this repository contains only the frontend code, the intelligence of VibeWave is powered by an **n8n-orchestrated AI agent workflow** that interprets natural-language music requests and returns structured, enriched recommendations.

> **Why this format?** This workflow is documented through architecture explanation and screenshots rather than source exports to clearly communicate system design while protecting credentials.

---

## Product Goal

Enable users to discover music through **natural language** instead of rigid filters or algorithmic feeds.

### Example User Inputs

- "Chill lo-fi for studying on a rainy night"
- "Songs like BTS Dynamite but more relaxed"
- "Jazz for late-night city walks"

### System Requirements

The system must:

- Understand _intent_ and _vibe_
- Generate relevant, diverse recommendations
- Enrich results with real music metadata
- Fail gracefully when APIs or models are unavailable

---

## High-Level Architecture

```text
User Query
  ↓
Frontend (React)
  ↓
n8n Webhook (API boundary)
  ↓
AI Agent (DeepSeek Chat)
  ↓
Post-processing & Validation
  ↓
Spotify Enrichment
  ↓
Structured JSON Response
  ↓
Frontend Rendering
```

### Design Principle

**All sensitive logic and credentials live server-side (n8n).**  
The frontend never directly calls AI or Spotify APIs.

---

## Why n8n?

n8n was selected as the orchestration layer because it enables:

- ✅ Rapid iteration of agent workflows
- ✅ Visual inspection of reasoning pipelines
- ✅ Clear separation between AI logic and UI
- ✅ Safe credential handling (keys never exposed to client)
- ✅ Low-code experimentation with production-grade control

This made it ideal for prototyping an agentic AI system without prematurely over-engineering backend services.

---

## Workflow Breakdown

### 1. Webhook Trigger (Entry Point)

**Purpose:**  
Acts as the public API boundary, receives user queries from the frontend, and normalizes request format.

**Key Considerations:**

- Input validation (empty queries, length limits)
- CORS configuration
- Rate-limit ready (future hardening)

📸 **Screenshot:** Webhook trigger node  
_Look for: HTTP POST endpoint configuration, input parsing logic_
![Webhook trigger node](images/Webhook%20trigger%20node.png)

---

### 2. AI Agent Node (DeepSeek Chat)

**Role:**  
Core reasoning engine that converts natural language into structured music recommendations.

**Agent Behavior:**

- Interprets user intent (mood, genre, reference track)
- Reasons about musical similarity and vibe
- Produces a structured response rather than free text

**Agentic Patterns Applied:**

- Reasoning → Action separation
- Tool-aware prompting
- Schema-constrained output

📸 **Screenshot:** AI Agent node with system prompt  
_Look for: System prompt defining output schema, temperature settings, model selection_
![AI Agent node with system prompt](images/AI%20Agent%20node%20with%20system%20prompt.png)

---

### 3. Output Structuring & Guardrails (Code Node)

**Why This Step Exists:**  
LLMs are probabilistic. This node enforces product reliability.

**Responsibilities:**

- Parse AI output
- Validate JSON structure
- Ensure exactly 10 tracks are returned
- Verify required fields:
  - `title`
  - `artist`
  - `genre`
  - `recommendation_reason`

**Fallback Strategy:**

- Graceful degradation if AI output is malformed
- User-friendly error responses
- No raw errors exposed to frontend

📸 **Screenshot:** JavaScript validation/parsing node  
_Look for: JSON parsing logic, error handling, track count validation_
![JavaScript validation / parsing node](images/JavaScript%20validation%20%3A%20parsing%20node.png)

---

### 4. Spotify Enrichment

**Purpose:**  
Transform abstract recommendations into real, playable music.

**What Gets Added:**

- Spotify track URLs
- Album artwork
- 30-second preview clips (when available)

**Design Decision:**  
AI generates semantic intent → Spotify provides authoritative music metadata.  
This separation improves reliability and avoids hallucinated content.

📸 **Screenshot:** Spotify enrichment node  
_Look for: Spotify Search API call, metadata mapping, preview URL extraction_
![Spotify enrichment node](images/Spotify%20enrichment%20node.png)

---

### 5. Response to Frontend

**Final Output:**  
A clean, predictable JSON payload containing:

- Theme/mood metadata
- Array of enriched track objects
- Optional preview URLs
- Safe fallbacks if assets are missing

**Frontend Philosophy:**  
The frontend is intentionally "dumb":

- It only renders what the backend guarantees
- No AI logic runs client-side

📸 **Screenshot:** Respond to Webhook node  
_Look for: JSON response structure, HTTP status codes, error formatting_
![Respond to Webhook node](images/Respond%20to%20Webhook%20node.png)

---

## Security & Credential Strategy

This workflow is intentionally not committed as executable source.

### Key Security Decisions:

- ✅ AI and Spotify credentials stored inside n8n
- ✅ No secrets embedded in frontend code
- ✅ Webhook URL treated as an interface, not a secret
- ✅ Workflow shared via documentation, not raw exports

> This mirrors real-world product practices where architecture is shared, credentials are not.

---

## Quality & Evaluation Considerations

Although not yet fully instrumented, the workflow was designed with evaluation in mind:

| Metric                    | Purpose                   |
| ------------------------- | ------------------------- |
| Response time             | User experience benchmark |
| Recommendation relevance  | AI output quality         |
| Diversity of artists/eras | Avoid filter bubbles      |
| Preview availability rate | Playback UX success       |
| Graceful failure handling | System reliability        |

These metrics align with future A/B testing and iteration.

---

## Why This Matters (PM Perspective)

This workflow demonstrates:

1. **End-to-end AI product thinking** — not just feature requests
2. **Agentic system design** — not prompt hacking
3. **Clear API boundaries** — separation of concerns
4. **Safety and guardrail awareness** — production readiness
5. **Tradeoff decisions** — balancing speed, quality, and complexity

It reflects how an AI Product Manager reasons about **systems**, not just features.

---

**VibeWave** — Making every day more vivid 🎵
