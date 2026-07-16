# Architecture

## High-Level Component Diagram

```
┌───────────────────────────────────────────┐
│                  Game                      │
│  (Main loop, clock, event dispatch)       │
├───────────────────────────────────────────┤
│  States: MENU → PLAYING → PAUSED → GAME_OVER
└──────┬────────────┬──────────────┬────────┘
       │            │              │
       ▼            ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────────┐
│  Map     │ │  Wave    │ │  UI Layer    │
│ (TileGrid)│ │(Spawner) │ │ (HUD, menus) │
└────┬─────┘ └────┬─────┘ └──────────────┘
     │            │
     ▼            ▼
┌──────────┐ ┌──────────┐
│ Entities │ │ Towers   │
│ (Enemies)│ │ (Defense) │
└────┬─────┘ └────┬─────┘
     │            │
     ▼            ▼
┌──────────┐ ┌──────────┐
│Projectiles││ Particles │
└──────────┘ └──────────┘
```

## Data Flow (Game Loop Tick)

1. **Input** → Event queue (mouse/keyboard) → UI actions or tower placement.
2. **Wave Manager** → Spawns enemies on a timer → adds to entity list.
3. **Enemies** → Follow path via waypoints (steering behavior + A* path).
4. **Towers** → Scan for targets in range → fire projectiles.
5. **Projectiles** → Move toward target → collision check each frame.
6. **Collision System** → Hit → damage enemy, destroy projectile, spawn particles.
7. **Win/Loss Check** → Enemies reaching goal → lose lives; all waves cleared → win.
8. **Render** → Draw map → towers → enemies → projectiles → particles → UI overlay.

## Module Structure

```
python/tower_defense/
├── main.py                  # Entry point, game loop
├── game.py                  # Game class (state machine, tick, render)
├── config.py                # Constants, settings, key bindings
│
├── core/
│   ├── __init__.py
│   ├── vector.py            # Vec2D class (dx, dy, normalize, etc.)
│   ├── pathfinding.py       # A* algorithm on tile grid
│   ├── collision.py         # AABB, circle, point-in-rect detection
│   ├── state_machine.py     # Generic FSM base class
│   └── camera.py            # Viewport scrolling / zoom
│
├── entities/
│   ├── __init__.py
│   ├── enemy.py             # Enemy base + types (Fast, Tank, Flying, etc.)
│   ├── tower.py             # Tower base + types (Arrow, Cannon, Ice, etc.)
│   ├── projectile.py        # Projectile base + types (homing, linear, AoE)
│   └── particle.py          # Visual particle effects (damage, death, etc.)
│
├── systems/
│   ├── __init__.py
│   ├── wave_manager.py      # Wave definitions, spawn timing, difficulty curve
│   ├── economy.py           # Gold management, rewards, costs
│   └── collision_system.py  # Broad-phase + narrow-phase collision checks
│
├── rendering/
│   ├── __init__.py
│   ├── renderer.py          # Main render dispatcher
│   ├── sprite_manager.py    # Load, cache, and serve sprites
│   └── ui.py                # HUD, buttons, tooltips, health bars
│
├── map/
│   ├── __init__.py
│   ├── tile_grid.py         # 2D grid of tile types
│   └── map_loader.py        # Load/save map from JSON/CSV
│
├── data/
│   ├── maps/                # JSON map files
│   ├── waves.json           # Wave configuration
│   └── balance.json         # Tower/enemy stats
│
└── tests/
    ├── test_pathfinding.py
    ├── test_collision.py
    ├── test_vector.py
    └── test_enemy.py
```

## Design Patterns Used

| Pattern       | Usage |
|---------------|-------|
| **State**     | Game states (MENU, PLAYING, PAUSED, GAME_OVER), Enemy AI states |
| **Strategy**  | Tower targeting modes (nearest, weakest, strongest, fastest) |
| **Observer**  | Event system for kills, wave completion, gold changes |
| **Factory**   | Enemy/Tower creation from config data |
| **Command**   | Input actions (place tower, sell tower, upgrade, pause) |
