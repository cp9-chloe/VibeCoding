import pygame
import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from config import SCREEN_WIDTH, SCREEN_HEIGHT, FPS
from game import Game


async def main():
    pygame.init()
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption("Tower Defense")
    clock = pygame.time.Clock()

    game = Game(screen)

    running = True
    while running:
        dt = clock.tick(FPS) / 1000.0
        dt = min(dt, 0.05)

        running = game.handle_events()
        game.update(dt)
        game.draw()

        await asyncio.sleep(0)

    pygame.quit()


if __name__ == "__main__":
    asyncio.run(main())
