import json
import os
from map.tile_grid import TileGrid, TileType
from config import MAP_COLS, MAP_ROWS


def load_map(filepath: str) -> TileGrid:
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            data = json.load(f)
            grid = TileGrid(data.get("cols", MAP_COLS), data.get("rows", MAP_ROWS))
            tiles = data.get("tiles", [])
            for y, row in enumerate(tiles):
                for x, val in enumerate(row):
                    grid.set(x, y, val)
            grid.find_start()
            grid.find_end()
            return grid
    return create_default_map()


def save_map(filepath: str, grid: TileGrid):
    data = {
        "cols": grid.cols,
        "rows": grid.rows,
        "tiles": grid.grid,
        "start": list(grid.start) if grid.start else None,
        "end": list(grid.end) if grid.end else None,
    }
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)


def create_default_map() -> TileGrid:
    grid = TileGrid(MAP_COLS, MAP_ROWS)

    path = [
        (0, 5), (1, 5), (2, 5), (3, 5), (4, 5), (5, 5), (6, 5),
        (6, 4), (6, 3), (6, 2),
        (7, 2), (8, 2), (9, 2), (10, 2),
        (10, 3), (10, 4), (10, 5), (10, 6), (10, 7), (10, 8),
        (11, 8), (12, 8), (13, 8),
        (13, 7), (13, 6), (13, 5), (13, 4),
        (14, 4), (15, 4), (16, 4), (17, 4), (18, 4), (19, 4),
    ]

    for i, (x, y) in enumerate(path):
        if i == 0:
            grid.set(x, y, TileType.START)
            grid.start = (x, y)
        elif i == len(path) - 1:
            grid.set(x, y, TileType.END)
            grid.end = (x, y)
        else:
            grid.set(x, y, TileType.PATH)

    return grid
