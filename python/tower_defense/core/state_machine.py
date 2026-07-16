class StateMachine:
    def __init__(self, initial_state: str):
        self._state = initial_state
        self._states = {}
        self._timers = {}

    @property
    def state(self) -> str:
        return self._state

    def set_state(self, new_state: str):
        if new_state != self._state:
            old = self._state
            self._state = new_state
            self._timers[new_state] = 0.0

    def update(self, dt: float):
        self._timers[self._state] = self._timers.get(self._state, 0.0) + dt

    def time_in_state(self) -> float:
        return self._timers.get(self._state, 0.0)
