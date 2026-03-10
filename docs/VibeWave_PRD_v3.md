# VibeWave
## AI-Powered Music Discovery Agent
**Product Requirements Document v3.0**
*Last Updated: March 2026 | Status: MVP Complete*

---

## 1. Executive Summary

VibeWave is an AI-powered music recommendation agent that transforms natural language queries into personalized song recommendations. Users describe a vibe, mood, genre, or reference song, and the agent returns 10 curated tracks with album artwork, Spotify links, and 30-second audio previews.

**Key Achievement:** Successfully built, tested, and evaluated a working MVP integrating n8n workflows, DeepSeek AI, Spotify API, and a glassmorphism frontend — validated across 2 rounds of structured evaluation with 17 test queries.

---

## 2. Product Vision

### 2.1 Problem Statement

Music discovery is overwhelming. Users face algorithm fatigue from streaming platforms and struggle to articulate what they want to hear. Traditional recommendation systems lack the nuance to understand contextual requests like "songs for a rainy Sunday morning" or "tracks similar to BTS Dynamite but more chill."

### 2.2 Solution

VibeWave uses conversational AI to understand natural language music queries and returns contextually relevant recommendations with rich metadata, visual presentation, and instant audio previews.

**Key design decisions:**

- **Satisfaction Rate over Relevance Score** — 👍 captures both "matches my query" AND "I just like this song", both are valid success signals
- **Discover Again over Replay Animation** — user intent on re-click is to find new songs, not replay the animation
- **60/40 mainstream/hidden gems mix** — balance familiarity with discovery, avoid pure mainstream recommendations

---

## 3. Agentic AI Patterns Implemented

| Pattern | Description | Implementation |
|---------|-------------|----------------|
| **ReAct** | Reasoning + Acting cycle | AI classifies intent, reasons about music relationships, then acts |
| **Tool Use** | External API integration | Spotify API for artwork, URLs, and audio previews |
| **Chain of Thought** | Step-by-step reasoning | Query → Intent → Vibe Analysis → Recommendations |
| **Output Structuring** | Formatted JSON response | Strict schema with theme, mood, color, 10 songs |
| **Guardrails** | Safety and quality controls | Input validation, output verification, prompt injection defense, fallback handling |

---

## 4. Technical Architecture

### 4.1 System Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Workflow Engine** | n8n (Docker) | Orchestrates AI agent, API calls, data flow |
| **AI Model** | DeepSeek Chat (Temp 1.0) | Natural language understanding, recommendations |
| **Music Data** | Spotify Web API | Album art, track URLs, 30-sec previews |
| **Frontend** | HTML + Tailwind CSS | Glassmorphism UI, animations, i18n, audio player |
| **API Layer** | n8n Webhook + Set Node | RESTful endpoint; extracts language & query params |

### 4.2 Data Flow

```
1. User enters natural language query in frontend (EN / 中文 / FR / JP)
   ↓
2. Frontend sends POST request to n8n webhook with { query, language, retry }
   ↓
3. Set node extracts language and query as clean variables
   ↓
4. n8n AI Agent processes query with DeepSeek at Temperature 1.0
   ↓
5. Code node parses AI response into structured JSON
   ↓
6. Spotify enrichment node adds artwork, URLs, preview clips
   ↓
7. Response returned to frontend for rendering
```

---

## 5. Guardrails & Safety

### 5.1 Input Guardrails

| Control | Implementation |
|---------|----------------|
| **Query Length Limit** | Max 500 characters; reject longer queries with friendly i18n message |
| **Empty / Short Query Check** | Frontend validation prevents empty or <2 char submissions |
| **Content Filtering** | System prompt blocks inappropriate or non-music requests |
| **Prompt Injection Defense** | Sanitize inputs; system prompt designed to resist manipulation; returns generic popular music on injection attempt |
| **Rate Limiting** | Planned: 10 req/min (future deployment) |

### 5.2 Output Guardrails

| Control | Implementation |
|---------|----------------|
| **JSON Validation** | Parse and validate AI response structure; reject malformed JSON |
| **Song Count Verification** | Ensure exactly 10 recommendations; fallback if fewer |
| **Required Fields Check** | Verify title, artist, album, year, genre, reason exist for each song |
| **Theme Color Contrast** | Frontend `ensureReadableColor()` auto-boosts dark colors (luminance < 0.45) to lightness ≥ 65% — prevents dark colors blending into background |
| **Fallback Response** | Return friendly error message if AI fails; never show raw errors |
| **Spotify Graceful Degradation** | Show placeholder / Open in Spotify overlay if artwork or preview unavailable |

### 5.3 System Guardrails

- **Timeout Handling:** 120-second AbortController on fetch; return friendly error if exceeded
- **API Key Security:** Spotify credentials stored as n8n environment variables, never exposed to frontend
- **Language Enforcement:** Set node extracts language param; AI Agent system prompt enforces language for all descriptive fields
- **Diversity Enforcement:** System prompt instructs 60% well-known / 40% hidden gems mix; Temperature 1.0 maximizes variety

---

## 6. Evaluation & Quality Metrics

### 6.1 User Feedback Mechanisms

| Mechanism | Implementation | Purpose |
|-----------|----------------|---------|
| **Songs I Actually Like** | Per-song 👍 thumbs up with satisfaction counter + progress bar | Individual quality; captures both relevance AND personal preference |
| **Overall Satisfaction** | Post-results 👍/👎 widget (low-key, resets on every new search) | Session-level satisfaction signal |
| **Implicit Signals** | Spotify link click tracking (pending instrumentation) | Engagement without explicit action |

### 6.2 Key Performance Indicators — Actual Results

| Metric | Target | Round 1 | Round 2 | Status |
|--------|--------|---------|---------|--------|
| Response Time | < 60s | 50–70s | 40–55s | ✅ Improved |
| End-to-End Success Rate | > 95% | 94% (16/17) | 100% (4/4) | ✅ Target met |
| Relevance Score (avg) | > 4.0 / 5 | 4.8 / 5 | 5.0 / 5 | ✅ Excellent |
| Mood Fit Score (avg) | > 4.0 / 5 | 4.8 / 5 | 5.0 / 5 | ✅ Excellent |
| Diversity (unique artists) | ≥ 8 / 10 | 9.6 avg | 9.5 avg | ✅ On Target |
| Satisfaction Rate (avg) | > 60% | 76% | 80% | ✅ Above Target |
| Re-search Rate | As low as possible | 2 / 17 queries | 1 / 4 queries | ✅ Good |

### 6.3 Key Findings

**① Vague queries outperform specific ones**
「就是想知道你能推荐出什么有品位的歌」achieved 100% satisfaction — AI's creative freedom produces higher-quality, more opinionated recommendations when not constrained by a specific reference.

**② Satisfaction Rate ≠ Relevance**
One query scored 4/5 on relevance but 80% satisfaction — users liked songs that weren't technically close matches. Validates the metric rename decision: VibeWave's goal is helping users find good music, not just matching queries.

**③ Japanese query triggers J-pop ecosystem, Chinese does not**
Same non-English input pattern, different outcomes. AI's J-pop cultural knowledge is structurally stronger than C-pop — a training data gap, not a prompt issue. Single-language prompt workarounds only partially solve it.

**④ Year bias is correctable via prompt**
French café jazz satisfaction rose from 30% → 70% after adding `prioritize post-2010` to system prompt. Prompt engineering can effectively address era bias.

**⑤ 60/40 mainstream/hidden gems mix works**
*idk just something good* satisfaction improved from Round 1 baseline to 60% (first search) → 70% (re-search) in Round 2. First-search still triggers re-search, suggesting the initial ratio needs further tuning.

### 6.4 A/B Testing

| Group | Variable | Query | Result |
|-------|----------|-------|--------|
| 1-A Control | No year constraint | French café jazz | Satisfaction 30–50%, older catalog |
| 1-B Test | `prioritize post-2010` in prompt | French café jazz | Satisfaction 70%, modern covers + broader genre range |
| 2-A Control | No language constraint | 一个人坐高铁途中适合听的歌 | Pending Round 3 |
| 2-B Test | Include Chinese-language songs if possible | 一个人坐高铁途中适合听的歌 | Pending Round 3 |

---

## 7. UI/UX Design

### 7.1 Visual Design System

- **Style:** Glassmorphism with dark gradient background (gray-900 → slate-900)
- **Colors:** Dynamic theme colors based on music mood — auto-corrected for readability via contrast protection function
- **Animations:** Floating particles, card entrance (fadeInUp), equalizer bars, thumbs-up pop + ripple animation
- **Loading State:** 5-slide feature carousel (3.5s rotation) with equalizer animation
- **Language Switcher:** EN / 中文 / FR / JP — full i18n across all UI text, error messages, and satisfaction feedback

### 7.2 Dynamic Theme Colors

| Mood | Color | Notes |
|------|-------|-------|
| Chill / Lo-fi | `#74B9FF` | Soft blue |
| Upbeat / Pop | `#FF2D78` | Hot pink |
| K-pop / J-pop | `#A855F7` | Electric purple |
| Jazz / Soul | `#FDCB6E` | Warm gold |
| Dark / Metal | `#8B5CF6` | Deep violet — updated from `#1A1A2E` which blended with background |
| Dreamy / Ambient | `#A29BFE` | Lavender |
| Indie / Alternative | `#55A3FF` | Sky blue |
| Hip-hop / Rap | `#F97316` | Orange |

---

## 8. Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| n8n Workflow | ✅ Complete | Webhook + Set Node + AI Agent + Spotify enrichment |
| AI Recommendations | ✅ Complete | DeepSeek, Temperature 1.0, custom system prompt |
| Spotify Integration | ✅ Complete | Artwork, track URLs, 30-sec previews |
| Audio Previews | ✅ Complete | 30-sec clips with play/pause/equalizer UI |
| Frontend UI | ✅ Complete | Glassmorphism, animations, responsive grid |
| Guardrails | ✅ Complete | Prompt injection defense, input/output validation, contrast protection |
| User Feedback System | ✅ Complete | Per-song 👍 counter + overall satisfaction 👍/👎 widget |
| Loading Carousel | ✅ Complete | 5-slide feature carousel with dot indicators |
| Multi-language Support | ✅ Complete | EN / 中文 / FR / JP full i18n |
| Discover Again Button | ✅ Complete | Re-triggers same query for fresh recommendations |
| Evaluation Framework | ✅ Complete | 2 rounds, 17+ queries, 3-layer metrics, A/B testing |
| Cloud Deployment | 🔄 Planned | GitHub Pages (frontend) + Railway/Render (n8n) |
| `music_language` Param | 🔄 Planned | Explicit language param to improve C-pop / non-English results |
| `retry` Param Logic | 🔄 Planned | On Discover Again, shift to higher hidden gems ratio |

---

## 9. Outstanding Action Items

| Priority | Issue | Solution | Status |
|----------|-------|----------|--------|
| 🟡 Medium | Chinese query doesn't surface Chinese songs | Add `music_language` param to frontend; pass to AI Agent for explicit language-of-music control | Planned Round 3 |
| 🟡 Medium | 60/40 mix still triggers re-search on first attempt | Implement `retry` param: first search = 70/30; Discover Again = 50/50 | Planned Round 3 |
| 🟢 Low | Spotify node occasional network disconnect | Add Retry on Fail (2x) in n8n node settings | Pending |
| 🟢 Low | Cloud deployment | GitHub Pages for frontend; Railway or Render for n8n | Pending |

---

## 10. Future Enhancements

### Phase 2 — Next Sprint
- `music_language` parameter for explicit non-English music recommendations
- `retry` parameter logic: progressive hidden gems ratio on Discover Again
- Spotify click tracking for implicit engagement metrics
- Cloud deployment: GitHub Pages + Railway

### Phase 3 — Future
- User accounts with saved playlists and search history
- Export to Spotify playlist feature
- Social sharing of recommendation sets
- Voice input for queries
- Apple Music / YouTube Music integration

---

*VibeWave · Making every day more vivid · 让每一天都更生动 🎵*
