import random
import pygame
from core.vector import Vec2D


class Particle:
    def __init__(self, pos: Vec2D, color, vel: Vec2D = None, lifetime: float = 0.5, size: float = 3.0):
        self.pos = pos.copy()
        self.color = color
        self.vel = vel or Vec2D(random.uniform(-1, 1), random.uniform(-1, 1))
        self.lifetime = lifetime
        self.max_lifetime = lifetime
        self.size = size
        self.alive = True

    def update(self, dt: float):
        self.pos = self.pos + self.vel * dt
        self.vel = self.vel * 0.95
        self.lifetime -= dt
        if self.lifetime <= 0:
            self.alive = False

    def draw(self, surface, camera):
        if not self.alive:
            return
        sx, sy = camera.world_to_screen(self.pos.x, self.pos.y)
        alpha = self.lifetime / self.max_lifetime
        r = max(1, int(self.size * alpha * camera.zoom))
        color = tuple(max(0, min(255, int(c * alpha))) for c in self.color)
        pygame.draw.circle(surface, color, (sx, sy), r)


def spawn_hit_particles(pos: Vec2D, color, count: int = 5):
    particles = []
    for _ in range(count):
        vel = Vec2D(random.uniform(-3, 3), random.uniform(-3, 3))
        particles.append(Particle(pos, color, vel, lifetime=random.uniform(0.2, 0.5)))
    return particles


def spawn_death_particles(pos: Vec2D, color, count: int = 15):
    particles = []
    for _ in range(count):
        angle = random.uniform(0, 6.28)
        speed = random.uniform(1, 5)
        vel = Vec2D(math.cos(angle) * speed, math.sin(angle) * speed)
        particles.append(Particle(pos, color, vel, lifetime=random.uniform(0.3, 0.8), size=random.uniform(2, 5)))
    return particles


import math
