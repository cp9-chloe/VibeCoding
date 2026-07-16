import json
from config import MAP_COLS, MAP_ROWS


class TileType:
    GRASS = 0
    PATH = 1
    START = 2
    END = 3
    WATER = 4
    TOWER = 5

    COLORS = {
        0: (50, 120, 50),
        1: (160, 140, 100),
        2: (200, 60, 60),
        3: (60, 60, 200),
        4: (40, 80, 160),
        5: (70, 140, 70),
    }


class TileGrid:
    def __init__(self, cols: int = MAP_COLS, rows: int = MAP_ROWS):
        self.cols = cols
        self.rows = rows
        self.grid = [[TileType.GRASS for _ in range(cols)] for _ in range(rows)]
        self.start = None
        self.end = None

    def get(self, x: int, y: int) -> int:
        if 0 <= x < self.cols and 0 <= y < self.rows:
            return self.grid[y][x]
        return -1

    def set(self, x: int, y: int, tile_type: int):
        if 0 <= x < self.cols and 0 <= y < self.rows:
            self.grid[y][x] = tile_type

    def is_walkable(self, x: int, y: int) -> bool:
        t = self.get(x, y)
        return t in (TileType.PATH, TileType.START, TileType.END)

    def is_placeable(self, x: int, y: int) -> bool:
        return self.get(x, y) == TileType.GRASS

    def place_tower(self, x: int, y: int) -> bool:
        if self.is_placeable(x, y):
            self.grid[y][x] = TileType.TOWER
            return True
        return False

    def remove_tower(self, x: int, y: int):
        if self.get(x, y) == TileType.TOWER:
            self.grid[y][x] = TileType.GRASS

    def find_start(self):
        for y in range(self.rows):
            for x in range(self.cols):
                if self.grid[y][x] == TileType.START:
                    self.start = (x, y)
                    return (x, y)
        return None

    def find_end(self):
        for y in range(self.rows):
            for x in range(self.cols):
                if self.grid[y][x] == TileType.END:
                    self.end = (x, y)
                    return (x, y)
        return None
