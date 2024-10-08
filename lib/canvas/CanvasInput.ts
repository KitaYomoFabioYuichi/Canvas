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

    isMouseJustReleased(){
        return !this.mousePressed && this.prevMousePressed;
    }

    isMouseInCanvas(){
        return this.inCanvas;
    }

    isMouseJustEnteredCanvas(){
        return this.inCanvas && !this.prevInCanvas;
    }

    isMouseJustExitedCanvas(){
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

    isMouseJustReleased: ()=>boolean;

    isMouseInCanvas: ()=>boolean;

    isMouseJustEnteredCanvas: ()=>boolean;

    isMouseJustExitedCanvas: ()=>boolean;

    getMousePosition: ()=>{x:number, y:number};

    getMouseDelta: ()=>{x:number, y:number};
}