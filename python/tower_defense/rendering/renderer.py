import pygame
from config import TILE_SIZE, COLORS, MAP_COLS, MAP_ROWS


class Renderer:
    def __init__(self, screen):
        self.screen = screen
        self.font = pygame.font.SysFont("arial", 16)
        self.font_large = pygame.font.SysFont("arial", 24, bold=True)
        self.font_small = pygame.font.SysFont("arial", 12)

    def clear(self):
        self.screen.fill(COLORS["bg"])

    def draw_grid(self, grid, camera):
        for y in range(grid.rows):
            for x in range(grid.cols):
                tile = grid.get(x, y)
                color = TileType_COLORS.get(tile, COLORS["grass"])
                sx, sy = camera.world_to_screen(x, y)
                sw = int(TILE_SIZE * camera.zoom)
                sh = int(TILE_SIZE * camera.zoom)
                pygame.draw.rect(self.screen, color, (sx, sy, sw, sh))
                pygame.draw.rect(self.screen, (40, 40, 50), (sx, sy, sw, sh), 1)

    def draw_towers(self, towers, camera, selected_tile=None):
        for tower in towers:
            show_range = (tower.tile_x, tower.tile_y) == selected_tile
            tower.draw(self.screen, camera, show_range=show_range)

    def draw_enemies(self, enemies, camera):
        for enemy in enemies:
            if enemy.alive:
                enemy.draw(self.screen, camera)

    def draw_projectiles(self, projectiles, camera):
        for proj in projectiles:
            if proj.alive:
                proj.draw(self.screen, camera)

    def draw_text(self, text, x, y, color=COLORS["white"], font=None):
        if font is None:
            font = self.font
        surface = font.render(text, True, color)
        self.screen.blit(surface, (x, y))

    def draw_centered_text(self, text, y, color=COLORS["white"], font=None):
        if font is None:
            font = self.font_large
        surface = font.render(text, True, color)
        x = (self.screen.get_width() - surface.get_width()) // 2
        self.screen.blit(surface, (x, y))


TileType_COLORS = {
    0: (50, 120, 50),
    1: (160, 140, 100),
    2: (200, 60, 60),
    3: (60, 60, 200),
    4: (40, 80, 160),
    5: (70, 140, 70),
}
