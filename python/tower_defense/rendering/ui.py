import pygame
from config import COLORS, TOWER_TYPES, TILE_SIZE, SCREEN_WIDTH, SCREEN_HEIGHT


UI_HEIGHT = 100
TOWER_BUTTON_WIDTH = 80
TOWER_BUTTON_HEIGHT = 60


class UI:
    def __init__(self, screen_width, screen_height):
        self.width = screen_width
        self.height = screen_height
        self.font = pygame.font.SysFont("arial", 14)
        self.font_small = pygame.font.SysFont("arial", 11)
        self.font_large = pygame.font.SysFont("arial", 20, bold=True)
        self.tower_buttons = []
        self._create_tower_buttons()
        self.selected_tower = None
        self.hovered_tower = None

    def _create_tower_buttons(self):
        x = 10
        for ttype, config in TOWER_TYPES.items():
            btn = {
                "type": ttype,
                "rect": pygame.Rect(x, self.height - UI_HEIGHT + 10, TOWER_BUTTON_WIDTH, TOWER_BUTTON_HEIGHT),
                "config": config,
            }
            self.tower_buttons.append(btn)
            x += TOWER_BUTTON_WIDTH + 10

    def handle_click(self, pos) -> str | None:
        for btn in self.tower_buttons:
            if btn["rect"].collidepoint(pos):
                return btn["type"]
        return None

    def handle_hover(self, pos):
        self.hovered_tower = None
        for btn in self.tower_buttons:
            if btn["rect"].collidepoint(pos):
                self.hovered_tower = btn["type"]
                break

    def draw(self, surface, gold, lives, wave_info, selected_tower_type):
        ui_rect = pygame.Rect(0, self.height - UI_HEIGHT, self.width, UI_HEIGHT)
        pygame.draw.rect(surface, COLORS["ui_bg"], ui_rect)
        pygame.draw.line(surface, COLORS["ui_border"], (0, self.height - UI_HEIGHT), (self.width, self.height - UI_HEIGHT), 2)

        gold_text = self.font_large.render(f"${gold}", True, COLORS["gold"])
        surface.blit(gold_text, (10, 5))

        lives_text = self.font_large.render(f"Lives: {lives}", True, COLORS["red"])
        surface.blit(lives_text, (150, 5))

        wave_text = self.font.render(wave_info, True, COLORS["white"])
        surface.blit(wave_text, (320, 10))

        for btn in self.tower_buttons:
            rect = btn["rect"]
            config = btn["config"]
            is_selected = btn["type"] == selected_tower_type
            is_hovered = btn["type"] == self.hovered_tower

            bg = COLORS["dark_gray"]
            if is_selected:
                bg = (80, 80, 120)
            elif is_hovered:
                bg = (60, 60, 80)

            pygame.draw.rect(surface, bg, rect, border_radius=4)
            pygame.draw.rect(surface, COLORS["ui_border"], rect, 2, border_radius=4)

            name_text = self.font_small.render(config["name"], True, COLORS["white"])
            surface.blit(name_text, (rect.x + 5, rect.y + 5))

            cost_text = self.font_small.render(f"${config['cost']}", True, COLORS["gold"])
            surface.blit(cost_text, (rect.x + 5, rect.y + 20))

            color = config["color"]
            pygame.draw.circle(surface, color, (rect.x + rect.width // 2, rect.y + 42), 8)

    def draw_tooltip(self, surface, mouse_pos, tower_type):
        if not tower_type:
            return
        config = TOWER_TYPES.get(tower_type)
        if not config:
            return

        lines = [
            config["name"],
            f"Cost: ${config['cost']}",
            f"Damage: {config['damage']}",
            f"Range: {config['range']}",
            f"Fire Rate: {config['fire_rate']}s",
        ]
        if config.get("splash"):
            lines.append(f"Splash: {config['splash']}")
        if config.get("slow"):
            lines.append(f"Slow: {int(config['slow'] * 100)}%")
        if config.get("chain"):
            lines.append(f"Chain: {config['chain']}")

        line_height = 16
        box_w = 140
        box_h = len(lines) * line_height + 10
        bx = mouse_pos[0] + 15
        by = mouse_pos[1] - box_h // 2

        if bx + box_w > self.width:
            bx = mouse_pos[0] - box_w - 15
        if by + box_h > self.height - UI_HEIGHT:
            by = self.height - UI_HEIGHT - box_h

        tooltip_surf = pygame.Surface((box_w, box_h), pygame.SRCALPHA)
        tooltip_surf.fill((20, 20, 30, 220))
        surface.blit(tooltip_surf, (bx, by))
        pygame.draw.rect(surface, COLORS["ui_border"], (bx, by, box_w, box_h), 1)

        for i, line in enumerate(lines):
            color = COLORS["gold"] if i == 0 else COLORS["white"]
            text = self.font_small.render(line, True, color)
            surface.blit(text, (bx + 5, by + 5 + i * line_height))

    def draw_game_over(self, surface, won):
        overlay = pygame.Surface((self.width, self.height), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 150))
        surface.blit(overlay, (0, 0))

        if won:
            text = self.font_large.render("VICTORY!", True, COLORS["gold"])
        else:
            text = self.font_large.render("GAME OVER", True, COLORS["red"])
        surface.blit(text, ((self.width - text.get_width()) // 2, self.height // 2 - 40))

        restart = self.font.render("Press SPACE to restart or Q to quit", True, COLORS["white"])
        surface.blit(restart, ((self.width - restart.get_width()) // 2, self.height // 2 + 10))

    def draw_start_screen(self, surface):
        surface.fill(COLORS["bg"])
        title = self.font_large.render("TOWER DEFENSE", True, COLORS["gold"])
        surface.blit(title, ((self.width - title.get_width()) // 2, self.height // 3))

        start = self.font.render("Press SPACE to start", True, COLORS["white"])
        surface.blit(start, ((self.width - start.get_width()) // 2, self.height // 2))

        controls = [
            "Click tower buttons to select",
            "Click grass to place tower",
            "Right-click to sell tower",
            "ESC to deselect tower",
            "SPACE to send next wave",
        ]
        for i, line in enumerate(controls):
            text = self.font_small.render(line, True, COLORS["gray"])
            surface.blit(text, ((self.width - text.get_width()) // 2, self.height // 2 + 50 + i * 20))
