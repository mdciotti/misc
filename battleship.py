from numpy import ndarray

Ships = [
	None,
	{ 'name': 'Carrier', size: 5 },
	{ 'name': 'Battleship', size: 4 },
	{ 'name': 'Cruiser', size: 3 },
	{ 'name': 'Submarine', size: 3 },
	{ 'name': 'Destroyer', size: 2 } ]

class Board:
	rows = 10
	cols = 10

	def __init__(self):
		self.grid = []
		for r in range(0, self.rows):
			self.grid[r] = []
			for c in range(0, self.cols):
				self.grid[r][c] = 0

	def get(self, row, col):
		return self.grid[row][col]

	def setShip(self, shipType, row, col, isHorizontal):
		canPlace = True
		ship = Ships[shipType]
		if isHorizontal:
			for i in range(0, ship.size):
				canPlace |= self.get(row, col) == 0
		if canPlace:
			