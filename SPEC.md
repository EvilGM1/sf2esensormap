# Starfinder 2e (SF2E) Tactical Sensor Map — System Specification

> **Document Version:** 1.0.0  
> **Target Ruleset:** Starfinder Second Edition (*Starfinder Tech Core*, Page 170–185)  
> **Reference Database:** [Archives of Nethys SF2E Tactical Starship Combat](https://2e.aonsrd.com/tactical-starship-combat/battle-stations)  
> **Repository:** [github.com/EvilGM1/sf2esensormap](https://github.com/EvilGM1/sf2esensormap)

---

## 1. Project Overview & Vision

### 1.1 Purpose
During starship combat in Starfinder 2e, the immense distances of space are abstracted onto a linear **Sensor Map** (a 1D line of squares/zones), while physical battlemaps are reserved for internal starship boarding actions and hazards. 

Because most players and GMs at physical tables use mobile phones or tablets for character sheets, this web application provides a lightweight, tactile, real-time digital Sensor Map. It eliminates the need for cumbersome physical dry-erase tracks and allows the GM to simulate electronic warfare, sensor range limits, and cloaked contacts directly on players' screens.

### 1.2 Core Design Principles
1. **Mobile-First Table Play**: Touch-optimized interface designed for phones and tablets resting on the table.
2. **Scanner Simulation (Fog of War)**: Players only see what their sensors can detect; cloaked vessels and vessels beyond the ship's sensor range are masked.
3. **Strict Adherence to SF2E Rules**: Faithfully implements *Tech Core* starship size classes, headings, off-guard rear arcs, and official battle station actions.
4. **Zero-Configuration Table Sync**: Players can scan a QR code from the GM's screen to connect their phones via real-time WebRTC data channels with zero server setup.

---

## 2. Tactical Sensor Map Rules & Mechanics

### 2.1 Sensor Map Geometry & Zones
- **Linear Track**: Space distance is represented as a contiguous sequence of discrete zones (squares). Distance between two ships equals the difference between their zone numbers.
- **Total Map Tiles (GM Input)**: The total size of the encounter space (typically 10 to 30 zones), configured and expanded by the GM.
- **Player Sensor Range (Player Input)**: The detection radius of the player starship's scanners (e.g. 3 to 6 zones).
- **Player View Zone Filtering**: In Player View, only zones within `[PlayerZone - SensorRange, PlayerZone + SensorRange]` are visible. The player's view automatically centers on their ship (`CORE 0`).
- **Relative Distance Numbering**:
  - `CORE 0`: The player starship's occupied zone.
  - `+1, +2, +3...`: Zones ahead in relative bearing.
  - `-1, -2, -3...`: Zones astern in relative bearing.

### 2.2 Starships, Tokens & Factions
- **Player Starship**:
  - **Color**: Vibrant Blue (`#38bdf8`) with cyan thruster glow.
  - **Token**: High-tech chevron vector graphic.
  - **Size**: **Medium** (Standard in RAW Starfinder 2e).
- **NPC Starships**:
  - **Tokens**: Tactical directional triangles.
  - **IFF Faction Colors**:
    - 🟢 **Ally** (Green - `#22c55e`)
    - 🔴 **Enemy** (Red - `#ef4444`)
    - 🟡 **Neutral** (Yellow - `#eab308`)
- **Starship Size Classes**:
  1. `Tiny` (TNY) — Drones, small probes (20×20 px)
  2. `Small` (SML) — Interceptors, light fighters (28×28 px)
  3. `Medium` (MED) — Standard player ships, shuttles, gunships (36×36 px / 48×34 px)
  4. `Large` (LRG) — Corvettes, armed transports (48×48 px)
  5. `Huge` (HUG) — Cruisers, heavy frigates (62×62 px)
  6. `Gargantuan` (GAR) — Battleships, destroyers (76×76 px)
  7. `Colossal` (COL) — Dreadnoughts, carriers, space stations (92×92 px)
- **Multi-Ship Clustering**: Zones dynamically arrange multiple vessels into non-overlapping clusters (2-column grids when 3+ ships occupy a single zone).

### 2.3 Headings & Off-Guard Flanking
- **Heading**: Every vessel points either **Left (◄)** or **Right (►)** along the axis of the sensor track.
- **Off-Guard Rule (Tech Core pg. 171)**: A starship is **Off-Guard** (-2 circumstance penalty to AC) against attacks originating from behind its current heading. Pilots reposition and change headings to exploit enemy rear blind spots while guarding their own.
- **Heading Control**: 1-tap flip button reverses heading instantly on any vessel.

### 2.4 Scanner Stealth & Cloaking
- GM can flag any ship as `hidden: true` (Cloaked / Undetected).
- **GM Mode**: Cloaked vessels appear translucent with a purple stealth badge so the GM can track movements.
- **Player Mode**: Cloaked vessels vanish completely from the sensor map until revealed by active scanner actions (e.g., *Seek Starships*).

---

## 3. Official Starfinder 2e Battle Stations

In Starfinder 2e *Tech Core*, characters do not just occupy static roles; they physically helm **Battle Stations** mapped to consoles on the starship deck. Players can change stations on their turn.

### 3.1 Pilot's Console
*Movement, evasion, and spatial positioning.*
- **Boost Thrusters** `[1-action]` *(Move, Station)*: Frequency once per turn. Move forward in direction of heading up to ship Speed in zones.
- **Change Heading** `[1-action]` *(Move, Station)*: Flip heading between Left ◄ and Right ►; clears the *Off-Kilter* condition.
- **Evade** `[1-action or 2-actions]` *(Concentrate, Station)*: Grants +1 circumstance bonus to AC for 1 round (+2 if 2 actions spent).
- **Stick to Cover** `[1-action]` *(Move, Station)*: When sharing a zone with a ship/object 1+ sizes larger, gain standard cover against other zones.
- **Fly the Ship** *(Exploration / Initiative Activity)*: Free-action *Evade* when rolling initiative (+2 AC until round 1).

### 3.2 Gunnery
*Installed starship weapon mounts and firing.*
- **Strike with Starship Weapon** `[1-action]` *(Attack, Station)*: Attack target in weapon range using player's attack modifier and weapon traits.
- **Area Fire** `[2-actions]` *(Area, Attack, Station)*: Fire weapon with Area trait across the zone, hitting non-immune vessels.
- **Auto-Fire Salvo** `[2-actions]` *(Attack, Station)*: Continuous suppressing fire against targets in the designated zone.

### 3.3 Generator
*Reactor management, shield generation, and energy routing.*
- **Boost Battle Station** `[1-action]` *(Manipulate, Station)*: Grant another battle station +1 status bonus to checks & damage for 1 round.
- **Generate Shields** `[1-action]` *(Manipulate, Station)*: Restore 1d4 Shield Points (+1d4 per 2 levels starting at level 3).
- **Reposition Shield** `[Reaction]` *(Manipulate, Station)*: Triggered on incoming strike. Absorb/mitigate damage with shields.
- **Vent Power** `[2-actions]` *(Evocation, Fire, Station)*: Frequency once per round. Deal 1d10 fire damage to an enemy in your zone (0 zones away; Reflex save).

### 3.4 Scanners
*Target acquisition, sensor sweeps, and electronic warfare.*
- **Seek Starships** `[1-action]` *(Concentrate, Manipulate, Station)*: GM rolls secret Computers/Perception check against cloaked vessels within sensor range to reveal them.
- **Target Lock** `[1-action]` *(Concentrate, Manipulate, Station)*: Lock on target within sensor range; target makes Will save or grants gunners attack bonuses.
- **Hack Comms** `[1-action]` *(Concentrate, Manipulate, Station)*: Open audio/visual comms channel to tech vessel in sensor range for 1 minute (enables verbal actions like Demoralize).
- **Scan Surroundings** *(Exploration / Initiative Activity)*: Monitor space before combat; free *Seek Starships* when rolling initiative.

### 3.5 Drone Console
*Remote command of auxiliary automated starship drones.*
- **Harry Sensors** `[1-action]` *(Manipulate, Station)*: Launch flares at target in your zone; Will save or becomes *Off-Kilter* (*Off-Guard* on critical failure).
- **Intercept Munitions** `[Reaction]` *(Manipulate, Station)*: Drone intercepts incoming projectile, imposing -2 circumstance penalty to attacker.

### 3.6 Magic Conduit
*Amplification of magical spellcasting across starship space.*
- **Cast Starship Spell** *(Magical, Station)*: Expend personal spell slot to cast amplified space magic from repository.
- **Counter Magic** `[2-actions]` *(Concentrate, Manipulate, Station)*: Counteract check against magical spells or space hazards in sensor range.
- **Scan for Magic** `[1-action]` *(Concentrate, Detect, Station)*: Detect magical signatures or active spells within sensor range.

---

## 4. System Architecture & Tech Stack

```
                     ┌───────────────────────────────────┐
                     │          Vite + React 18          │
                     │          TypeScript PWA           │
                     └─────────────────┬─────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
┌───────────────┐              ┌───────────────┐              ┌───────────────┐
│ SensorContext │              │  PeerJS Sync  │              │ Web Audio API │
│ State, Range, │              │ WebRTC Direct │              │ Sci-Fi Scanner│
│ Ships, PIN    │              │  Table Sync   │              │     SFX       │
└───────┬───────┘              └───────┬───────┘              └───────────────┘
        │                              │
        ▼                              ▼
┌───────────────┐              ┌───────────────┐
│ localStorage  │              │ QR Code Modal │
│ Client Cache  │              │ Instant Join  │
└───────────────┘              └───────────────┘
```

### 4.1 Frontend Technologies
- **React 18 & TypeScript**: Component-based UI with strict typing for starships, sizes, and actions.
- **Vite 6**: Ultra-fast build tool configured with `base: './'` for seamless static deployment.
- **Tailwind CSS 3**: Custom space station palette (dark obsidian `void-950`, CRT cyan accents, phosphor warnings).
- **Lucide Icons**: Crisp vector icons for tactical controls.
- **PeerJS**: Serverless peer-to-peer WebRTC data channels for instant table state synchronization.
- **QRCode**: In-browser QR code rendering for one-scan player joining.
- **Web Audio API**: Client-side synthesized tactile scanner beeps and radar chirps (toggleable, zero audio asset overhead).

### 4.2 Hosting & Deployment
- **GitHub Pages**: Automated deployment via GitHub Actions (`.github/workflows/deploy.yml`) on push to `main`.
- **Local Wi-Fi Host**: `npm run dev -- --host` broadcasts to local table network (e.g. `http://192.168.x.x:5173`).

---

## 5. Security & Roles (GM Mode vs Player View)

### 5.1 GM Security PIN Lock
- **Threat Model**: Curious players scanning the QR code or clicking "GM Mode" on their phones could accidentally reveal cloaked ships or alter map tiles.
- **Protection**:
  - Switching to **GM Mode** requires entering a 4-digit security PIN (Default: `1234`, editable by GM).
  - A dedicated **Lock Console (🔒)** button allows the GM to instantly lock their screen back to Player View before passing a tablet or stepping away.
- **Auto-Locked Player QR Codes**:
  - Scanning the table QR code automatically appends `?view=player`, forcing the connected phone into Player View with the PIN lock engaged.

### 5.2 Real-Time Table Sync Architecture
- **Room Code**: The GM host generates an encounter Room Code (e.g., `SF2E-8K2A`).
- **QR Code Payload**: `https://evilgm1.github.io/sf2esensormap/?room=SF2E-8K2A&view=player`.
- **Synchronization Flow**:
  1. GM updates ship positions, headings, or cloaking states.
  2. GM host broadcasts updated encounter state over WebRTC data channels.
  3. Connected player devices update their screens in real-time.
  4. Header displays active synced player count (e.g., `3 Synced`).

---

## 6. UI & Ergonomics

1. **Space Station Scanner Console**:
   - Dark CRT obsidian theme with subtle scanline overlay.
   - Radar sweep bezel with live sensor telemetry readout (`1420.4 MHz`, `Room: XXXX`).
2. **Auto-Centering Track**:
   - In Player View, the sensor track automatically centers on the player starship.
   - Includes a one-tap **Center on Ship (⌖)** button.
3. **Interactive Ship Drawer**:
   - Tapping any ship on the track or roster opens a bottom action card with large thumb-friendly buttons:
     - Flip Heading (◄ / ►)
     - Move Left / Move Right
     - Size selector (Tiny to Colossal)
     - Cloak / Reveal (GM only)
     - Off-Guard rear flank warnings
4. **Current Station Checklist**:
   - Players tap the exact battle station they are manning to immediately see their actionable choices.

---

## 7. Future Roadmap

- [ ] **Automated Station Dice Rollers**: In-app skill checks for *Seek Starships*, *Evade*, and *Target Lock* based on character proficiency.
- [ ] **Quadrant Shield Tracking**: Simple 4-quadrant (Forward, Aft, Port, Starboard) shield and Hull Point tracker.
- [ ] **Custom Starship Presets**: Ability to save and load recurring party ships and enemy fleets.
- [ ] **Offline PWA Manifest**: Full offline support so the app can be installed directly to home screens without an internet connection.
