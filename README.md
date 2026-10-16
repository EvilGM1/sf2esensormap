# Starfinder 2e (SF2E) Sensor Map

![Release](https://img.shields.io/badge/Release-v1.0--UAT-10b981?style=for-the-badge&logo=rocket)
![Ruleset](https://img.shields.io/badge/Ruleset-Starfinder_2e_Tech_Core-38bdf8?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-User_Acceptance_Testing-amber?style=for-the-badge)

An interactive, mobile-optimized tactical **Sensor Map** for **Starfinder 2e *Tech Core*** starship combat. Built specifically for tabletop gaming where players and Game Masters manage ship positions, relative headings, scanner ranges, and sensor detection (fog of war) directly from their phones, tablets, or laptops.

> 📋 **UAT Testing Guide**: Check out the official [UAT Checklist](./UAT_CHECKLIST.md) for step-by-step test scenarios and feedback templates.
> 
> 📖 **Full Specification**: Read the complete mechanical design in [SPEC.md](./SPEC.md).

---

## 🚀 Key Features (v1.0 UAT)

### 1. Dynamic Sensor Map & Scanner Fog of War
- **Linear Track of Zones**: Represent abstract space distances as discrete zones (not feet or grid squares).
- **Player View Privacy**: In player mode, absolute zone numbers are hidden; players only see distance relative to their own vessel (`CORE 0`, `+1, +2...` Ahead, `-1, -2...` Aft).
- **Variable Sensor Range**: GM can dynamically adjust sensor range (0 to 15 zones). Range 0 simulates complete sensor blindness / EMP. One-tap button resets range to frame default.
- **Scanner Stealth / Cloaking**: GM can cloak any contact (`hidden: true`). Cloaked vessels appear with purple stealth badges in GM mode and disappear completely from Player View.

### 2. Role-Based Permissions & GM Security
- **GM PIN Authentication**: Protect GM controls with a secure PIN (default `0000`) so players sharing a screen or phone cannot accidentally access GM functions.
- **Dedicated Player Boundaries**: Players have flight controls (*Boost Thrusters*, *Change Heading*) exclusively for their own starship. Tapping NPC vessels opens a read-only tactical contact analysis card.
- **Dynamic Faction Switching**: GM can reassign any vessel on the fly between 🔵 **Player**, 🟢 **Ally**, 🔴 **Enemy**, and 🟡 **Neutral**.

### 3. Starship Movement & Tactical Headings
- **Strict Forward Thrust**: Vessels move along their current heading up to their Speed; ships cannot fly backwards.
- **Heading Flips & Blind Spots**: Flips heading 180° (◄ Left / ► Right) and clears *Off-Kilter*.
- **Off-Guard Vulnerability**: Automatically detects and warns when a target is flanked from behind its heading (-2 circumstance penalty to AC).
- **Multi-Ship Zone Clustering**: Multiple ships occupying the exact same zone automatically arrange in a clean, non-overlapping grid.

### 4. Cockpit Console & Starship Character Sheet
- **Full Cockpit Console**: Comprehensive starship sheet displaying Tier (1–20), Frame, HP, Shields, Speed, Armor/AC, Crest progression, and Power Core DCs.
- **Workstation Configuration**: Assign players and NPCs to active workstations (Pilot, Gunner, Engineer, Science Officer, Captain, and Magic Conduit).
- **Official Battle Stations Modal**: Search and filter tier-gated starship actions across all stations (*Commercial*, *Tactical*, *Advanced*, *Superior*, *Elite*, *Ultimate*, *Paragon*).

### 5. Magic Conduit Starship Spell Repository
- **Official SF2E Starship Spells**: Integrated spellbook for magic conduit spellcasters:
  - 💥 ***Cosmic Cannon*** (Direct hull-piercing ray)
  - 🌌 ***Cosmic Bombardment*** (Heavy area-of-effect volley)
  - 🛡️ ***Cosmic Fortification*** (Defensive shield barrier reinforcement)
  - 🔧 ***Cosmic Repairs*** (Magical system damage restoration)
- Automatic spell slot tracking, rank scaling, and DC calculations based on Conduit stats.

### 6. Hangar Profiles & Encounters
- **Official Starship Frames**: Instant 1-tap loading of iconic frames (*Ringworks Wanderer*, *Kevolari Venture*, *Sanctuary Arc*, *Drake*, *Vanguard Voidcruiser*, *Pegasus*).
- **Profile Persistence**: Custom starships and edits save to browser `localStorage`.
- **Sample Encounters & Reset**: Launch a ready-to-play skirmish or reset the encounter at any time.

### 7. Table Connect & Ambient Audio
- **Zero-Config P2P Live Sync**: Open the QR Code modal on the GM device for players to scan and connect directly via WebRTC data channels.
- **Station Scanner SFX**: Toggle atmospheric scanner audio telemetry and maneuver sound effects.

---

## 🛠️ Getting Started

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

3. Start local development server (accessible to phones on local Wi-Fi):
   ```bash
   npm run dev -- --host
   ```

4. Open the displayed URL (or local network IP) on your phone, tablet, or browser.

### Production Build & Deployment

1. Build production bundle:
   ```bash
   npm run build
   ```

2. The repository includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`). Pushing commits to `main` builds and deploys directly to **GitHub Pages**!

---

## 🧩 Tech Stack

- **React 18** + **TypeScript**
- **Vite 6**
- **Tailwind CSS** (Sci-Fi Cyber Void & Radar Green Themes)
- **PeerJS / WebRTC** (Serverless live table synchronization)
- **Lucide React** (Tactical sci-fi icons)
- **QRCode** (Zero-friction mobile pairing)

---

## 📄 License

MIT License. Starfinder 2e rules and terminology are property of Paizo Inc. and referenced under the Open Game License / ORC License.
