import math


class Vec2D:
    __slots__ = ("x", "y")

    def __init__(self, x: float = 0.0, y: float = 0.0):
        self.x = float(x)
        self.y = float(y)

    def __add__(self, other):
        return Vec2D(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vec2D(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):
        return Vec2D(self.x * scalar, self.y * scalar)

    def __rmul__(self, scalar):
        return self.__mul__(scalar)

    def __truediv__(self, scalar):
        if scalar == 0:
            return Vec2D(0, 0)
        return Vec2D(self.x / scalar, self.y / scalar)

    def __eq__(self, other):
        return isinstance(other, Vec2D) and abs(self.x - other.x) < 1e-9 and abs(self.y - other.y) < 1e-9

    def __hash__(self):
        return hash((round(self.x, 9), round(self.y, 9)))

    def __repr__(self):
        return f"Vec2D({self.x:.2f}, {self.y:.2f})"

    def length(self) -> float:
        return math.sqrt(self.x * self.x + self.y * self.y)

    def length_sq(self) -> float:
        return self.x * self.x + self.y * self.y

    def normalize(self):
        ln = self.length()
        if ln < 1e-9:
            return Vec2D(0, 0)
        return Vec2D(self.x / ln, self.y / ln)

    def dot(self, other) -> float:
        return self.x * other.x + self.y * other.y

    def distance_to(self, other) -> float:
        return (self - other).length()

    def distance_sq_to(self, other) -> float:
        return (self - other).length_sq()

    def rotate(self, angle_rad: float):
        c = math.cos(angle_rad)
        s = math.sin(angle_rad)
        return Vec2D(self.x * c - self.y * s, self.x * s + self.y * c)

    def angle_to(self, other) -> float:
        return math.atan2(other.y - self.y, other.x - self.x)

    def lerp(self, other, t: float):
        return self + (other - self) * t

    def copy(self):
        return Vec2D(self.x, self.y)

    def to_tuple(self):
        return (self.x, self.y)

    def to_int_tuple(self):
        return (int(self.x), int(self.y))
