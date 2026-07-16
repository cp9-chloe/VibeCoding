import pygame
from config import SCREEN_WIDTH, SCREEN_HEIGHT


class Camera:
    def __init__(self):
        self.x = 0.0
        self.y = 0.0
        self.zoom = 1.0
        self.width = SCREEN_WIDTH
        self.height = SCREEN_HEIGHT

    def world_to_screen(self, world_x, world_y):
        sx = (world_x - self.x) * self.zoom
        sy = (world_y - self.y) * self.zoom
        return int(sx), int(sy)

    def screen_to_world(self, screen_x, screen_y):
        wx = screen_x / self.zoom + self.x
        wy = screen_y / self.zoom + self.y
        return wx, wy

    def apply(self, surface, target_surface):
        scaled = pygame.transform.smoothscale(
            surface, (int(surface.get_width() * self.zoom), int(surface.get_height() * self.zoom))
        )
        target_surface.blit(scaled, (0, 0))

    def visible_rect(self):
        w = self.width / self.zoom
        h = self.height / self.zoom
        return (self.x, self.y, w, h)

    def is_visible(self, x, y, margin=64):
        vw, vh = self.width / self.zoom, self.height / self.zoom
        return -margin <= x - self.x <= vw + margin and -margin <= y - self.y <= vh + margin
