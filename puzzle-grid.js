
const LINE_WIDTH = 20;
const BLOCK_SIZE = 100;

class PuzzleGrid {
	constructor(rows, cols) {

	}

	draw(ctx) {
		const puzzleWidth = (BLOCK_SIZE + LINE_WIDTH) * this.cols + LINE_WIDTH;
		const puzzleHeight = (BLOCK_SIZE + LINE_WIDTH) * this.rows + LINE_WIDTH;

		ctx.fillStyle = "#303030";
		ctx.fillRect(0, 0, puzzleWidth, puzzleHeight);

		ctx.fillStyle = 
	}
}
