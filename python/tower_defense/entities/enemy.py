import math
from core.vector import Vec2D
from core.state_machine import StateMachine
from config import TILE_SIZE


class Enemy:
    def __init__(self, enemy_type: str, path: list, config: dict, wave_num: int = 1):
        self.enemy_type = enemy_type
        self.config = config
        self.path = [p.copy() for p in path]
        self.path_index = 0

        hp_scale = 1.0 + max(0, wave_num - 5) * 0.05
        speed_scale = 1.0 + max(0, wave_num - 5) * 0.03

        self.max_hp = config["hp"] * hp_scale
        self.hp = self.max_hp
        self.base_speed = config["speed"] * speed_scale
        self.speed = self.base_speed
        self.armor = config.get("armor", 0)
        self.reward = config["reward"]
        self.color = config["color"]
        self.size = config.get("size", 0.3)
        self.flying = config.get("flying", False)
        self.heal_rate = config.get("heal_rate", 0)

        self.pos = path[0].copy() if path else Vec2D(0, 0)
        self.alive = True
        self.reached_end = False
        self.slow_timer = 0.0
        self.slow_factor = 1.0

        self.sm = StateMachine("patrol")

    @property
    def pixel_pos(self):
        return (self.pos.x * TILE_SIZE, self.pos.y * TILE_SIZE)

    @property
    def tile_pos(self):
        return (int(self.pos.x), int(self.pos.y))

    def take_damage(self, damage: float):
        actual = max(1, damage - self.armor)
        self.hp -= actual
        if self.hp <= 0:
            self.hp = 0
            self.alive = False

    def apply_slow(self, factor: float, duration: float):
        self.slow_factor = min(self.slow_factor, factor)
        self.slow_timer = max(self.slow_timer, duration)

    def update(self, dt: float, enemies=None):
        self.sm.update(dt)

        if self.slow_timer > 0:
            self.slow_timer -= dt
            if self.slow_timer <= 0:
                self.slow_timer = 0
                self.slow_factor = 1.0

        if self.heal_rate > 0 and enemies:
            self._heal_nearby(dt, enemies)

        if self.sm.state == "patrol":
            self._patrol(dt)

    def _patrol(self, dt: float):
        if self.path_index >= len(self.path):
            self.reached_end = True
            self.alive = False
            return

        target = self.path[self.path_index]
        diff = target - self.pos
        dist = diff.length()
        move_speed = self.speed * self.slow_factor * dt

        if dist <= move_speed:
            self.pos = target.copy()
            self.path_index += 1
        else:
            self.pos = self.pos + diff.normalize() * move_speed

    def _heal_nearby(self, dt: float, enemies):
        heal_range = 2.0
        for other in enemies:
            if other is self or not other.alive:
                continue
            if self.pos.distance_to(other.pos) <= heal_range:
                other.hp = min(other.max_hp, other.hp + self.heal_rate * dt)

    def draw(self, surface, camera):
        sx, sy = camera.world_to_screen(self.pos.x, self.pos.y)
        r = int(TILE_SIZE * self.size * camera.zoom)
        pygame_draw_circle(surface, self.color, (sx, sy), r)

        if self.slow_timer > 0:
            pygame_draw_circle(surface, (100, 200, 255), (sx, sy), r + 2, 2)

        bar_w = int(TILE_SIZE * 0.8 * camera.zoom)
        bar_h = max(3, int(4 * camera.zoom))
        bar_x = sx - bar_w // 2
        bar_y = sy - r - bar_h - 2
        fill = max(0, self.hp / self.max_hp)
        pygame_draw_rect(surface, COLORS_RED, (bar_x, bar_y, bar_w, bar_h))
        pygame_draw_rect(surface, COLORS_GREEN, (bar_x, bar_y, int(bar_w * fill), bar_h))


import pygame

COLORS_RED = (200, 50, 50)
COLORS_GREEN = (50, 200, 50)


def pygame_draw_circle(surface, color, center, radius, width=0):
    pygame.draw.circle(surface, color, center, max(1, radius), width)


def pygame_draw_rect(surface, color, rect):
    pygame.draw.rect(surface, color, rect)
