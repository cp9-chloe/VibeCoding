import heapq
from collections import deque
from .vector import Vec2D


def heuristic(a, b) -> float:
    return abs(a[0] - b[0]) + abs(a[1] - b[1])


def get_neighbors(pos, grid):
    neighbors = []
    for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
        nx, ny = pos[0] + dx, pos[1] + dy
        if 0 <= nx < grid.cols and 0 <= ny < grid.rows:
            if grid.is_walkable(nx, ny):
                neighbors.append((nx, ny))
    return neighbors


def astar(grid, start: tuple, goal: tuple) -> list | None:
    if not grid.is_walkable(*start) or not grid.is_walkable(*goal):
        return None

    open_set = []
    heapq.heappush(open_set, (0, start))
    came_from = {}
    g_score = {start: 0}

    while open_set:
        _, current = heapq.heappop(open_set)

        if current == goal:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.reverse()
            return [Vec2D(x + 0.5, y + 0.5) for x, y in path]

        for neighbor in get_neighbors(current, grid):
            tentative = g_score[current] + 1
            if tentative < g_score.get(neighbor, float("inf")):
                came_from[neighbor] = current
                g_score[neighbor] = tentative
                f = tentative + heuristic(neighbor, goal)
                heapq.heappush(open_set, (f, neighbor))

    return None


def bfs_distance_field(grid, goal: tuple) -> dict:
    dist = {goal: 0}
    queue = deque([goal])
    while queue:
        current = queue.popleft()
        for neighbor in get_neighbors(current, grid):
            if neighbor not in dist:
                dist[neighbor] = dist[current] + 1
                queue.append(neighbor)
    return dist
