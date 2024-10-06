export default class CanvasInputManager{
    mousePressed = false;
    prevMousePressed = false;

    inCanvas = false;
    prevInCanvas = false;

    mousePosition = {x:0, y:0};
    prevMousePosition = {x:0, y:0};

    isMousePressed(){
        return this.mousePressed;
    }

    isMouseJustPressed(){
        return this.mousePressed && !this.prevMousePressed;
    }

    isMouseReleased(){
        return !this.mousePressed && this.prevMousePressed;
    }

    isInCanvas(){
        return this.inCanvas;
    }

    justEnteredCanvas(){
        return this.inCanvas && !this.prevInCanvas;
    }

    justExitedCanvas(){
        return !this.inCanvas && this.prevInCanvas;
    }

    getMousePosition(){
        return {...this.mousePosition}
    }

    getMouseDelta(){
        return {
            x:this.mousePosition.x - this.prevMousePosition.x,
            y:this.mousePosition.y - this.prevMousePosition.y,
        };
    }

    update(){
        this.prevMousePosition = {...this.mousePosition};
        this.prevInCanvas = this.inCanvas;
        this.prevMousePressed = this.mousePressed;
    }
}

export interface CanvasInput{
    isMousePressed: ()=>boolean;

    isMouseJustPressed: ()=>boolean;

    isMouseReleased: ()=>boolean;

    isInCanvas: ()=>boolean;

    justEnteredCanvas: ()=>boolean;

    justExitedCanvas: ()=>boolean;

    getMousePosition: ()=>{x:number, y:number};

    getMouseDelta: ()=>{x:number, y:number};
}