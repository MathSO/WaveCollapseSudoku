const canvas = document.getElementById("function-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const CANVAS_HEIGHT = canvas.height;
const CANVAS_WIDTH = canvas.width;

const b:number[] = [];
// -----------  -----------
// b.push(1,0,0,  0,0,0,  4,9,0);
// b.push(0,0,0,  0,0,0,  7,0,0);
// b.push(3,9,6,  0,5,0,  0,0,0);

// b.push(6,0,0,  9,0,0,  0,0,0);
// b.push(0,0,0,  0,7,0,  0,0,0);
// b.push(0,4,9,  0,0,1,  8,2,0);

// b.push(4,0,0,  0,8,7,  0,0,0);
// b.push(0,0,3,  0,0,2,  0,0,5);
// b.push(0,0,0,  0,0,0,  0,0,0);

// -----------  -----------
// b.push(0,4,0,  0,0,8,  0,1,0);
// b.push(0,0,0,  3,0,0,  0,0,0);
// b.push(0,0,8,  0,9,0,  0,5,0);

// b.push(0,0,0,  0,0,0,  3,0,5);
// b.push(9,0,0,  0,5,0,  7,2,0);
// b.push(6,2,0,  0,7,0,  0,9,0);

// b.push(0,5,9,  0,0,0,  0,0,0);
// b.push(0,0,0,  2,1,0,  0,0,0);
// b.push(0,0,0,  6,0,0,  4,0,0);

// ----------- -----------
b.push(0,0,0,  0,3,0,  0,0,7);
b.push(0,4,0,  5,0,0,  0,0,0);
b.push(2,0,1,  0,0,0,  5,0,0);

b.push(3,0,0,  0,1,0,  0,0,8);
b.push(5,0,6,  0,2,0,  0,3,0);
b.push(0,7,9,  6,0,0,  0,0,0);

b.push(0,0,0,  0,7,0,  0,5,0);
b.push(8,0,0,  0,0,0,  0,6,0);
b.push(0,3,0,  0,0,0,  0,0,9);

// ----------- Open -----------
// b.push(1,2,0,  0,3,4,  0,0,0);
// b.push(0,0,0,  0,0,0,  0,0,0);
// b.push(0,0,0,  0,0,0,  0,0,0);

// b.push(0,0,0,  0,0,0,  0,0,0);
// b.push(0,0,0,  0,0,0,  0,0,0);
// b.push(0,0,0,  0,0,0,  0,0,0);

// b.push(0,0,0,  0,0,0,  0,0,0);
// b.push(0,0,0,  0,0,0,  0,0,0);
// b.push(0,0,0,  0,0,0,  0,0,0);

const board = new Board(3, {width: CANVAS_WIDTH, height: CANVAS_HEIGHT}, b);

function draw(): void {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    board.draw(ctx, {vertical:0, horizontal:0});
}

function update(clockTime: number): void {
    board.solve();
}

const gameLoop = new GameLoop(500, draw, update);
gameLoop.run();