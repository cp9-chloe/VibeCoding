import math
import pygame
from core.vector import Vec2D
from config import TILE_SIZE


class Projectile:
    def __init__(self, pos: Vec2D, target, damage: float, speed: float = 8.0,
                 splash: float = 0, slow: float = 0, chain: int = 0,
                 color=(255, 255, 100)):
        self.pos = pos.copy()
        self.target = target
        self.damage = damage
        self.speed = speed
        self.splash = splash
        self.slow = slow
        self.chain = chain
        self.color = color
        self.alive = True
        self.trail = []

    def update(self, dt: float, enemies: list):
        if not self.target or not self.target.alive:
            self.alive = False
            return

        diff = self.target.pos - self.pos
        dist = diff.length()
        move = self.speed * dt

        self.trail.append(self.pos.copy())
        if len(self.trail) > 5:
            self.trail.pop(0)

        if dist <= move:
            self._hit(enemies)
        else:
            self.pos = self.pos + diff.normalize() * move

    def _hit(self, enemies: list):
        self.target.take_damage(self.damage)

        if self.slow > 0:
            self.target.apply_slow(self.slow, 2.0)

        if self.splash > 0:
            for e in enemies:
                if e is not self.target and e.alive:
                    if self.pos.distance_to(e.pos) <= self.splash:
                        e.take_damage(self.damage * 0.5)

        if self.chain > 0:
            self._chain_hit(enemies)

        self.alive = False

    def _chain_hit(self, enemies: list):
        chain_range = 2.0
        current = self.target
        hits = {self.target}
        for _ in range(self.chain):
            closest = None
            closest_dist = float("inf")
            for e in enemies:
                if e.alive and e not in hits:
                    d = current.pos.distance_to(e.pos)
                    if d <= chain_range and d < closest_dist:
                        closest = e
                        closest_dist = d
            if closest:
                closest.take_damage(self.damage * 0.7)
                hits.add(closest)
                current = closest
            else:
                break

    def draw(self, surface, camera):
        sx, sy = camera.world_to_screen(self.pos.x, self.pos.y)
        r = max(2, int(3 * camera.zoom))

        for t in self.trail:
            tx, ty = camera.world_to_screen(t.x, t.y)
            alpha = int(100 * (self.trail.index(t) / max(1, len(self.trail))))
            trail_color = tuple(max(0, c - 100) for c in self.color)
            pygame.draw.circle(surface, trail_color, (tx, ty), max(1, r - 1))

        pygame.draw.circle(surface, self.color, (sx, sy), r)
