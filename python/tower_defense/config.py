SCREEN_WIDTH = 1280
SCREEN_HEIGHT = 720
FPS = 60
TILE_SIZE = 64
MAP_COLS = 20
MAP_ROWS = 11

COLORS = {
    "bg": (30, 30, 40),
    "grass": (50, 120, 50),
    "path": (160, 140, 100),
    "tower_spot": (70, 140, 70),
    "water": (40, 80, 160),
    "start": (200, 60, 60),
    "end": (60, 60, 200),
    "tower_range": (255, 255, 255),
    "white": (255, 255, 255),
    "black": (0, 0, 0),
    "red": (220, 50, 50),
    "green": (50, 200, 50),
    "blue": (50, 100, 220),
    "yellow": (220, 200, 50),
    "orange": (220, 140, 50),
    "purple": (160, 60, 200),
    "cyan": (50, 200, 200),
    "gold": (255, 215, 0),
    "gray": (120, 120, 120),
    "dark_gray": (60, 60, 60),
    "health_green": (50, 200, 50),
    "health_red": (200, 50, 50),
    "ui_bg": (20, 20, 30),
    "ui_border": (80, 80, 100),
}

STARTING_GOLD = 100
STARTING_LIVES = 20

TOWER_TYPES = {
    "arrow": {"cost": 25, "damage": 10, "range": 3, "fire_rate": 0.5, "color": COLORS["green"], "name": "Arrow"},
    "cannon": {"cost": 50, "damage": 30, "range": 2.5, "fire_rate": 1.5, "color": COLORS["orange"], "name": "Cannon", "splash": 1.0},
    "ice": {"cost": 35, "damage": 5, "range": 3, "fire_rate": 0.8, "color": COLORS["cyan"], "name": "Ice", "slow": 0.5},
    "sniper": {"cost": 60, "damage": 50, "range": 5, "fire_rate": 2.5, "color": COLORS["purple"], "name": "Sniper"},
    "tesla": {"cost": 75, "damage": 15, "range": 3, "fire_rate": 1.0, "color": COLORS["blue"], "name": "Tesla", "chain": 3},
}

ENEMY_TYPES = {
    "basic": {"hp": 50, "speed": 1.5, "armor": 0, "reward": 5, "color": COLORS["red"], "size": 0.3},
    "fast": {"hp": 30, "speed": 3.0, "armor": 0, "reward": 7, "color": COLORS["yellow"], "size": 0.25},
    "tank": {"hp": 150, "speed": 0.8, "armor": 3, "reward": 15, "color": COLORS["dark_gray"], "size": 0.4},
    "flying": {"hp": 40, "speed": 2.0, "armor": 0, "reward": 10, "color": COLORS["white"], "size": 0.3, "flying": True},
    "healer": {"hp": 60, "speed": 1.2, "armor": 0, "reward": 12, "color": COLORS["green"], "size": 0.3, "heal_rate": 3.0},
}

ENEMY_SCALING_HP = 0.05
ENEMY_SCALING_SPEED = 0.03
