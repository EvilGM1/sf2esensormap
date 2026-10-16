# Starfinder 2e Sensor Map — User Acceptance Testing (UAT) Checklist

**Release:** `v1.0-UAT`  
**Target Audience:** Game Masters (GMs), Table Players, and Playtesters  
**Platform:** Mobile Browsers (iOS Safari, Android Chrome), Tablets, and Desktop Browsers  

---

## 🎯 UAT Overview & Goals
This document guides testers through validating the end-to-end user experience of the **SF2E Tactical Sensor Map** (`v1.0-UAT`). 
Verify that all core systems function seamlessly according to *Starfinder Tech Core* rules (pp. 170–185) during a live or simulated starship encounter.

---

## 📋 Test Matrix & Scenarios

### Scenario 1: Table Connection & Multi-Device Sync (P2P)
- [ ] **1.1 QR Code Generation**: GM clicks the Table Connect icon (<kbd>QR</kbd>) in the header. Verify room ID and scannable QR code display cleanly.
- [ ] **1.2 Player Device Connect**: Scan the QR code or open `?room=<ID>` on a phone/second device. Verify the second device joins the room and the header updates to show `1 Synced` with a green indicator.
- [ ] **1.3 Real-Time State Sync**: Move the player ship or change its heading on the GM screen; verify the change reflects immediately (< 100ms) on the connected player device.
- [ ] **1.4 Persistence on Refresh**: Refresh the browser page. Confirm all ships, headings, zones, and custom configurations reload intact from `localStorage`.

---

### Scenario 2: Game Master Console & Security Boundaries
- [ ] **2.1 GM PIN Protection**: Click **GM Mode** when locked. Verify prompt requests a PIN (Default: `0000`). Confirm invalid PIN denies entry.
- [ ] **2.2 Lock Console**: Tap the lock icon (<kbd>🔒</kbd>) in GM Mode. Verify interface instantly transitions to Player View and requires re-entering the PIN to regain GM controls.
- [ ] **2.3 Zone Expansion & Reduction**: Adjust Total Zones using `+` and `-` (range 5 to 40). Verify the track scales smoothly and centers correctly.
- [ ] **2.4 Ship Deployment**: Tap **Deploy** in GM mode. Create a new enemy vessel (e.g. "Veskarium Heavy Interceptor", Size: Large, Faction: Enemy). Confirm ship spawns at the chosen zone.
- [ ] **2.5 Dynamic Faction Swapping**: Open the ship drawer for any ship and switch its faction (Ally / Enemy / Neutral / Player). Confirm token colors update immediately.

---

### Scenario 3: Scanner Simulation & Player View Privacy (Fog of War)
- [ ] **3.1 Relative Zone Display**: In **Player View**, verify zones do NOT display absolute numbers (`Zone 12`). Instead, verify relative readouts: `CORE 0` for player ship, `+1, +2...` (Ahead), and `-1, -2...` (Aft).
- [ ] **3.2 Sensor Range Bounds**: In GM Mode, adjust **Player Sensor Rng**. Confirm that Player View only renders tiles within `[-Range, +Range]` relative to the player.
- [ ] **3.3 Sensor Blindness (Range = 0)**: Set Sensor Range to `0`. Confirm the header displays `0 (BLIND)` (or `0 Zones (Offline)` in Player View), and player screen only renders their own zone (`CORE 0`).
- [ ] **3.4 Reset to Frame Default**: Click the **Default (4)** reset button in GM controls. Verify range immediately restores to the starship frame's baseline sensor rating.
- [ ] **3.5 Scanner Cloaking / Stealth**: 
  - In GM mode, toggle **Cloak/Hide** on an enemy ship. Confirm it displays with purple stealth border and badge in GM view.
  - Switch to **Player View**. Confirm the cloaked ship is completely invisible and no meta-text leaks its presence.

---

### Scenario 4: Starship Maneuvers & Tactical Movement
- [ ] **4.1 Forward-Only Thrust**: Tap **Boost Thrusters** on the player ship. Verify the vessel only moves forward in its current facing direction up to its speed.
- [ ] **4.2 Heading Turn (180° Flip)**: Tap **Change Heading** (◄ / ►). Verify chevron facing reverses smoothly.
- [ ] **4.3 Off-Guard Flank Detection**: Position an enemy ship behind the player ship's thruster exhaust. Verify the **TACTICAL WARNING: REAR FLANK OFF-GUARD (-2 AC)** badge activates.
- [ ] **4.4 Multi-Ship Zone Clustering**: Place 2, 3, and 4 ships in the exact same zone. Verify tokens automatically tile into a clear, readable grid without overlapping.
- [ ] **4.5 Player Boundary Restrictions**: In Player View, tap an enemy or neutral ship. Confirm that flight controls are disabled and replaced by a **Read-Only Tactical Contact Analysis** card.

---

### Scenario 5: Cockpit Console & Official Starship Sheet
- [ ] **5.1 Open Console**: Tap the Player Ship token or drawer and select **Cockpit Console** (or expand Starship Sheet).
- [ ] **5.2 Level / Tier Scaling**: Adjust Tier from 1 to 20. Verify that:
  - Base Ship DC scales automatically (`10 + Tier + Crest`).
  - Crest tier advances according to SF2E progression (+0 at Tiers 1–4, +1 at 5–8, +2 at 9–12, +3 at 13–16, +4 at 17–20).
  - Power Core DCs calculate accurately.
- [ ] **5.3 Workstation Assignments**: Open **Configure Stations**. Assign crew members to Pilot, Gunner, Engineer, Science Officer, Captain, and Magic Conduit. Confirm assignments save to the profile.
- [ ] **5.4 Battle Stations Actions Modal**: Tap **Stations** in the header. Filter by station (Pilot, Gunner, Engineer, Science Officer, Magic Conduit). Confirm tier level gating filters actions accurately (Commercial, Tactical, Advanced, Superior, Elite, Ultimate, Paragon).

---

### Scenario 6: Magic Conduit & Starship Spell Repository
- [ ] **6.1 Open Spell Repository**: From the Magic Conduit station, open the Starship Spell Repository.
- [ ] **6.2 Spell Progression & DC**: Verify the 4 official SF2E starship spells are listed:
  - *Cosmic Cannon* (Direct hull offensive ray)
  - *Cosmic Bombardment* (High-yield area volley)
  - *Cosmic Fortification* (Defensive barrier reinforcement)
  - *Cosmic Repairs* (Magical system/damage restoration)
- [ ] **6.3 Rank & Scaling**: Verify that spell DC and attack roll modifiers match the Conduit's caster progression and Crest bonuses.

---

### Scenario 7: Hangar Profiles & Presets
- [ ] **7.1 Preset Frame Loading**: Open **Hangar Profiles**. Load one of the official frames:
  - *Ringworks Wanderer* (Tier 1 Scout)
  - *Kevolari Venture* (Tier 3 Armed Transport)
  - *Sanctuary Arc* (Tier 5 Heavy Hospital Frigate)
  - *Drake* (Tier 8 Cruiser)
  - *Vanguard Voidcruiser* (Tier 12 Heavy Battleship)
  - *Pegasus* (Tier 15 High-Tech Dreadnought)
- [ ] **7.2 Profile Verification**: Confirm HP, Shields, Speed, Armor/AC, Default Sensor Range, and Weapons populate according to frame specs.
- [ ] **7.3 Custom Profile Saving**: Create and save a custom starship build. Confirm it persists in the saved profiles list across sessions.

---

### Scenario 8: Audio & Ambient FX
- [ ] **8.1 Station Audio Toggle**: Tap the audio icon (<kbd>🔊</kbd>) in the header. Verify that movement and tactical actions trigger scanner telemetry blips.
- [ ] **8.2 Mute Audio**: Tap mute (<kbd>🔇</kbd>). Confirm audio silences completely.

---

## 📝 UAT Sign-Off & Feedback Template
When completing a UAT test session, submit your feedback with the following information:
- **Device & Browser**: (e.g. iPhone 15 Pro iOS Safari, Galaxy S23 Chrome, iPad Pro)
- **Role Tested**: GM / Table Player / Solo Play
- **Scenarios Passed**: e.g., 1.1–8.2
- **Anomalies / Edge Cases Observed**: [Description of any unexpected behavior]
- **Approval Decision**: [ ] Approved for v1.0 Production | [ ] Changes Requested
