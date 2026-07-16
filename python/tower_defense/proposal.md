# Tower Defense — Python Desktop Game

## Overview
A 2D tower defense game built with **pygame**, rendered to a desktop window. The game demonstrates core game development concepts that are difficult to achieve in a browser-based environment, specifically around pathfinding, collision detection, enemy AI, and object-oriented architecture.

## Goals
- Showcase **A\* pathfinding** with dynamic grid updates (path recalculation when towers are placed).
- Demonstrate **OOP design** with clean inheritance hierarchies (towers, enemies, projectiles, etc.).
- Implement **enemy AI** with state machine behaviors (waypoint following, speed variation, wave coordination).
- Implement **collision detection** between projectiles and enemies, and between enemies and the goal.
- Provide real-time **wave-based gameplay** with resource management (gold, lives).
- Run at 60 FPS in a native window with no browser overhead.

## Scope
- **Single-player** desktop game.
- **2D top-down** view with a tile-based map.
- **3–5 tower types** (e.g., Arrow, Cannon, Ice, Sniper, Tesla).
- **5+ enemy types** with varying HP, speed, and armor.
- **10+ waves** of escalating difficulty.
- **Drag-and-drop tower placement** with grid snapping.
- **Visual feedback**: projectile trails, tower range indicators, health bars, particle effects.
- **Optional**: save/load game state, high scores.

## Non-Goals
- Multiplayer or networking.
- 3D graphics.
- Mobile or web deployment.
- Level editor (map data is file-based).

## Tech Stack
| Component | Choice |
|-----------|--------|
| Language  | Python 3.11+ |
| Rendering | pygame-ce (community edition) |
| Math      | NumPy (for vector math) |
| Config    | JSON / YAML |
| Testing   | pytest |
