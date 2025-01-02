# Sudoku with Wave Function Collapse (WFC)

## The Sudoku Problem
The Sudoku problem is a `9×9` grid puzzle where digits from 1 to 9 must be placed so that each row, column, and `3×3` subgrid contains every digit exactly once. The puzzle begins with some pre-filled cells, and the goal is to deduce the remaining placements using logic. A well-formed Sudoku has a single solution.

## The Wave Function Collapse Algorithm
The Wave Function Collapse (WFC) algorithm is a constraint-based procedural generation technique inspired by quantum mechanics. It starts with a superposition of all possible states (or tiles) for each position in a grid. Using a process of observation (choosing a state) and propagation (updating neighboring possibilities based on constraints), the algorithm iteratively reduces uncertainty, ensuring that adjacent tiles comply with predefined rules. WFC is widely used in procedural content generation, such as in games and level design, for creating consistent and visually appealing patterns.

## The Solution
This project uses the Wave Function Collapse (WFC) algorithm to solve a Sudoku puzzle, where each cell in the Sudoku grid is treated as a superposition of possible values. The algorithm iteratively "collapses" these possibilities based on the constraints of Sudoku. The project applies this method to efficiently generate a valid Sudoku solution by exploring and narrowing down the possibilities in a step-by-step process. Additionally, it can solve any `NxN` Sudoku size.

## The Repository
The repository contains the following key components:

### `GameLoop.ts`
This class file helps refresh the Sudoku and draw it in nearly constant time. Its constructor requires three parameters:
1. `ticksPerSecond`: The number of times the update function will attempt to execute per second.
2. A `draw` function that will be called to render the game.
3. An `update` function that will be called during execution.

### `Board.ts`
This class manages the Sudoku game. Its constructor requires:
- The size of the game.
- The dimensions for drawing the game.
- An optional parameter specifying the initial game state.

The `solve` method resolves one cell at a time and returns whether the game is completed. It throws an error if the game does not have a solution.

### Example Folder
The `example` folder contains:
- An `index.html` file with a `<canvas>` element that imports all JavaScript files. To use it, compile the TypeScript files with the `tsc` command. The generated JavaScript files will appear in a new directory called `js`.
- A `canvas.js` file, which provides an example of how to use the classes listed above.

### How to Compile
Run the `tsc` command in the root folder to generate the JavaScript files. The example can then be viewed in the browser.
