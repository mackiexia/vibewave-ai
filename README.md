# VibeWave 🎶 — Music Discovery

VibeWave is an AI-powered music recommendation experience.  
Users describe a vibe, mood, genre, or reference song (e.g. “chill lo-fi for studying” or “songs like good luck babe by chappell roan”), and VibeWave returns a curated set of tracks with artwork, preview audio, and Spotify links.

> This repository contains the **frontend** for VibeWave.  
> The AI agent and music-enrichment logic run in **n8n**, which is not included here.

---

## What This Repo Contains

- Vanilla HTML/CSS/JS frontend for user interaction
- UI logic for:
  - Natural-language query input
  - Animated music cards
  - Audio preview playback
  - Spotify “Open in app” links
- API interface to a backend **n8n webhook** (configurable)

## What This Repo Does **Not** Contain

- Any API keys (DeepSeek, Spotify, etc.)
- n8n credentials or workflow secrets
- Deployed backend services

All credentials are expected to be configured **in your own n8n instance**, not in this repo.

---

## Tech Stack

**Frontend (this repo)**

- HTML
- Tailwind CSS (via CDN)
- Vanilla JS for audio and animation logic


**Backend (not included in this repo)**

- n8n (workflow automation & orchestration)
- DeepSeek Chat (AI reasoning & recommendations)
- Spotify Web API (track metadata, artwork, previews)

---

## Architecture Overview

```text
Frontend (HTML/JS)
  → n8n Webhook (HTTP endpoint you configure)
    → AI Agent (DeepSeek Chat)
    → Spotify API (track enrichment)
```

## Development Process

To help accelerate the development, I used **AI-driven tools**, like Claude, to assist with:

- Writing some boilerplate code
- Creating product prompts and documentation
- Generating sample data for testing purposes

However, I was the architect behind the product vision and AI workflow, ensuring the system aligned with user needs and security requirements.

## Docs

- [n8n Workflow Overview](docs/n8n_workflow_overview.md)
- [PRD](docs/VibeWave_PRD_v3.md)
- [Eval Dashboard](https://mackiexia.github.io/vibewave-ai/docs/VibeWaveEvalDashboard.html)
  

## Demo

![Demo](https://github.com/mackiexia/vibewave-ai/blob/main/docs/images/Demo.gif?raw=true)

