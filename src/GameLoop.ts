type DrawFunction = ()=>void
type UpdateFunction = (clockTime:number)=>void

class GameLoop{
    private timePerTicks: number;
    private drawFunction: DrawFunction;
    private updateFunction: UpdateFunction;
    private isRunning: boolean;
    private animationFrameID: number;
    private lastFrameTime: number;

    constructor(ticksPerSecond: number, drawFunction: DrawFunction, updateFunction: UpdateFunction) {
        this.drawFunction = drawFunction;
        this.updateFunction = updateFunction;
        
        this.isRunning = false;
        this.animationFrameID = 0;

        this.timePerTicks = 1000/ticksPerSecond;
        this.lastFrameTime = 0;
    }

    private draw = (clockTime:number):void => {
        for (;this.lastFrameTime + this.timePerTicks <= clockTime;this.lastFrameTime += this.timePerTicks) {
            this.updateFunction(this.lastFrameTime);
        }

        this.drawFunction();

        this.animationFrameID = requestAnimationFrame(this.draw);
    }
    
    public run():void {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animationFrameID = requestAnimationFrame(this.draw);
        }
    }
    
    public stop():void {
        if (this.animationFrameID) {
            cancelAnimationFrame(this.animationFrameID);
        }

        this.isRunning = false;
    }

    public doubleTicksPerSecond() {
        this.timePerTicks >>= 1;
    }

    public halveTicksPerSecond() {
        this.timePerTicks <<= 1;
    }
}