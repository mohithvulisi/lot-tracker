# LOT — Never Lose What Matters

A highly immersive, scroll-driven product landing page for **LOT**, a revolutionary mechanical unfolding smart location tracker. Built as a premium product showcase with cinematic scroll animations, interactive simulations, and a refined minimalist design system.

---


---

## 🖼️ UI/UX Design System

### Design Philosophy

The entire page is built around a **clean, premium, Apple-inspired minimal aesthetic**. Every interaction is designed to feel intentional and polished — from the custom cursor to the scroll-driven product reveal.

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#ffffff` | Page background |
| `--bg-secondary` | `#f6f6f6` | Alternating section backgrounds |
| `--text-primary` | `#111111` | Headings, body text |
| `--text-secondary` | `#666666` | Descriptions, meta |
| `--text-tertiary` | `#999999` | Captions, disabled states |
| `--accent` | `#0066ff` | Primary blue accent (CTAs, highlights, map pins) |
| `--accent-light` | `rgba(0,102,255,0.08)` | Subtle blue tints |
| `--border-color` | `rgba(17,17,17,0.08)` | Dividers, card borders |

### Typography

- **Display font:** `Outfit` (weights 300–800) — Headings, logo, section titles
- **Body font:** `Inter` (weights 300–700) — Paragraphs, navigation, UI labels
- Anti-aliased rendering with `-webkit-font-smoothing: antialiased`

### Shadows & Depth System

Three progressive elevation levels create a subtle depth hierarchy:

| Token | Effect |
|---|---|
| `--shadow-soft` | `0 4px 30px rgba(0,0,0,0.02)` — Cards at rest |
| `--shadow-medium` | `0 8px 30px rgba(0,0,0,0.04)` — Cards on hover |
| `--shadow-glass` | `0 10px 40px rgba(0,0,0,0.03)` — Floating panels |

### Animation Timing

All transitions use a custom **Apple-style easing curve**:

```css
--ease-apple: cubic-bezier(0.25, 1, 0.5, 1);
--transition-smooth: all 0.5s var(--ease-apple);
--transition-fast: all 0.2s ease-out;
```

---

## ✨ UI/UX Features

### 1. Custom Cursor

A minimal **8×8px dot cursor** replaces the default system cursor on all hover-capable devices. On interactive elements (buttons, links, hotspots), it **expands to 44×44px** with a translucent fill + border ring, providing satisfying tactile feedback.

### 2. Preloader Screen

A branded loading screen displays while all 121 product frames are preloaded:
- Animated progress bar with real-time percentage counter
- Fade-out transition with `0.8s` ease
- Prevents layout shift from unloaded canvas images

### 3. Frosted Glass Navbar

- **Backdrop blur** with `backdrop-filter: blur(20px)` creates a frosted glass effect
- **Scroll-aware behavior**: shrinks padding and gains a subtle bottom border on scroll
- Translucent white background at `rgba(255,255,255,0.8)` / `0.9` when scrolled
- Contains 7 navigation links + a "Pre-Order" CTA button

### 4. Scroll Progress Indicator

A thin, full-width bar at the top of the viewport fills from `0%` to `100%` as the user scrolls, providing immediate spatial awareness of position.

### 5. Cinematic Scroll-Driven Frame Animation

The hero section is the centerpiece experience:
- **121 JPG frames** (`ezgif-frame-001.jpg` → `ezgif-frame-121.jpg`) are rendered on an HTML5 `<canvas>`
- GSAP **ScrollTrigger** pins the canvas and maps `scrollY` progress to frame index
- As you scroll, the product **mechanically unfolds** frame-by-frame in cinematic fashion
- At frame 121 (fully unfolded), **12 interactive hotspot labels** fade in over the product anatomy
- A **side info panel** reveals with the product tagline and CTA

### 6. Hotspot Interaction System

After the product fully unfolds, **12 labeled hotspots** appear positioned over the product anatomy:
- Pulsing dot indicators with hover-reveal labels
- Clicking a hotspot opens a **detail card** with Purpose, Technology, and Benefit fields
- Cards are dismissible with a close button
- Hotspot data: Outer Shell, Protective Housing, Main PCB, Battery, NFC Module, Tracking Module, Tamper Sensor, Expandable Frame, Controller Chip, Power Core, Mounting Rig, LED Ring

### 7. The Challenge — Animated Sentence Reveal

Problem statements animate in **sentence-by-sentence** as the user scrolls, each line fading/sliding into view. The final highlighted line uses the accent color to mark the solution pivot.

### 8. How It Works — Vertical Timeline

A 5-step process displayed as a **vertical timeline**:
- Animated progress line fills as the user scrolls through the section
- Each step (01–05) slides in sequentially: Attach → NFC Tap → Track → Alerts → Recover
- The `--timeline-progress-fill` element width is dynamically tied to scroll position

### 9. Features Grid

A responsive **12-card grid** showcasing product capabilities:
- Each card has an emoji icon, bold title, and descriptive paragraph
- Cards include: Real-Time Tracking, NFC Pairing, Tamper Detection, Unauthorized Alerts, Expandable Design, Long Battery, Energy Efficient, Cloud Ready, Secure Pairing, Minimal Maintenance, Affordable, Reliable
- Subtle shadow elevation on hover with smooth transition

### 10. Tamper Detection Dashboard

An **interactive simulation panel** split into two columns:

**Left — Simulation Controls:**
- "Trigger Tamper Event" and "Reset Tracker State" buttons
- Animated wireframe diagram with a laser beam and status light
- Visual state changes between SECURE (green) and BREACHED (red)

**Right — Live Dashboard UI:**
- Styled to look like a real-time security portal ("LOT Secure Portal v4.11")
- Live feed indicator with pulsing dot
- Stats panel: Tracker ID, System Integrity (100% SECURE), Alert Status
- Scrollable **event log** with timestamped entries that update dynamically
- Color-coded log entries: green for success, red for alerts, orange for warnings

### 11. NFC Pairing Animation

A **simulated NFC tap experience**:
- Smartphone mockup with status bar, progress card, and pairing tick
- LOT tracker target with concentric rings and center label
- **Animated signal ripples** emanate from the tracker
- "Simulate NFC Tap" button triggers a multi-stage animation:
  1. Phone detects tracker
  2. Progress bar fills
  3. Pairing completes with checkmark

### 12. Live Tracking Map

An **interactive SVG vector map**:
- Grid pattern background with minimalist road/park vector paths
- Curved route path with dashed trail and animated fill stroke
- Moving **tracker pin** with pulsing ripple effect
- Start point marker with label
- **Telemetry sidebar** showing: Status, Distance, Battery, Signal Quality, Last Seen
- "Replay Live Route" button re-triggers the pin animation along the path

### 13. Comparison Table

A clean, full-width comparison table:
- 3 columns: LOT Tracker vs Generic Bluetooth Tracker vs Premium GPS Tag
- LOT column highlighted with blue text and bold values
- 7 feature rows covering Price, Expandable Casing, Tamper Detection, NFC, Ease of Use, Battery Life, Portability
- Responsive horizontal scroll on mobile

### 14. Pricing Section

Centered, focused pricing display:
- Large `$19.99` price point
- Tagline: "Premium protection without premium pricing"
- Badge: "No monthly fees. No hidden subscriptions"
- Primary CTA button

### 15. Technical Specifications

A **12-card grid** displaying hardware specs:
- Weight, Material, Dimensions, Battery, Connectivity, Range, NFC Frequency, Water Resistance, Operating Temp, Compatibility, Lifetime, Security Protocol
- Clean label/value card layout

### 16. FAQ Accordion

Expandable Q&A section with 5 questions:
- Smooth height animation on expand/collapse
- Rotating `+`/`×` icon indicator
- Covers: Mechanical design, Subscription model, Tamper detection, Battery, Privacy

### 17. Call-to-Action Section

- Floating **outline shapes** animated in the background for depth
- Bold headline: "Protect What Matters"
- Dual CTA buttons: "Pre-Order Now" (primary) + "Coming Soon" (secondary)

### 18. Footer

4-column grid layout:
- Brand column with logo + tagline
- Product links: Overview, Anatomy, Features, Purchase
- Security links: Tamper System, Mesh Tracking, Specs
- Legal links: Privacy, Terms, Regulatory
- Copyright bar at bottom

---

## 🛠️ Technical Stack

| Layer | Technology |
|---|---|
| **Structure** | Semantic HTML5 |
| **Styling** | Custom CSS (1,874 lines) with CSS custom properties |
| **Animation Engine** | GSAP 3.12.5 + ScrollTrigger |
| **Smooth Scrolling** | Lenis 1.1.13 |
| **Canvas Rendering** | Native HTML5 Canvas API |
| **Vector Graphics** | Inline SVG (maps, diagrams) |
| **Fonts** | Google Fonts (Outfit + Inter) |
| **Serving** | http-server (Node.js) |

---

## 📁 Project Structure

```
├── index.html          # Main HTML (853 lines) — 14 sections
├── style.css           # Design system + all styles (1,874 lines)
├── app.js              # GSAP animations, canvas, interactivity
├── ezgif-frame-001.jpg # Product animation frames
├── ezgif-frame-002.jpg # ...
├── ...
└── ezgif-frame-121.jpg # (121 frames total)
```

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/mohithvulisi/lot-tracker.git
cd lot-tracker

# Start the dev server
npx http-server -p 3000 -c-1

# Open in browser
open http://localhost:3000
```

---

## 📐 Design Principles

1. **Minimalism** — White space is a feature, not wasted space. Every element earns its presence.
2. **Progressive Disclosure** — Information reveals through scroll interaction, not all at once.
3. **Tactile Feedback** — Custom cursor, hover states, and button interactions feel physical.
4. **Cinematic Storytelling** — The scroll-driven frame animation turns a product page into an experience.
5. **Consistent Elevation** — Three-tier shadow system maintains visual hierarchy.
6. **Performance-Conscious** — All animation frames are preloaded before any interaction is possible.

---

## 📄 License

© 2026 LOT Inc. Designed to Wow.