# Starfinder 2e (SF2E) Tactical Sensor Map — System Specification

> **Document Version:** 1.1.0  
> **Target Ruleset:** Starfinder Second Edition (*Starfinder Tech Core*, Page 170–185)  
> **Reference Database:** [Archives of Nethys SF2E Tactical Starship Combat](https://2e.aonsrd.com/tactical-starship-combat/battle-stations)  
> **Starship Frames Reference:** [Archives of Nethys SF2E Frames](https://2e.aonsrd.com/tactical-starship-combat/frames)  
> **Repository:** [github.com/EvilGM1/sf2esensormap](https://github.com/EvilGM1/sf2esensormap)

---

## 1. Project Overview & Vision

### 1.1 Purpose
During starship combat in Starfinder 2e, the vast distances of space are abstracted onto a linear **Sensor Map** (a 1D line of zones), while physical battlemaps are reserved for internal starship boarding actions and deck hazards. 

Because most players and GMs at physical tables use mobile phones or tablets, this web application provides a lightweight, tactile, real-time digital Sensor Map. It eliminates the need for dry-erase tracks and allows the GM to simulate electronic warfare, sensor range limits, and cloaked contacts directly on players' screens.

### 1.2 Core Design Principles
1. **Mobile-First Table Play**: Touch-optimized interface designed for phones and tablets resting on the table.
2. **Scanner Simulation (Fog of War)**: Players only see what their sensors can detect; cloaked vessels and vessels beyond the ship's sensor range are masked. Absolute zone indices are hidden from players to keep total encounter size secret.
3. **Strict Adherence to SF2E Rules**: Faithfully implements *Tech Core* starship movement constraints (forward-only thrust), size classes, headings, off-guard rear arcs, and official battle station tier-gated actions.
4. **Zero-Configuration Table Sync**: Players scan a QR code from the GM's screen to connect their phones via real-time WebRTC data channels with zero server setup.

---

## 2. Tactical Sensor Map Rules & Mechanics

### 2.1 Sensor Map Geometry & Zones
- **Linear Track**: Space distance is represented as a contiguous sequence of discrete **Zones** (not traditional squares or feet). Distance between two ships equals the difference between their zone numbers.
- **Total Map Zones (GM Input)**: The total size of the encounter space (typically 10 to 30 zones), configured and expanded by the GM.
- **Player Sensor Range (GM Input, 0 to 15)**: The detection radius of the player starship's scanners. Can be reduced down to **0 zones** (simulating sensor blindness, critical glitch, or EMP). When 0, the player can only detect their own zone (`CORE 0`).
- **Player View Zone Filtering & Privacy**: 
  - In Player View, only zones within `[PlayerZone - SensorRange, PlayerZone + SensorRange]` are displayed.
  - The absolute zone index (`Zone X` or `Sq X`) is **completely hidden** from player view to keep encounter scope secret.
  - Players only see relative distance from their ship: `CORE 0`, `+1, +2...` (forward/ahead), and `-1, -2...` (aft/behind).
  - The player's view automatically centers on their ship (`CORE 0`).

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
  1. `Tiny` — Drones, small probes (20×20 px)
  2. `Small` — Interceptors, light fighters (28×28 px)
  3. `Medium` — Standard player ships, shuttles, gunships (36×36 px / 48×34 px)
  4. `Large` — Corvettes, armed transports (48×48 px)
  5. `Huge` — Cruisers, heavy frigates (62×62 px)
  6. `Gargantuan` — Battleships, destroyers (76×76 px)
  7. `Colossal` — Dreadnoughts, carriers, space stations (92×92 px)
  *(Size tags like `[MED]` or `[LRG]` are omitted from token labels; token dimensions communicate size).*
- **Multi-Ship Clustering**: Zones dynamically arrange multiple vessels into non-overlapping clusters (2-column grids when 3+ ships occupy a single zone).

### 2.3 Headings & Forward-Only Movement
- **Heading**: Every vessel points either **Left (◄)** or **Right (►)** along the axis of the sensor track.
- **Off-Guard Rule (Tech Core pg. 171)**: A starship is **Off-Guard** (-2 circumstance penalty to AC) against attacks originating from behind its current heading. Pilots reposition and change headings to exploit enemy rear blind spots.
- **Boost Thrusters (Forward Movement)**: Starships cannot fly backwards! A ship moves forward in the direction of its current heading up to its Speed.
- **Change Heading (Turn)**: Flips heading between Left ◄ and Right ► (clears *Off-Kilter*).

### 2.4 Scanner Stealth & Cloaking
- GM can flag any ship as `hidden: true` (Cloaked / Undetected).
- **GM Mode**: Cloaked vessels appear translucent with a purple stealth badge so the GM can track movements.
- **Player Mode**: Cloaked vessels vanish completely from the sensor map until revealed by active scanner actions (e.g., *Seek Starships*).
- **Telemetry Banner**: Clean status display in player view without referencing "masked/cloaked ships" to prevent metagaming.

---

## 3. Official Starfinder 2e Battle Stations & Tier Progression

Battle stations scale across grades (**Commercial Level 1**, **Tactical Level 2**, **Advanced Level 5**, **Superior Level 8/10**, **Elite Level 11/12**, **Ultimate Level 14/16**, **Paragon Level 18/19**).

### 3.1 Pilot's Console
- **Boost Thrusters** `[1-action]` *(Move, Station)* [Commercial — Lvl 1]: Move forward along current heading up to Speed in zones.
- **Change Heading** `[1-action]` *(Move, Station)* [Commercial — Lvl 1]: Reverse heading (Left ◄ / Right ►); clears Off-Kilter.
- **Evade** `[1 or 2 actions]` *(Concentrate, Station)* [Commercial — Lvl 1]: +1 circumstance bonus to AC for 1 round (+2 if 2 actions).
- **Stick to Cover** `[1-action]` *(Move, Station)* [Commercial — Lvl 1]: Gain standard cover when sharing zone with a ship 1+ size larger.
- **Fly the Ship** *(Exploration / Initiative Activity)*: Free Evade before round 1 (+2 AC).

### 3.2 Gunnery
- **Strike with Starship Weapon** `[1-action]` *(Attack, Station)* [Commercial — Lvl 1]: Attack target in weapon range and arc.
- **Area Fire** `[2-actions]` *(Area, Attack, Station)* [Commercial — Lvl 1]: Discharges weapon with Area trait across target zone.
- **Auto-Fire Salvo** `[2-actions]` *(Attack, Station)* [Commercial — Lvl 1]: Continuous fire against targets occupying target zone.

### 3.3 Generator
- **Boost Battle Station** `[1-action]` *(Manipulate, Station)* [Commercial — Lvl 1]: Grant a station +1 status bonus to checks & damage for 1 round.
- **Generate Shields** `[1-action]` *(Manipulate, Station)* [Commercial — Lvl 1]: Restore 1d4 Shield Points (+1d4 per 2 levels starting at level 3).
- **Reposition Shield** `[Reaction]` *(Manipulate, Station)* [Tactical — Lvl 2]: Triggered on incoming strike. Absorb/mitigate damage with shields.
- **Vent Power** `[2-actions]` *(Evocation, Fire, Station)* [Advanced — Lvl 5]: Deal 1d10 fire damage to an enemy in zone 0 (basic Reflex save).

### 3.4 Scanners
- **Seek Starships** `[1-action]` *(Concentrate, Manipulate, Station)* [Commercial — Lvl 1]: Secret check to detect cloaked vessels within sensor range.
- **Scan Target** `[1-action]` *(Concentrate, Manipulate, Station)* [Commercial — Lvl 1]: Scan target to learn model name, sensor range, and battle stations.
- **Target Lock** `[1-action]` *(Concentrate, Manipulate, Station)* [Commercial — Lvl 1]: Target makes Will save or becomes off-guard to your strikes.
- **Hack Comms** `[1-action]` *(Concentrate, Manipulate, Station)* [Commercial — Lvl 1]: Open comms channel to tech vessel in sensor range for 1 minute.
- **Hack Battle Station** `[1-action]` *(Concentrate, Manipulate, Station)* [Tactical — Lvl 2]: Target enemy station to induce a malfunction glitch.
- **Hack Munition** `[Reaction]` *(Concentrate, Manipulate, Station)* [Advanced — Lvl 5]: Scramble incoming weapon systems to impose penalties.

### 3.5 Drone Console
- **Deploy Drone** `[1-action]` *(Manipulate, Station)* [All Levels]: Deploy a docked drone into close orbit.
- **Retrieve Drone** `[1-action]` *(Manipulate, Station)* [All Levels]: Recall a deployed drone back into the starship.
- **Drone Block** `[Reaction]` *(Manipulate, Station)* [All Levels]: Intercept incoming strike; grant resistance equal to half level (drone disabled for 10 min).

### 3.6 Magic Conduit
- **Cast Starship Spell** *(Magical, Station)* [Commercial — Lvl 1]: Expend spell slot to cast amplified space magic.
- **Scan for Magic** `[1-action]` *(Concentrate, Detect, Station)* [Commercial — Lvl 1]: Detect magical signatures or active spells within sensor range.
- **Counter Magic** `[2-actions]` *(Concentrate, Manipulate, Station)* [Tactical — Lvl 2]: Counteract check against magical spells or space hazards in range.

---

## 4. Planned Future Features & Roadmap

### 4.1 Starship Character Sheet & Frame Console Integration
To transform the app into an all-in-one Starship Companion, the next major release will integrate an authentic **Starship Console Character Sheet**:
- **Frame Selection**:
  1. **Bulwark**: Heavy defense, reinforced hull, ramming prow, high HP, lower Speed.
  2. **Explorer**: Balanced, superior sensor range, strong shield generation, versatile bays.
  3. **Skirmisher**: Fast, high mobility, superior Speed, lighter hull.
- **Automated Stat Calculation**:
  - Automatically calculates Speed, Armor Class (AC), Reflex DC, Hull Points (HP), and Shield Points (SP) based on chosen **Frame** and **Ship Level (1–20)**.
- **Interactive Battle Station Console Layout**:
  - Displays the 6 battle station slots (2 default frame stations + 4 customizable slots).
  - Shows equipped station upgrades and expansion bays.
  - Interactive HP and SP damage/repair trackers.
- **Party Battle Station Manning**:
  - Players assign their character token to a specific battle station on the ship sheet, automatically unlocking their station actions on their personal phone console.

### 4.2 Automated Station Skill Rollers
- Integrated dice roller for *Seek Starships*, *Evade*, *Generate Shields*, and *Target Lock* pulling from the crew member's skill proficiencies.

### 4.3 Offline PWA Support
- Service worker caching so the entire app and character sheet operate offline without internet at physical conventions or cabins.
