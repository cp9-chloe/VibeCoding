import json
import os
from entities.enemy import Enemy
from config import ENEMY_TYPES


class WaveManager:
    def __init__(self, waves_data: list, path: list):
        self.waves = waves_data
        self.path = path
        self.current_wave = 0
        self.spawn_queue = []
        self.spawn_timer = 0.0
        self.wave_active = False
        self.wave_complete = False
        self.all_waves_done = False
        self.wave_start_delay = 0.0
        self.wave_count = 0

    def start_wave(self):
        if self.current_wave >= len(self.waves):
            self.all_waves_done = True
            return

        wave = self.waves[self.current_wave]
        self.wave_start_delay = wave.get("start_delay", 3.0)
        self.spawn_queue = []
        self.wave_count = self.current_wave + 1

        for group in wave.get("enemies", []):
            etype = group["type"]
            count = group.get("count", 1)
            interval = group.get("interval", 1.0)
            for i in range(count):
                self.spawn_queue.append({
                    "type": etype,
                    "delay": group.get("start_delay", 0) + i * interval
                })

        self.spawn_timer = 0.0
        self.wave_active = True
        self.wave_complete = False

    def update(self, dt: float) -> list:
        if not self.wave_active:
            return []

        if self.wave_start_delay > 0:
            self.wave_start_delay -= dt
            return []

        self.spawn_timer += dt
        spawned = []

        remaining = []
        for entry in self.spawn_queue:
            if entry["delay"] <= self.spawn_timer:
                config = ENEMY_TYPES.get(entry["type"], ENEMY_TYPES["basic"])
                enemy = Enemy(entry["type"], self.path, config, self.wave_count)
                spawned.append(enemy)
            else:
                remaining.append(entry)

        self.spawn_queue = remaining

        if not self.spawn_queue:
            self.wave_active = False
            self.wave_complete = True

        return spawned

    def get_wave_info(self) -> str:
        if self.all_waves_done:
            return "All waves complete!"
        return f"Wave {self.current_wave + 1}/{len(self.waves)}"

    def advance_wave(self):
        self.current_wave += 1
        if self.current_wave >= len(self.waves):
            self.all_waves_done = True


def load_waves(filepath: str) -> list:
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            data = json.load(f)
            return data.get("waves", [])
    return DEFAULT_WAVES


DEFAULT_WAVES = [
    {"id": 1, "enemies": [{"type": "basic", "count": 5, "interval": 1.0}], "start_delay": 2.0},
    {"id": 2, "enemies": [{"type": "basic", "count": 5, "interval": 0.8}, {"type": "fast", "count": 3, "interval": 0.6}], "start_delay": 2.0},
    {"id": 3, "enemies": [{"type": "fast", "count": 8, "interval": 0.5}], "start_delay": 2.0},
    {"id": 4, "enemies": [{"type": "basic", "count": 10, "interval": 0.7}, {"type": "tank", "count": 2, "interval": 2.0}], "start_delay": 2.0},
    {"id": 5, "enemies": [{"type": "tank", "count": 5, "interval": 1.5}], "start_delay": 2.0},
    {"id": 6, "enemies": [{"type": "fast", "count": 15, "interval": 0.3}], "start_delay": 2.0},
    {"id": 7, "enemies": [{"type": "basic", "count": 10, "interval": 0.5}, {"type": "tank", "count": 5, "interval": 1.0}, {"type": "flying", "count": 3, "interval": 1.5}], "start_delay": 2.0},
    {"id": 8, "enemies": [{"type": "healer", "count": 3, "interval": 2.0}, {"type": "tank", "count": 8, "interval": 1.0}], "start_delay": 2.0},
    {"id": 9, "enemies": [{"type": "fast", "count": 20, "interval": 0.2}], "start_delay": 2.0},
    {"id": 10, "enemies": [{"type": "tank", "count": 10, "interval": 0.8}, {"type": "flying", "count": 10, "interval": 0.5}, {"type": "healer", "count": 5, "interval": 1.0}], "start_delay": 3.0},
]
