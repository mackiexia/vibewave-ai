# VibeWave

## AI-Powered Music Discovery Agent

**Product Requirements Document v2.0**

---

## 1. Executive Summary

VibeWave is an AI-powered music recommendation agent that transforms natural language queries into personalized song recommendations. Users describe a vibe, mood, genre, or reference song, and the agent returns 10 curated tracks with album artwork, Spotify links, and 30-second audio previews.

**Key Achievement:** Successfully built and deployed a working prototype integrating n8n workflows, DeepSeek AI, Spotify API, and a modern React-style frontend.

---

## 2. Product Vision

### 2.1 Problem Statement

Music discovery is overwhelming. Users face algorithm fatigue from streaming platforms and struggle to articulate what they want to hear. Traditional recommendation systems lack the nuance to understand contextual requests like "songs for a rainy Sunday morning" or "tracks similar to BTS Dynamite but more chill."

### 2.2 Solution

VibeWave uses conversational AI to understand natural language music queries and returns contextually relevant recommendations with rich metadata, visual presentation, and instant audio previews.

---

## 3. Agentic AI Patterns Implemented

VibeWave demonstrates five core agentic AI patterns:

| Pattern                | Description                 | Implementation                                                     |
| ---------------------- | --------------------------- | ------------------------------------------------------------------ |
| **ReAct**              | Reasoning + Acting cycle    | AI classifies intent, reasons about music relationships, then acts |
| **Tool Use**           | External API integration    | Spotify API for artwork, URLs, and audio previews                  |
| **Chain of Thought**   | Step-by-step reasoning      | Query → Intent → Vibe Analysis → Recommendations                   |
| **Output Structuring** | Formatted JSON response     | Strict schema with theme, mood, color, 10 songs                    |
| **Guardrails**         | Safety and quality controls | Input validation, output verification, fallback handling           |

---

## 4. Technical Architecture

### 4.1 System Components

| Component           | Technology          | Purpose                                         |
| ------------------- | ------------------- | ----------------------------------------------- |
| **Workflow Engine** | n8n (Docker)        | Orchestrates AI agent, API calls, data flow     |
| **AI Model**        | DeepSeek Chat       | Natural language understanding, recommendations |
| **Music Data**      | Spotify Web API     | Album art, track URLs, 30-sec previews          |
| **Frontend**        | HTML + Tailwind CSS | Glassmorphism UI, animations, audio player      |
| **API Layer**       | n8n Webhook         | RESTful endpoint for frontend communication     |

### 4.2 Data Flow

```text
1. User enters natural language query in frontend
   ↓
2. Frontend sends POST request to n8n webhook
   ↓
3. n8n AI Agent processes query with DeepSeek
   ↓
4. Code node parses AI response into structured JSON
   ↓
5. Spotify enrichment adds artwork, URLs, preview clips
   ↓
6. Response returned to frontend for rendering
```

---

## 5. Guardrails & Safety

Production AI systems require robust guardrails to ensure reliability, safety, and quality. VibeWave implements the following controls:

### 5.1 Input Guardrails

| Control                      | Implementation                                                  |
| ---------------------------- | --------------------------------------------------------------- |
| **Query Length Limit**       | Max 500 characters; reject longer queries with friendly message |
| **Empty Query Check**        | Frontend validation prevents empty submissions                  |
| **Content Filtering**        | Block inappropriate or harmful content requests                 |
| **Prompt Injection Defense** | Sanitize inputs; system prompt designed to resist manipulation  |
| **Rate Limiting**            | Prevent abuse with request throttling (future: 10 req/min)      |

### 5.2 Output Guardrails

| Control                          | Implementation                                                       |
| -------------------------------- | -------------------------------------------------------------------- |
| **JSON Validation**              | Parse and validate AI response structure; reject malformed JSON      |
| **Song Count Verification**      | Ensure exactly 10 recommendations; retry if fewer                    |
| **Required Fields Check**        | Verify title, artist, album, year, genre, reason exist for each song |
| **Fallback Response**            | Return friendly error message if AI fails; never show raw errors     |
| **Spotify Graceful Degradation** | Show placeholder if artwork/preview unavailable; never break UI      |

### 5.3 System Guardrails

1. **Timeout Handling:** 30-second max for AI response; return cached/default recommendations if exceeded
2. **API Key Security:** Spotify credentials stored as environment variables, never exposed to frontend
3. **CORS Configuration:** Restrict API access to authorized domains only
4. **Error Logging:** Log failures for debugging without exposing sensitive data

---

## 6. Evaluation & Quality Metrics

Continuous evaluation ensures the AI agent meets user expectations and improves over time.

### 6.1 User Feedback Mechanisms

| Mechanism            | Implementation                      | Purpose                            |
| -------------------- | ----------------------------------- | ---------------------------------- |
| **Thumbs Up/Down**   | Per-song rating buttons             | Individual recommendation quality  |
| **Session Rating**   | 1-5 star rating after results       | Overall satisfaction tracking      |
| **Implicit Signals** | Track preview plays, Spotify clicks | Engagement without explicit action |
| **Feedback Form**    | Optional text input                 | Qualitative insights               |

### 6.2 Key Performance Indicators (KPIs)

| Metric                   | Target       | Current     | Status        |
| ------------------------ | ------------ | ----------- | ------------- |
| **Response Time**        | < 10 seconds | ~30 seconds | ⚠️ Needs Work |
| **Spotify Match Rate**   | > 90%        | ~85%        | ✅ Good       |
| **Preview Availability** | > 60%        | ~60%        | ✅ On Target  |
| **User Satisfaction**    | > 4.0/5      | TBD         | 🔄 Pending    |
| **Error Rate**           | < 5%         | ~3%         | ✅ Excellent  |

### 6.3 Evaluation Framework

1. **Relevance Testing:** Does "chill lo-fi" return lo-fi tracks? Test 50 query-result pairs weekly
2. **Diversity Check:** Ensure recommendations span different artists/albums, not just one
3. **Freshness Audit:** Mix of classic and recent tracks; not all songs from one era
4. **Edge Case Testing:** Obscure queries, non-English requests, ambiguous inputs
5. **A/B Testing:** Compare prompt variations to optimize recommendation quality

---

## 7. UI/UX Design

### 7.1 Visual Design System

- **Style:** Glassmorphism with dark gradient background
- **Colors:** Dynamic theme colors based on music mood
- **Animations:** Floating particles, card entrance animations, hover effects
- **Cards:** Album artwork, song info, genre tag, Spotify button

### 7.2 Dynamic Theme Colors

| Mood              | Color     | Genres                      |
| ----------------- | --------- | --------------------------- |
| **Chill / Lo-fi** | `#74B9FF` | Lo-fi, Ambient, Study music |
| **Upbeat / Pop**  | `#FF2D78` | Pop, Dance, Party           |
| **K-pop**         | `#A855F7` | K-pop, J-pop, Asian pop     |
| **Jazz / Soul**   | `#FDCB6E` | Jazz, Soul, Blues           |
| **Dark / Metal**  | `#1A1A2E` | Metal, Dark wave, Gothic    |

---

## 8. Implementation Status

| Feature              | Status      | Notes                        |
| -------------------- | ----------- | ---------------------------- |
| n8n Workflow         | ✅ Complete | Webhook + AI Agent + Spotify |
| AI Recommendations   | ✅ Complete | DeepSeek with custom prompt  |
| Spotify Integration  | ✅ Complete | Artwork, URLs, previews      |
| Audio Previews       | ✅ Complete | 30-sec clips with player     |
| Frontend UI          | ✅ Complete | Glassmorphism + animations   |
| User Feedback System | 🔄 Planned  | Thumbs up/down, ratings      |
| Cloud Deployment     | 🔄 Planned  | Vercel + n8n Cloud           |

---

## 9. Future Enhancements

### Phase 2 (Next Sprint)

- User accounts with saved playlists
- Export to Spotify playlist feature
- Share results on social media

### Phase 3 (Future)

- Multi-language support (Chinese, Korean, Japanese)
- Voice input for queries
- Mood detection from user's listening history
- Apple Music / YouTube Music integration

---

**VibeWave: Making every day more vivid 让每一天都更生动** 🎵
