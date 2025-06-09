const canvas = document.getElementById("function-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const CANVAS_HEIGHT = canvas.height;
const CANVAS_WIDTH = canvas.width;
let SCALE_HORIZONTAL = canvas.clientWidth/CANVAS_WIDTH;
let SCALE_VERTICAL = canvas.clientHeight/CANVAS_HEIGHT;

const board = new Board(3, {width: CANVAS_WIDTH, height: CANVAS_HEIGHT});

canvas.onmousedown = mouseClicked
document.onkeydown = keyPressed

function keyPressed(event: KeyboardEvent):void {
    let key:number;
    if (key = Number.parseInt(event.key, 10)) {
        board.setIntialBoardValue(key);

        return;
    }

    console.log(event.key)
    if (event.ctrlKey && event.key === "Enter") {
        if (board.isSolving) {
            board.stopSolving();
        } else {
            board.startSolving();
        }

        return;
    }

    if (event.key === "Escape") {
        if (!board.isSolving) {
            board.resetSolving();
        }
        
        return;
    }

    if (event.ctrlKey && event.key === "ArrowUp") {
        gameLoop.doubleTicksPerSecond();
    }   
    if (event.ctrlKey && event.key === "ArrowDown") {
        gameLoop.halveTicksPerSecond();
    }
}

function mouseClicked(event: MouseEvent) {
    board.setSelected(event.offsetX/SCALE_HORIZONTAL, event.offsetY/SCALE_VERTICAL);
}

function draw(): void {
    SCALE_HORIZONTAL = canvas.clientWidth/CANVAS_WIDTH;
    SCALE_VERTICAL = canvas.clientHeight/CANVAS_HEIGHT;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    board.draw(ctx, {vertical:0, horizontal:0});
}

function update(clockTime: number): void {
    board.solve();
}

const gameLoop = new GameLoop(1, draw, update);
gameLoop.run();