from config import STARTING_GOLD, TOWER_TYPES


class Economy:
    def __init__(self, gold: int = STARTING_GOLD):
        self.gold = gold
        self.total_earned = 0
        self.total_spent = 0

    def can_afford(self, tower_type: str) -> bool:
        cost = TOWER_TYPES.get(tower_type, {}).get("cost", 0)
        return self.gold >= cost

    def buy_tower(self, tower_type: str) -> bool:
        cost = TOWER_TYPES.get(tower_type, {}).get("cost", 0)
        if self.gold >= cost:
            self.gold -= cost
            self.total_spent += cost
            return True
        return False

    def sell_tower(self, tower_type: str):
        cost = TOWER_TYPES.get(tower_type, {}).get("cost", 0)
        refund = cost // 2
        self.gold += refund

    def add_gold(self, amount: int):
        self.gold += amount
        self.total_earned += amount
