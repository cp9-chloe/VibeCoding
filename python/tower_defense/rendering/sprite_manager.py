import os
import pygame


class SpriteManager:
    def __init__(self):
        self.cache = {}
        self.base_path = os.path.join(os.path.dirname(__file__), "..", "data")

    def load(self, name, size=None):
        if name in self.cache:
            return self.cache[name]

        path = os.path.join(self.base_path, "sprites", f"{name}.png")
        if os.path.exists(path):
            sprite = pygame.image.load(path).convert_alpha()
            if size:
                sprite = pygame.transform.smoothscale(sprite, size)
            self.cache[name] = sprite
            return sprite
        return None

    def get(self, name):
        return self.cache.get(name)
