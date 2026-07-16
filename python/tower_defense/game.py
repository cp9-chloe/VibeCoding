import pygame
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from config import SCREEN_WIDTH, SCREEN_HEIGHT, FPS, TILE_SIZE, TOWER_TYPES, STARTING_LIVES
from core.vector import Vec2D
from core.pathfinding import astar
from core.camera import Camera
from map.tile_grid import TileGrid, TileType
from map.map_loader import load_map, create_default_map
from entities.tower import Tower
from entities.projectile import Projectile
from systems.wave_manager import WaveManager, load_waves
from systems.economy import Economy
from systems.collision_system import CollisionSystem
from rendering.renderer import Renderer
from rendering.ui import UI


class Game:
    def __init__(self, screen):
        self.screen = screen
        self.state = "menu"
        self.reset()

    def reset(self):
        self.grid = load_map(os.path.join(os.path.dirname(__file__), "data", "maps", "level1.json"))
        if not self.grid.start or not self.grid.end:
            self.grid = create_default_map()

        self.camera = Camera()
        self.economy = Economy()
        self.lives = STARTING_LIVES
        self.towers = []
        self.enemies = []
        self.projectiles = []
        self.collision_system = CollisionSystem()
        self.renderer = Renderer(self.screen)
        self.ui = UI(SCREEN_WIDTH, SCREEN_HEIGHT)

        start = self.grid.start
        end = self.grid.end
        self.path = astar(self.grid, start, end) or []

        waves = load_waves(os.path.join(os.path.dirname(__file__), "data", "waves.json"))
        self.wave_manager = WaveManager(waves, self.path)
        self.selected_tower_type = None
        self.selected_tower_tile = None
        self.wave_active = False
        self.game_over = False
        self.won = False

    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False

            if event.type == pygame.KEYDOWN:
                if self.state == "menu":
                    if event.key == pygame.K_SPACE:
                        self.state = "playing"
                elif self.state == "playing":
                    if event.key == pygame.K_ESCAPE:
                        self.selected_tower_type = None
                        self.selected_tower_tile = None
                    elif event.key == pygame.K_SPACE and not self.wave_active and not self.wave_manager.all_waves_done:
                        self.wave_manager.start_wave()
                        self.wave_active = True
                elif self.state == "gameover":
                    if event.key == pygame.K_SPACE:
                        self.reset()
                        self.state = "playing"
                    elif event.key == pygame.K_q:
                        return False

            if event.type == pygame.MOUSEBUTTONDOWN and self.state == "playing":
                if event.button == 1:
                    self._handle_left_click(event.pos)
                elif event.button == 3:
                    self._handle_right_click(event.pos)

            if event.type == pygame.MOUSEMOTION and self.state == "playing":
                self.ui.handle_hover(event.pos)

        return True

    def _handle_left_click(self, pos):
        ui_result = self.ui.handle_click(pos)
        if ui_result:
            if self.selected_tower_type == ui_result:
                self.selected_tower_type = None
            else:
                self.selected_tower_type = ui_result
                self.selected_tower_tile = None
            return

        if pos[1] >= SCREEN_HEIGHT - 100:
            return

        tile_x = int(pos[0] // TILE_SIZE)
        tile_y = int(pos[1] // TILE_SIZE)

        if self.selected_tower_type:
            if self.grid.is_placeable(tile_x, tile_y):
                if self.economy.can_afford(self.selected_tower_type):
                    self.economy.buy_tower(self.selected_tower_type)
                    tower = Tower(self.selected_tower_type, tile_x, tile_y, TOWER_TYPES[self.selected_tower_type])
                    self.towers.append(tower)
                    self.grid.place_tower(tile_x, tile_y)
                    self._recalculate_paths()
        else:
            for tower in self.towers:
                if tower.tile_x == tile_x and tower.tile_y == tile_y:
                    self.selected_tower_tile = (tile_x, tile_y)
                    return
            self.selected_tower_tile = None

    def _handle_right_click(self, pos):
        if pos[1] >= SCREEN_HEIGHT - 100:
            return

        tile_x = int(pos[0] // TILE_SIZE)
        tile_y = int(pos[1] // TILE_SIZE)

        for tower in self.towers[:]:
            if tower.tile_x == tile_x and tower.tile_y == tile_y:
                self.economy.sell_tower(tower.tower_type)
                self.towers.remove(tower)
                self.grid.remove_tower(tile_x, tile_y)
                self._recalculate_paths()
                break

    def _recalculate_paths(self):
        if not self.grid.start or not self.grid.end:
            return
        new_path = astar(self.grid, self.grid.start, self.grid.end)
        if new_path:
            self.path = new_path
            for enemy in self.enemies:
                if enemy.alive:
                    enemy.path = [p.copy() for p in new_path]
                    enemy.path_index = 0
        else:
            for tower in self.towers[:]:
                self.grid.remove_tower(tower.tile_x, tower.tile_y)
                self.towers.remove(tower)
            self._recalculate_paths()

    def update(self, dt):
        if self.state != "playing":
            return

        if self.wave_active:
            new_enemies = self.wave_manager.update(dt)
            self.enemies.extend(new_enemies)

        for enemy in self.enemies:
            if enemy.alive:
                enemy.update(dt, self.enemies)

        for tower in self.towers:
            tower.update(dt, self.enemies)
            if tower.is_ready() and tower.target:
                config = tower.config
                proj = Projectile(
                    tower.pos, tower.target, tower.damage,
                    splash=config.get("splash", 0),
                    slow=config.get("slow", 0),
                    chain=config.get("chain", 0),
                    color=config.get("color", (255, 255, 100)),
                )
                self.projectiles.append(proj)

        for proj in self.projectiles:
            if proj.alive:
                proj.update(dt, self.enemies)

        self.collision_system.update(self.projectiles, self.enemies)
        self.collision_system.update_particles(dt)

        for enemy in self.enemies:
            if enemy.alive and enemy.reached_end:
                self.lives -= 1
                enemy.alive = False

        self.enemies = [e for e in self.enemies if e.alive]
        self.projectiles = [p for p in self.projectiles if p.alive]

        if self.wave_active and not self.wave_manager.wave_active:
            self.wave_active = False
            if not self.wave_manager.all_waves_done:
                self.wave_manager.current_wave += 1
            else:
                if not self.enemies:
                    self.state = "gameover"
                    self.won = True

        if self.lives <= 0:
            self.state = "gameover"
            self.won = False

    def draw(self):
        self.renderer.clear()

        if self.state == "menu":
            self.ui.draw_start_screen(self.screen)
        elif self.state == "playing":
            self.renderer.draw_grid(self.grid, self.camera)

            if self.selected_tower_type and not (pygame.mouse.get_pos()[1] >= SCREEN_HEIGHT - 100):
                mx, my = pygame.mouse.get_pos()
                tile_x = int(mx // TILE_SIZE)
                tile_y = int(my // TILE_SIZE)
                if self.grid.is_placeable(tile_x, tile_y):
                    sx, sy = self.camera.world_to_screen(tile_x, tile_y)
                    sw = int(TILE_SIZE * self.camera.zoom)
                    config = TOWER_TYPES[self.selected_tower_type]
                    range_r = int(config["range"] * TILE_SIZE * self.camera.zoom)
                    range_surf = pygame.Surface((range_r * 2, range_r * 2), pygame.SRCALPHA)
                    pygame.draw.circle(range_surf, (255, 255, 255, 20), (range_r, range_r), range_r)
                    self.screen.blit(range_surf, (sx + sw // 2 - range_r, sy + sw // 2 - range_r))
                    pygame.draw.rect(self.screen, (100, 255, 100), (sx, sy, sw, sw), 2)

            self.renderer.draw_towers(self.towers, self.camera, self.selected_tower_tile)
            self.renderer.draw_enemies(self.enemies, self.camera)
            self.renderer.draw_projectiles(self.projectiles, self.camera)
            self.collision_system.draw_particles(self.screen, self.camera)

            self.ui.draw(
                self.screen,
                self.economy.gold,
                self.lives,
                self.wave_manager.get_wave_info(),
                self.selected_tower_type,
            )

            mx, my = pygame.mouse.get_pos()
            if my < SCREEN_HEIGHT - 100:
                self.ui.draw_tooltip(self.screen, (mx, my), self.selected_tower_type)

            if self.selected_tower_tile:
                for tower in self.towers:
                    if (tower.tile_x, tower.tile_y) == self.selected_tower_tile:
                        tower.draw(self.screen, self.camera, show_range=True)
                        break

        elif self.state == "gameover":
            self.renderer.draw_grid(self.grid, self.camera)
            self.renderer.draw_towers(self.towers, self.camera)
            self.ui.draw_game_over(self.screen, self.won)

        pygame.display.flip()
