static bool isDirectionSafe(Grid<bool>& board, int row, int col, int drow, int dcol) {
	if (drow == 0 && dcol == 0) return true;
	row += drow;
	col += dcol;
	while (board.inBounds(row, col) && !board[row][col]) {
		row += drow;
		col += dcol;
	}
	return !board.inBounds(row, col);
}

static bool isSafe(Grid<bool>& board, int row, int col) {
	for (int drow = -1; drow <= 1; drow++) {
		for (int dcol = -1; dcol <=1; dcol++) {
			if (!isDirectionSafe(board, row, col, drow, dcol))
				return false;
		}
	}
	return true;
}

static void identifySafeLocations(Grid<bool>& board) {
	for (int row = 0; row < board.numRows(); row++) {
		for (int col = 0; col < board.numCols(); col++) {
			if (!board[row][col]) {
				markLocation("S", row, col, "Green");
			} else {
				markLocation("X", row, col, "Red");
			}
		}
	}
}

static void placeRandomQueens(Grid<bool>& board, int numQueensToPlace) {
	int numQueensPlaced = 0;
	while (numQueensPlaced < numQueensToPlace) {
		int row = randomInteger(0, board.numRows() - 1);
		int col = randomInteger(0, board.numCols() - 1);
		if (!board[row][col]) {
			board[row][col] = true;
			markLocation("Q", row, col, "Black");
			numQueensPlaced++;
		}
	}
}

static void clearBoard(Grid<bool>& board) {
	for (int row = 0; row < board.numRows(); row++) {
		for (int col = 0; col < board.numCols(); col++) {
			board[row][col] = false;
			drawSquare(row, col, "Blue");
		}
	}
}

static void markLocation(char *label, int row, int col, char *color) {

}

static void drawSquare(int row, int col, char *color) {

}

static int randomInteger(int min, int max) {

}
