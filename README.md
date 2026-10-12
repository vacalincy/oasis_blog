<div align="center">
  <br />
  <a href="https://github.com/vacalincy/oasis_blog" target="_blank">
    <!-- Top Hero Visual: Orbital Animation -->
    <img src="./oasis-react/public/assets/video/orbitral.gif" alt="OASIS Orbital Gallery Hero Demo" width="100%" />
  </a>
  <br />
  <br />

  <div>
    <img src="https://img.shields.io/badge/-React_19-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react" />
    <img src="https://img.shields.io/badge/-Vite-black?style=for-the-badge&logoColor=white&logo=vite&color=646CFF" alt="vite" />
    <img src="https://img.shields.io/badge/-Supabase-black?style=for-the-badge&logoColor=white&logo=supabase&color=3ECF8E" alt="supabase" />
    <img src="https://img.shields.io/badge/-GSAP-black?style=for-the-badge&logoColor=white&logo=greensock&color=88CE02" alt="gsap" />
    <img src="https://img.shields.io/badge/-React_Router-black?style=for-the-badge&logoColor=white&logo=reactrouter&color=CA4245" alt="react-router" />
    <img src="https://img.shields.io/badge/-CSS3-black?style=for-the-badge&logoColor=white&logo=css3&color=1572B6" alt="css3" />
  </div>

  <h1 align="center">OASIS</h1>

  <p align="center">
    <b>Escape the noise. Curate your reality.</b>
  </p>

  <p align="center">
    A digital sanctuary for human-curated editorial stories, peaceful reading, and meaningful whitespace.
  </p>

  <br />

  <p align="center">
    <img src="./oasis-react/public/assets/video/landing.gif" alt="OASIS Landing Preview" width="100%" />
  </p>
</div>

---

## 📋 <a name="table">Table of Contents</a>

1. 📖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🌌 [The Orbital Gallery](#orbital-gallery)
5. 🤸 [Quick Start](#quick-start)
6. 📁 [Project Structure](#project-structure)

---

## <a name="introduction">📖 Introduction</a>

The modern web is congested with algorithmic feeds, synthetic urgency, and endless notifications designed to capture attention rather than cultivate thought. 

**OASIS** is an antidote to digital exhaustion. Built upon the principles of human curation and architectural whitespace, OASIS removes engagement traps, vanity likes, and machine recommendations. It provides a peaceful sanctuary where readers and creators can experience handpicked essays, photography, and editorial design at their own rhythm.

---

## <a name="tech-stack">⚙️ Tech Stack</a>

- **React 19 & Vite** — Component-driven architecture, reactive state hooks, Context API, and ultra-fast HMR bundler.
- **Supabase (BaaS & PostgreSQL)** — Cloud authentication (Email/Password, Google OAuth), relational database for posts, profiles, follows, bookmarks, and storage buckets.
- **GSAP & ScrollTrigger** — Kinetic typography, split-word text animations, timeline orchestrations, and scroll-triggered reveals.
- **React Router v7** — Client-side SPA routing with protected creator routes, dynamic profile paths, and seamless page transitions.
- **Modular CSS3 & Glassmorphism** — Dedicated page stylesheets, GPU-composited keyframes, backdrop blurs, and responsive mobile nav.
- **Design & Identity** — Designed with Adobe Illustrator and Figma using Swiss minimalism and Sora + Inter typographic pairing.

---

## <a name="features">🔋 Features</a>

👉 **Human-Curated Feeds**: Zero algorithmic ranking. Only intentional, hand-selected stories and editorials curated by real human beings.

👉 **Full-Stack Authentication**: Seamless signup and login via Supabase Auth with email verification, Google OAuth, and client-side age validation.

👉 **Creator Studio & Editorial Workflow**: Rich editorial dashboard to draft, edit, publish stories, and upload cover images to Supabase Storage.

👉 **Dynamic Public Profiles & Follow System**: User profiles with bio, published works, followers/following counts, and live follow toggle state.

👉 **The Orbital Gallery**: A hypnotic, celestial gallery where curated works orbit smoothly with organic distribution and natural drifting animations.

👉 **Kinetic Typography & Split-Text Reveals**: Smooth scroll-triggered editorial headlines powered by GSAP for a cinematic reading flow.

👉 **Nested Comments & Engagement**: Community discussions, private collections/saved posts, and post interactions without toxic vanity algorithms.

👉 **Meaningful Whitespace**: Layouts designed with generous breathing room, prioritizing legibility and cognitive calm.

---

## <a name="orbital-gallery">🌌 The Orbital Gallery</a>

The centerpiece visual experience in OASIS is the **Orbital Gallery**—an interactive canvas breaking away from rigid tabular grids.

<div align="center">
  <img src="https://via.placeholder.com/1200x675/0F172A/FFFFFF?text=%5BInsert+Visual%3A+Orbital+Interaction+%26+Card+Drift+Closeup%5D" alt="Orbital Gallery Closeup" width="100%" />
</div>

<br />

- **Vogel's Spiral Scattering**: Floating cards are dynamically calculated using the Fibonacci golden angle ($137.508^\circ$), ensuring an isotropic, uniform distribution without clumping.
- **Central Exclusion Zone**: Preserves an intentional negative space at the center of the viewport for typography and call-to-actions.
- **Harmonic CSS Drift**: Multi-phase asynchronous sway animations give each card a natural, floating celestial behavior at 60 FPS.

---

## <a name="quick-start">🤸 Quick Start</a>

Follow these simple steps to run the application locally on your machine.

### Prerequisites

Ensure you have installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/vacalincy/oasis_blog.git
cd oasis_blog/oasis-react
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## <a name="project-structure">📁 Project Structure</a>

<details>
<summary><code>Click to expand project tree</code></summary>

```
oasis_blog/
├── design/                      # Brand assets (logo.ai, favicon.ai)
├── oasis-react/                 # Main React 19 Application
│   ├── src/
│   │   ├── components/          # Reusable UI (Header, PostCard, TabBar, etc.)
│   │   ├── context/             # Global state (AuthContext, ToastContext)
│   │   ├── pages/               # Application views (Landing, Dashboard, Profile, etc.)
│   │   ├── assets/css/          # Modular page stylesheets
│   │   ├── supabaseClient.js    # Supabase BaaS configuration
│   │   └── App.jsx              # Routing & protected routes configuration
│   ├── index.html               # Entry HTML with GSAP CDN links
│   └── vite.config.js           # Vite build configuration
└── README.md                    # Project showcase
```

</details>
