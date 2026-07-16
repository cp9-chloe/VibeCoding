import math
from .vector import Vec2D


def circle_circle(pos_a, radius_a, pos_b, radius_b) -> bool:
    dist_sq = pos_a.distance_sq_to(pos_b)
    return dist_sq <= (radius_a + radius_b) ** 2


def point_in_circle(point, center, radius) -> bool:
    return point.distance_sq_to(center) <= radius * radius


def point_in_rect(point, rect_x, rect_y, rect_w, rect_h) -> bool:
    return rect_x <= point.x <= rect_x + rect_w and rect_y <= point.y <= rect_y + rect_h


def aabb_overlap(ax, ay, aw, ah, bx, by, bw, bh) -> bool:
    return ax < bx + bw and ax + aw > bx and ay < by + bh and ay + ah > by


def closest_point_on_circle(point, center, radius) -> Vec2D:
    diff = point - center
    ln = diff.length()
    if ln < 1e-9:
        return center + Vec2D(radius, 0)
    return center + diff * (radius / ln)
