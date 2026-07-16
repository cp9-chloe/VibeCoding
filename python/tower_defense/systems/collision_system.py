import pygame
from core.collision import point_in_circle
from entities.particle import spawn_hit_particles, spawn_death_particles
from config import TILE_SIZE


class CollisionSystem:
    def __init__(self):
        self.particles = []

    def update(self, projectiles: list, enemies: list):
        for proj in projectiles:
            if not proj.alive:
                continue
            for enemy in enemies:
                if not enemy.alive:
                    continue
                if point_in_circle(proj.pos, enemy.pos, 0.3):
                    proj.target = enemy
                    proj._hit(enemies)
                    self.particles.extend(
                        spawn_hit_particles(enemy.pos, enemy.color, 3)
                    )
                    break

        for enemy in enemies:
            if not enemy.alive and enemy.hp <= 0:
                self.particles.extend(
                    spawn_death_particles(enemy.pos, enemy.color)
                )

        self.particles = [p for p in self.particles if p.alive]

    def update_particles(self, dt: float):
        for p in self.particles:
            p.update(dt)
        self.particles = [p for p in self.particles if p.alive]

    def draw_particles(self, surface, camera):
        for p in self.particles:
            p.draw(surface, camera)
