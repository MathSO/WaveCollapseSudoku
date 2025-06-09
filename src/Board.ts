interface Scale{
    
}

interface Dimension{
    width:number,
    height:number
}
interface OffSet{
    horizontal:number,
    vertical:number
}
interface SolveObject{
    n:number,
    possibilities:number[],
    initialRandom:number,
    nextToTry:number
}

class Board{
    private readonly HEIGHT:number;
    private readonly WIDTH:number;
    get height():number {return this.HEIGHT}
    get width():number {return this.WIDTH}
    
    private readonly BOARD_SIZE:number;
    private readonly SQUARE_SIZE:number;
    
    private readonly SQUARE_WIDTH:number;
    private readonly SQUARE_HEIGHT:number;

    private readonly SQUARE_HORIZONTAL_MIDDLE:number;
    private readonly SQUARE_VERTICAL_MIDDLE:number;

    private board: number[];
    private initialBoard: number[]|undefined;
    private startedSolve: boolean;
    get isSolving():boolean { return this.startedSolve }

    private notCollapsed: number[];

    private solveStack: SolveObject[] = [];
    private tried: Map<string,boolean> = new Map<string, boolean>();
    private selectedValue:number|undefined = undefined;

    constructor(max_number: number, dimension:Dimension, startSolving?:boolean, initialBoard?:number[]) {
        this.HEIGHT = dimension.height;
        this.WIDTH = dimension.width;

        this.BOARD_SIZE = max_number;
        this.SQUARE_SIZE = this.BOARD_SIZE*this.BOARD_SIZE;

        this.SQUARE_WIDTH = this.WIDTH / this.SQUARE_SIZE;
        this.SQUARE_HEIGHT = this.HEIGHT / this.SQUARE_SIZE;
        this.SQUARE_HORIZONTAL_MIDDLE = this.SQUARE_WIDTH/2;
        this.SQUARE_VERTICAL_MIDDLE = this.SQUARE_HEIGHT/2;

        this.board = initialBoard ?? this.initBoard();
        this.initialBoard = initialBoard?.slice();

        this.startedSolve = startSolving ?? false;

        this.notCollapsed = [];
        this.initNotCollapsed();
    }

    private initBoard():number[] {
        return new Array<number>(this.SQUARE_SIZE*this.SQUARE_SIZE).fill(0);
    }

    private initNotCollapsed() {
        this.notCollapsed = [];
        for (let i = 0; i < this.SQUARE_SIZE; i++) {
            for (let j = 0; j < this.SQUARE_SIZE; j++) {
                const n = (i*this.SQUARE_SIZE)+j;
                if (this.board[n] == 0) {
                    this.notCollapsed.push(n);
                }
            }
        }
    }

    public draw(ctx:CanvasRenderingContext2D, offSet:OffSet):void {
        ctx.lineWidth = 1;
        ctx.font = `${(this.HEIGHT / this.SQUARE_SIZE) - 15}px/${(this.HEIGHT / this.SQUARE_SIZE)}px Times New Roman`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.strokeStyle = "lightsteelblue";
        for (let i = 0; i < this.SQUARE_SIZE; i++) {
            for (let j = 0; j < this.SQUARE_SIZE; j++) {
                ctx.strokeRect(j * this.SQUARE_WIDTH + offSet.horizontal, i * this.SQUARE_HEIGHT + offSet.vertical, this.SQUARE_WIDTH, this.SQUARE_HEIGHT);
               
                if (this.initialBoard && this.initialBoard[i*this.SQUARE_SIZE+j]!=0) {
                    ctx.fillStyle = "blue";
                    ctx.fillText(this.initialBoard[i*this.SQUARE_SIZE+j].toString(this.SQUARE_SIZE+1), j * this.SQUARE_WIDTH + this.SQUARE_HORIZONTAL_MIDDLE + offSet.horizontal, i * this.SQUARE_HEIGHT + this.SQUARE_VERTICAL_MIDDLE + offSet.vertical, this.SQUARE_WIDTH);
                } else if (this.board[i*this.SQUARE_SIZE+j]!=0) {
                    ctx.fillStyle = "gray";
                    ctx.fillText(this.board[i*this.SQUARE_SIZE+j].toString(this.SQUARE_SIZE+1), j * this.SQUARE_WIDTH + this.SQUARE_HORIZONTAL_MIDDLE + offSet.horizontal, i * this.SQUARE_HEIGHT + this.SQUARE_VERTICAL_MIDDLE + offSet.vertical, this.SQUARE_WIDTH);
                }
            }
        }
        
        ctx.strokeStyle = "black";
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                ctx.strokeRect(j * this.WIDTH/this.BOARD_SIZE+offSet.horizontal, i * this.HEIGHT/this.BOARD_SIZE+offSet.vertical, this.WIDTH/this.BOARD_SIZE, this.HEIGHT/this.BOARD_SIZE);
            }
        }

        ctx.lineWidth = 3;
        if (this.selectedValue !== undefined) {
            ctx.strokeStyle = "red";
            const i = Math.floor(this.selectedValue / this.SQUARE_SIZE);
            const j = this.selectedValue % this.SQUARE_SIZE;

            ctx.strokeRect(j * this.SQUARE_WIDTH + offSet.horizontal, i * this.SQUARE_HEIGHT + offSet.vertical, this.SQUARE_WIDTH, this.SQUARE_HEIGHT);
        }

        ctx.strokeStyle = "darkgreen"
        ctx.lineWidth = 10;
        ctx.strokeRect(offSet.horizontal, offSet.vertical, this.WIDTH, this.HEIGHT);
    }

    public solve():boolean {
        if (!this.startedSolve) {
            return false
        }

        if (this.notCollapsed.length == 0) {
            return true;
        }

        this.notCollapsed.sort(this.less);
        
        let n = this.notCollapsed.pop()??0;
        let possibilities = this.tilePossibilites(n);
        let initialRandom = Math.floor(Math.random()*possibilities.length);

        if (possibilities.length == 0) {
            if (this.solveStack.length == 0) {
                throw new Error(`sudoku can not be solved cell ${n}`);
            }
            this.notCollapsed.push(n);
            
            let stack = this.solveStack.pop();
            while(stack != null && this.tried.get(this.board.toString()+stack.n+stack.possibilities[(stack.nextToTry)])){
                this.notCollapsed.push(stack.n??0);
                this.board[stack.n??0] = 0;
                stack = this.solveStack.pop();
            }
            if (stack === null) {
                throw new Error("sudoku can not be solved");
            }

            n = stack?.n ?? 0;
            possibilities = stack?.possibilities??[];
            initialRandom = stack?.nextToTry??0;
        }

        this.tried.set(this.board.toString()+n+possibilities[(initialRandom)], true);
        this.board[n] = possibilities[(initialRandom)];

        this.solveStack.push({
            n: n,
            possibilities: possibilities,
            initialRandom: initialRandom,
            nextToTry: (initialRandom+1)%possibilities.length
        });

        return false;
    }

    private less = (x: number, y:number):number => {
        const weightX = this.tilePossibilites(x).length;
        const weightY = this.tilePossibilites(y).length;

        if (weightX == weightY) {
            return 0;
        }

        return weightX < weightY? 1:-1;
    }

    private tilePossibilites(n:number):number[] {
        let collapsed: boolean[] = new Array<boolean>(this.SQUARE_SIZE+1).fill(false);

        const module = n%this.SQUARE_SIZE;
        for (let i = module; i < this.board.length; i+=this.SQUARE_SIZE) {
            collapsed[this.board[i]]=true;
        }

        const y = n-module;
        for (let i = 0; i < this.SQUARE_SIZE; i++) {
            collapsed[this.board[y+i]]=true;
        }

        const lineModule = Math.floor(n/this.SQUARE_SIZE)%this.BOARD_SIZE*this.SQUARE_SIZE;
        const boardModule = n%this.BOARD_SIZE;
        let boardY = n - boardModule - lineModule;
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            for (let j = boardY; j < boardY+this.BOARD_SIZE; j++) {
                collapsed[this.board[j]] = true;
            }
            boardY += this.SQUARE_SIZE;
        }

        let weight: number[] = [];
        collapsed.forEach((el, i) => {if(i != 0 && !el) weight.push(i)});

        return weight;
    }

    public setSelected(x:number, y:number):void {
        this.selectedValue = Math.floor(y / this.SQUARE_HEIGHT) * this.SQUARE_SIZE + Math.floor(x / this.SQUARE_WIDTH);
        if (this.selectedValue < 0 || this.selectedValue > this.board.length) {
            this.selectedValue = undefined;
        }
    }
    public unsetSelected():void {
        this.selectedValue = undefined;
    }

    public setIntialBoardValue(val:number) {
        if (this.selectedValue === undefined) {
            return;
        }

        if (this.initialBoard === undefined) {
            this.initialBoard = this.initBoard();
        }

        this.board[this.selectedValue] = val;
        this.initialBoard[this.selectedValue] = val;

        this.initNotCollapsed();
    }

    public startSolving():void {
        this.startedSolve = true;
    }

    public stopSolving():void {
        this.startedSolve = false;
    }

    public resetSolving(): void {
        if (this.initialBoard === undefined) {
            this.board = this.initBoard();
            return;
        }

        this.board = this.initialBoard.slice();
        this.initNotCollapsed();
    }
}