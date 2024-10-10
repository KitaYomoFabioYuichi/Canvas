import { useRef, useState } from "react";
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

class TestObject extends CanvasObject{
    x:number = 0;
    y:number = 0;
    sx:number = 0;
    sy:number = 0;

    create(): void {
        const c = this.getContext();
        this.x = c.canvas.width/2;
        this.y = c.canvas.height/2;

        this.sx = 50;
        this.sy = 100;
    }
    update(delta: number): void {
        const c = this.getContext();

        this.x += this.sx*delta;
        this.y += this.sy*delta;

        if((this.x < 0 && this.sx < 0) || (this.x > c.canvas.width && this.sx > 0)){
            this.sx *= -1;
        }

        if((this.y < 0 && this.sy < 0) || (this.y > c.canvas.height && this.sy > 0)){
            this.sy *= -1;
        }
    }
    draw(): void {
        const c = this.getContext();

        c.beginPath();
        c.arc(this.x, this.y, 50, 0, Math.PI*2);
        c.fill();
    }
    
}

function App() {
    const [state, setState] = useState(false);

    const canvasObjects = useRef([new CircleObject(), new TestObject()]).current;

    return (
        <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
        }}>
            <Canvas style={{ flex: 1 }} canvasObjects={canvasObjects} fps={60} scaleX={2} scaleY={0.5}/>
            <button onClick={()=>setState(!state)}>{String(state)}</button>
        </div>
    )
}

export default App
