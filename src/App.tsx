import { Canvas, CanvasObject } from "../lib"

class CircleObject extends CanvasObject {
    acc:number = 0;
    p:number = 0;
    radious:number = 0;
    position:{x:number, y:number} = {x:0, y:0}

    create(): void { }
    update(delta: number): void {
        const MAX_RADIOUS = 100;

        const input = this.getInput();
        if(input.isMouseInCanvas()) this.position = input.getMousePosition();
        
        const shouldGrow = input.isMousePressed() && input.isMouseInCanvas();
        
        this.radious = this.lerpWithDelta(this.radious, shouldGrow?MAX_RADIOUS:0, 0.99999, delta);

        if(input.isMouseJustPressed()) console.log("Pressed");
        if(input.isMouseJustReleased()) console.log("Released");
        if(input.isMouseJustEnteredCanvas()) console.log("Entered");
        if(input.isMouseJustExitedCanvas()) console.log("Exited");
    }
    
    draw(): void {
        const context = this.getContext();
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radious, 0, Math.PI*2);
        context.fill();
    }

    private lerp(i:number, f:number, p:number){
        return i + (f-i)*p;
    }

    private lerpWithDelta(i:number, f:number, ps:number, delta:number){
        return this.lerp(i, f, 1-Math.pow(1-ps, delta));
    }
}

const objects:CanvasObject[] = [new CircleObject()];

function App() {
    return (
        <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
        }}>
            <Canvas style={{ flex: 1 }} canvasObjects={objects} />
        </div>
    )
}

export default App
