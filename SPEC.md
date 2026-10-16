# Starfinder 2e (SF2E) Tactical Sensor Map — System Specification

> **Document Version:** 1.2.0  
> **Target Ruleset:** Starfinder Second Edition (*Starfinder Tech Core*, Page 170–185)  
> **Reference Database:** [Archives of Nethys SF2E Tactical Starship Combat](https://2e.aonsrd.com/tactical-starship-combat/battle-stations)  
> **Starship Frames Reference:** [Archives of Nethys SF2E Frames](https://2e.aonsrd.com/tactical-starship-combat/frames)  
> **Starship Builder Reference:** [Archives of Nethys SF2E Starship Builder](https://2e.aonsrd.com/tactical-starship-combat/builder)  
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
4. **Role-Based Permissions**: Players exclusively pilot their own starship; enemy, allied, and neutral ships offer read-only sensor telemetry to prevent accidental or unauthorized repositioning.
5. **Zero-Configuration Table Sync**: Players scan a QR code from the GM's screen to connect their phones via real-time WebRTC data channels with zero server setup.

---

## 2. Tactical Sensor Map Rules & Mechanics

### 2.1 Sensor Map Geometry & Zones
- **Linear Track**: Space distance is represented as a contiguous sequence of discrete **Zones** (not traditional squares or feet). Distance between two ships equals the difference between their zone numbers.
- **Total Map Zones (GM Input)**: The total size of the encounter space (typically 10 to 40 zones), configured and dynamically expanded by the GM.
- **Player Sensor Range (GM Controlled, 0 to 15)**: The detection radius of the player starship's scanners. Can be reduced down to **0 zones** (simulating sensor blindness, critical glitch, or EMP). When 0, the player can only detect their own zone (`CORE 0`).
- **Baseline Sensor Range & Reset to Default**:
  - The player starship's frame and scanner suite establish a **Default Sensor Range** (e.g. 4 zones).
  - The GM can adjust the active sensor range at any moment to reflect electronic warfare, nebula interference, or glitch conditions.
  - A dedicated **Reset to Default** button allows the GM to immediately restore scanners back to the player ship's baseline range.
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
  - **Tokens**: Tactical directional triangles with scaled pixel dimensions.
  - **Dynamic Faction & Color Reassignment (GM Control)**:
    - The GM can change any vessel's faction on the fly via the Ship Drawer:
      - 🟢 **Ally** (Green - `#22c55e`)
      - 🔴 **Enemy** (Red - `#ef4444`)
      - 🟡 **Neutral** (Yellow - `#eab308`)
      - 🔵 **Player** (Sky Blue - `#38bdf8`)
    - Color coding and token graphics update immediately across all connected player devices.
- **Starship Size Classes**:
  1. `Tiny` — Drones, small probes (20×20 px)
  2. `Small` — Interceptors, light fighters (28×28 px)
  3. `Medium` — Standard player ships, shuttles, gunships (36×36 px / 48×34 px)
  4. `Large` — Corvettes, armed transports (48×48 px)
  5. `Huge` — Cruisers, heavy frigates (62×62 px)
  6. `Gargantuan` — Battleships, destroyers (76×76 px)
  7. `Colossal` — Dreadnoughts, carriers, space stations (92×92 px)
- **Multi-Ship Clustering**: Zones dynamically arrange multiple vessels into non-overlapping clusters (2-column grids when 3+ ships occupy a single zone).

### 2.3 Headings & Forward-Only Movement
- **Heading**: Every vessel points either **Left (◄)** or **Right (►)** along the axis of the sensor track.
- **Off-Guard Rule (Tech Core pg. 171)**: A starship is **Off-Guard** (-2 circumstance penalty to AC) against attacks originating from behind its current heading. Pilots reposition and change headings to exploit enemy rear blind spots.
- **Boost Thrusters (Forward Movement)**: Starships cannot fly backwards! A ship moves forward in the direction of its current heading up to its Speed.
- **Change Heading (Turn)**: Flips heading between Left ◄ and Right ► (clears *Off-Kilter*).

### 2.4 Control Permissions & View Separation
- **Player View Restrictions**:
  - **Player Starship**: Players have full flight controls for their vessel (*Change Heading*, *Boost Thrusters*).
  - **Non-Player Contacts**: Tapping an enemy, allied, or neutral ship displays a **Read-Only Tactical Contact Analysis** card (relative range, facing direction, and tactical rear flank vulnerability). Maneuver controls, heading flips, and jump-to-zone selectors are disabled for non-player ships.
  - **Console Layout**: The GM Target Roster is replaced in Player View by a dedicated **Player Starship Console** showing ship heading, active sensor status, contact count, tactical off-guard warning, and quick battle station access.
- **GM Mode**:
  - The GM maintains full encounter control: arbitrary repositioning, jump to zone, heading flip, cloak toggle, size adjustment, faction reassignment, and target roster management.

### 2.5 Scanner Stealth & Cloaking
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

## 4. Starship Character Sheet & Tactical Cockpit Console (Implemented)

The app integrates an official **Starship Character Sheet & Cockpit Bridge Console** compliant with the *Starfinder Tech Core* and Archives of Nethys rulesets.

### 4.1 Official Frame Profiles & Level 1–20 Scaling
- **Official Frames (Medium)**:
  - **Bulwark**: Heavy hull armor, standard Generator, Pilot's Console with built-in *Ramming Prow*. Baseline Sensor Range: 5 Zones.
  - **Explorer**: Balanced explorer, Pilot's Console, Generator with built-in *Pulse Shield*. Baseline Sensor Range: 6 Zones.
  - **Skirmisher**: High speed, light hull, Generator, Pilot's Console with built-in *Rotational Thrusters*. Baseline Sensor Range: 4 Zones.
- **Dynamic Level Scaling (Levels 1–20)**:
  - Exact HP, SP, AC, Fortitude, Reflex, Will, and Speed progression tables from Archives of Nethys.
  - Changing level or frame dynamically recalibrates the ship's stats and adjusts baseline sensor range.
  - Vitals HUD displays interactive HP and SP meters with single-click damage / repair / shield adjustments.

### 4.2 Workstation Configuration & Frame Upgrades
- **Fixed Frame Workstations (2 slots)**:
  - Slot 0: Pilot's Console (Includes built-in frame upgrade: *Ramming Prow* for Bulwark, *Rotational Thrusters* for Skirmisher).
  - Slot 1: Generator (Includes built-in *Pulse Shield* for Explorer).
  - Built-in frame upgrades are free and do NOT consume station upgrade slots.
- **Customizable Modular Bays (4 slots)**:
  - Slots 2 through 5 can be configured into any available station type:
    - **Gunnery**: Automatically prompts weapon selection with weapon stats, zone range, damage dice, and weapon traits (e.g., *Coilgun*, *Particle Beam*, *Flak Cannon*, *Heavy Laser Cannon*, *Missile Rack*, *Torpedo Launcher*).
    - **Drone Console**: Prompts drone model selection with actions and stats (*Pyrotechnics Drone*, *Repair Drone*, *Scramble Drone*).
    - **Generator**: Auxiliary power plant.
    - **Scanners**: Dedicated electronic warfare and sensor suite.
    - **Magic Console**: Arcane/divine conduit.
  - Any customizable bay can be cleared back to an empty slot.

### 4.3 Station Upgrades by Level / Grade
- Station upgrade slots scale strictly by ship level:
  - **Level 1**: 0 upgrade slots
  - **Levels 2–4**: 1 upgrade slot
  - **Levels 5–10**: 2 upgrade slots
  - **Levels 11–17**: 3 upgrade slots
  - **Levels 18–20**: 4 upgrade slots
- Upgrades are categorized by station (Pilot, Gunnery, Generator, Scanners, Drone, Magic) and level requirement:
  - *Targeting Computer* (Gunnery, Lvl 1)
  - *Hardened Circuits* (Scanners, Lvl 2)
  - *Overcharge Capacitor* (Generator, Lvl 2)
  - *Countermeasure Decoy* (Pilot, Lvl 3)
  - *Automated Targeting System* (Gunnery, Lvl 4)
  - *EMP Inverter* (Scanners, Lvl 5)
  - *Emergency Thrusters* (Pilot, Lvl 5)
  - *Shield Harmonic Amplifier* (Generator, Lvl 6)
  - *Nanite Repair Matrix* (Drone, Lvl 6)
  - *Quantum Telemetry Array* (Scanners, Lvl 8)
  - *Spell-Amp Dynamo* (Magic, Lvl 8)
  - *Dimensional Shift Drive* (Pilot, Lvl 10)
  - *Tachyon Hyper-Scanner* (Scanners, Lvl 12)
  - *Overdrive Core* (Generator, Lvl 14)
  - *Singularity Beam Guide* (Gunnery, Lvl 16)
  - *Aegis Matrix* (Generator, Lvl 18)
- Installing an upgrade unlocks its granted action directly in the battle station panel.

### 4.4 Hangar Bay & Room State Persistence
- **Auto-Persistence**: Ship configuration, HP/SP status, and installed stations auto-save to browser `localStorage` keyed by Room ID.
- **Hangar Bay Fleet**: Players can save named starship configurations ("Profiles") into a fleet roster and deploy any saved ship to the bridge in 1 click.
- **GM Room Export & Import**: GMs can backup the entire room state (encounter map, total zones, sensor range, all ships, and player starship build) to a JSON file or copy to clipboard, enabling persistent campaign play across sessions.

---

## 5. Planned Future Enhancements & Roadmap

### 5.1 Automated Station Skill Rollers
- Integrated dice roller for *Seek Starships*, *Evade*, *Generate Shields*, and *Target Lock* pulling from crew member proficiencies.

### 5.2 Crew Profile Linking
- Multi-player crew login where individual players claim a specific station on the shared starship.

### 5.3 Offline PWA Support
- Service worker caching so the entire app, sensor map, and cockpit console operate offline without internet.
