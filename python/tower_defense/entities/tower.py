import math
import pygame
from core.vector import Vec2D
from core.state_machine import StateMachine
from config import TILE_SIZE


class Tower:
    def __init__(self, tower_type: str, tile_x: int, tile_y: int, config: dict):
        self.tower_type = tower_type
        self.tile_x = tile_x
        self.tile_y = tile_y
        self.config = config
        self.pos = Vec2D(tile_x + 0.5, tile_y + 0.5)

        self.damage = config["damage"]
        self.range = config["range"]
        self.fire_rate = config["fire_rate"]
        self.color = config["color"]
        self.name = config["name"]
        self.splash = config.get("splash", 0)
        self.slow = config.get("slow", 0)
        self.chain = config.get("chain", 0)

        self.cooldown = 0.0
        self.target = None
        self.angle = 0.0
        self.sm = StateMachine("idle")

    @property
    def pixel_pos(self):
        return (self.pos.x * TILE_SIZE, self.pos.y * TILE_SIZE)

    def update(self, dt: float, enemies: list):
        self.sm.update(dt)
        self.cooldown = max(0, self.cooldown - dt)

        if self.sm.state == "idle":
            self._scan(enemies)
        elif self.sm.state == "aiming":
            if self.target and self.target.alive:
                dist = self.pos.distance_to(self.target.pos)
                if dist <= self.range:
                    self.angle = self.pos.angle_to(self.target.pos)
                    if self.cooldown <= 0:
                        self.sm.set_state("firing")
                else:
                    self.target = None
                    self.sm.set_state("idle")
            else:
                self.target = None
                self.sm.set_state("idle")
        elif self.sm.state == "firing":
            self.sm.set_state("idle")
            self.cooldown = self.fire_rate

    def _scan(self, enemies: list):
        best = None
        best_dist = float("inf")
        for e in enemies:
            if not e.alive:
                continue
            dist = self.pos.distance_to(e.pos)
            if dist <= self.range and dist < best_dist:
                best = e
                best_dist = dist
        if best:
            self.target = best
            self.angle = self.pos.angle_to(best.pos)
            self.sm.set_state("aiming")

    def is_ready(self) -> bool:
        return self.sm.state == "firing"

    def draw(self, surface, camera, show_range=False):
        sx, sy = camera.world_to_screen(self.pos.x, self.pos.y)
        size = int(TILE_SIZE * 0.4 * camera.zoom)

        if show_range:
            range_r = int(self.range * TILE_SIZE * camera.zoom)
            range_surf = pygame.Surface((range_r * 2, range_r * 2), pygame.SRCALPHA)
            pygame.draw.circle(range_surf, (255, 255, 255, 30), (range_r, range_r), range_r)
            surface.blit(range_surf, (sx - range_r, sy - range_r))

        points = []
        for i in range(4):
            a = self.angle + math.pi / 2 * i
            px = sx + int(math.cos(a) * size * 0.7)
            py = sy + int(math.sin(a) * size * 0.7)
            points.append((px, py))

        pygame.draw.polygon(surface, self.color, points)
        pygame.draw.polygon(surface, (255, 255, 255), points, 2)

        tip_x = sx + int(math.cos(self.angle) * size)
        tip_y = sy + int(math.sin(self.angle) * size)
        pygame.draw.line(surface, self.color, (sx, sy), (tip_x, tip_y), max(2, int(3 * camera.zoom)))
