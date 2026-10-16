# Starfinder 2e (SF2E) Sensor Map

An interactive, mobile-optimized tactical **Sensor Map** for **Starfinder 2e *Tech Core*** starship combat. Built specifically for gaming tables where players and Game Masters manage ship positions, relative headings, scanner ranges, and sensor detection (fog of war) from their phones.

---

## Features

- **Dynamic Sensor Map Track**: Enter the starship's Max Sensor Range (e.g. 5, 8, 10, 12, 15 zones) to automatically generate the linear track of squares.
- **Player Starship (Blue)**: Chevron token with direction of travel and 1-tap heading flip (Facing Left ◄ / Right ►).
- **NPC Starships (Color-Coded Factions)**:
  - 🟢 **Ally** (Green)
  - 🔴 **Enemy** (Red)
  - 🟡 **Neutral** (Yellow)
- **Scanner Stealth Simulation (Fog of War)**:
  - The GM can cloak any ship (`hidden: true`) with a single tap.
  - **GM Mode**: Full administrative control, showing cloaked ships with purple stealth badges so the GM can track their movements.
  - **Player View Mode**: Cloaked/hidden vessels disappear entirely from the sensor grid until detected by scanners.
- **Heading & Off-Guard Tracking**:
  - In Starfinder 2e, attacks originating behind a starship's heading make that target **Off-Guard** (-2 AC).
  - The app clearly indicates bow vs rear blind spots for every vessel.
- **Multi-Ship Clustered Display**:
  - Multiple vessels occupying the same zone automatically arrange in a neat grid.
- **Table Connect & Mobile First**:
  - Built-in QR Code modal for table players to instantly scan and open on their phones.
  - Persists combat state in `localStorage` so refreshing or switching tabs never loses data.

---

## Getting Started

### Local Development

1. Clone repository:
   ```bash
   git clone https://github.com/EvilGM1/sf2esensormap.git
   cd sf2esensormap
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start dev server (accessible across local Wi-Fi for phones):
   ```bash
   npm run dev -- --host
   ```

4. Open the displayed URL (or local network IP) on your phone or tablet.

### Build & Deployment to GitHub Pages

1. Build production bundle:
   ```bash
   npm run build
   ```
2. The repository includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`). Pushing to `main` will automatically build and deploy to **GitHub Pages**!

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite**
- **Tailwind CSS** (Sci-Fi Dark Theme)
- **Lucide Icons**
- **QRCode** (for table phone sharing)

---

## License

MIT
