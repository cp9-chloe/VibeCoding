# Design

## 1. Grid & Pathfinding

### Tile Grid
- 2D array of `TileType` enum: `GRASS`, `PATH`, `TOWER`, `START`, `END`, `WATER`.
- Each tile is 64×64 pixels.
- Towers can only be placed on `GRASS` tiles adjacent to `PATH` tiles (or any `GRASS` — configurable).

### A* Pathfinding (`core/pathfinding.py`)
- **Heuristic**: Manhattan distance (4-directional movement).
- **Grid representation**: `PATH` tiles = walkable, all others (except `START`/`END`) = blocked.
- **Dynamic recalculation**: When a tower is placed, if it blocks a path tile, all active enemies recalculate their path in the next frame.
- **Optimization**: Pre-compute a distance field (BFS from goal) on path tiles at level load; use it as a potential field for enemy steering.
- **Edge cases**: If no path exists after tower placement, reject the placement (highlight tile red).

```python
def astar(grid, start, goal) -> list[Vec2D] | None:
    open_set = PriorityQueue()
    came_from = {}
    g_score = {start: 0}
    f_score = {start: heuristic(start, goal)}

    while open_set:
        current = open_set.pop()
        if current == goal:
            return reconstruct_path(came_from, current)
        for neighbor in grid.get_walkable_neighbors(current):
            tentative = g_score[current] + 1
            if tentative < g_score.get(neighbor, inf):
                came_from[neighbor] = current
                g_score[neighbor] = tentative
                f_score[neighbor] = tentative + heuristic(neighbor, goal)
                open_set.push(neighbor, f_score[neighbor])
    return None
```

## 2. Entity Design (OOP)

### Enemy Class Hierarchy

```
Entity (abstract)
 ├── Enemy (base)
 │    ├── BasicEnemy    — medium HP, medium speed
 │    ├── FastEnemy     — low HP, high speed
 │    ├── TankEnemy     — high HP, low speed, armor
 │    ├── FlyingEnemy   — ignores path tiles (moves in straight line)
 │    ├── HealerEnemy   — heals nearby enemies every 3s
 │    └── BossEnemy     — massive HP, multiple stages (enrages at 50% HP)
 └── Particle (visual only)
```

### Enemy AI State Machine

```
PATROL (follow waypoints)
  │
  ├── reached waypoint → increment index, move to next
  ├── tower placed on path → path invalidated → recalculate
  ├── HP < threshold → FLEE state (for special enemies)
  └── reached END → remove, deduct life

FLEE
  ├── move away from nearest tower
  └── timer expires → return to PATROL

ENRAGED (Boss only)
  ├── speed doubled
  └── visual color shift
```

### Tower Class Hierarchy

```
Entity (abstract)
 └── Tower (base)
      ├── ArrowTower    — fast attack, single target, low damage
      ├── CannonTower   — slow attack, AoE splash damage
      ├── IceTower      — slows enemies in radius, no direct damage
      ├── SniperTower   — very long range, high damage, slow fire rate
      └── TeslaTower    — chains to 3 nearby enemies, medium damage
```

### Tower State Machine

```
IDLE → scanning for target → target acquired → AIMING
AIMING → cooldown finished → FIRE → spawn projectile → IDLE
IDLE → no target in range for 3s → SLEEP (skip scan to save CPU)
SLEEP → enemy enters range → IDLE
```

### Projectile Class Hierarchy

```
Projectile (base)
 ├── LinearProjectile   — moves in straight line (arrow, bullet)
 ├── HomingProjectile   — tracks target with turn rate (missile)
 └── AoeProjectile      — explodes at destination, damages area
```

## 3. Collision Detection (`core/collision.py`)

- **Broad phase**: Spatial hash grid (cell size = 2× tile size). Only check entities in same or adjacent cells.
- **Narrow phase**:
  - Projectile ↔ Enemy: Circle–Circle intersection.
  - Tower range ↔ Enemy: Point–Circle containment.
  - Mouse click ↔ UI: AABB (axis-aligned bounding box).
  - Enemy ↔ Goal: Point–Rect intersection.
- **Resolution**: On hit → apply damage, push enemy (knockback for Cannon), spawn particles.

```python
def circle_circle(a_pos, a_radius, b_pos, b_radius) -> bool:
    dist_sq = (a_pos - b_pos).length_sq()
    return dist_sq <= (a_radius + b_radius) ** 2
```

## 4. Wave System

- Waves defined in `data/waves.json` as list of wave objects.
- Each wave specifies enemy types, counts, spawn intervals, and start delay.
- Difficulty scaling: enemies get +5% HP and +3% speed per wave past wave 5.
- Special waves every 5th wave: all enemies of one type (e.g., all Tanks, all Fast).

```json
{
  "waves": [
    {
      "id": 1,
      "enemies": [
        { "type": "basic", "count": 5, "interval": 1.0 },
        { "type": "fast",  "count": 3, "interval": 0.8 }
      ],
      "start_delay": 3.0
    }
  ]
}
```

## 5. Rendering Pipeline

1. Clear screen (background color).
2. Draw tile map (grid lines optional).
3. Draw tower range indicators (semi-transparent circle, only on hover/selected).
4. Draw towers (sprite or geometric shape + rotation toward target).
5. Draw enemies (sprite + health bar above).
6. Draw projectiles (small circle or line with trail).
7. Draw particle effects (alpha-fading sprites).
8. Draw UI overlay (HUD: gold, lives, wave info, tower shop, pause button).
9. `pygame.display.flip()` at 60 FPS.

## 6. Data Flow for Tower Placement

1. User clicks a tile.
2. UI checks: tower selected in shop + enough gold + tile is placeable.
3. Pathfinding checks: placing tower here does not block the path (A* still feasible).
4. Deduct gold → instantiate Tower → add to tower list.
5. All enemies recalculate path if necessary.
6. Tile marked as `TOWER`.

## 7. Performance Considerations

- **Spatial hash** for collision reduces O(n²) to roughly O(n).
- **Sleep state** for idle towers avoids per-frame distance checks.
- **Path caching**: Enemy caches its path; only recalculates on invalidation event.
- **Particle pooling**: Reuse Particle objects instead of allocating new ones.
- **Culled rendering**: Only draw entities within camera viewport (+ margin).

## 8. Testing Strategy

| Test | What it covers |
|------|---------------|
| `test_pathfinding.py` | A* returns correct path, returns None on blocked, handles edge-to-edge |
| `test_collision.py` | Circle–circle, AABB, point-in-rect at boundaries |
| `test_vector.py` | Addition, subtraction, normalization, dot product, zero-division safety |
| `test_enemy.py` | State transitions, waypoint following, damage application, death |
| `test_tower.py` | Target acquisition (nearest, weakest, strongest), range checking |
