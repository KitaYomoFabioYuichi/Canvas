import { HTMLAttributes, useEffect, useRef } from "react"
import styles from "./Canvas.module.css"
import CanvasObject from "./CanvasObject";
import CanvasObjectManager from "./CanvasObjectManager";
import CanvasInputManager from "./CanvasInput";

interface CanvasProps extends HTMLAttributes<HTMLElement>{
    staticCanvas?:boolean,
    canvasObjects?:CanvasObject[],
    clearAfterUpdate?:boolean
}

export default function Canvas({
    canvasObjects = [],
    clearAfterUpdate = true,
    staticCanvas = false,
    ...props
}:CanvasProps){
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(()=>{
        //Init canvas/context
        const canvas = canvasRef.current; if(!canvas) return;
        const context = canvas.getContext("2d"); if(!context) return;

        //Handle Resize
        const handleResize = ()=>{
            const parentElement = canvas.parentElement;
            if(!parentElement) return;

            const parentRect = parentElement.getBoundingClientRect();
            canvas.width = parentRect.width;
            canvas.height = parentRect.height;
        }
        
        handleResize();
        window.addEventListener("resize", handleResize);

        //Handle Input
        const inputManager = new CanvasInputManager();

        const mousePressed = (ev:MouseEvent)=>{
            if(ev.button === 0) inputManager.mousePressed = true;
        }

        const mouseReleased = (ev:MouseEvent)=>{
            if(ev.button === 0) inputManager.mousePressed = false;
        }

        const mouseEntered = ()=>{
            inputManager.inCanvas = true;
        }

        const mouseLeft = ()=>{
            inputManager.inCanvas = false;
        }

        const mouseMoved = (e:MouseEvent)=>{
            const rect = canvas.getBoundingClientRect();
            inputManager.mousePosition.x = e.clientX - rect.left;
            inputManager.mousePosition.y = e.clientY - rect.top;
        }

        canvas.addEventListener("mousedown", mousePressed);
        canvas.addEventListener("mouseup", mouseReleased);
        canvas.addEventListener("mouseenter", mouseEntered);
        canvas.addEventListener("mouseleave", mouseLeft);
        window.addEventListener("mousemove", mouseMoved);
        
        //Handle Objects
        const objectManager = new CanvasObjectManager(context, inputManager);
        objectManager.create(canvasObjects);

        //Handle Animation
        let id = 0;
        let prev = 0;
        
        const render = (timestamp:number)=>{
            if(!staticCanvas) id = window.requestAnimationFrame(render);

            if(clearAfterUpdate) 
                context.clearRect(0, 0, canvas.width, canvas.height);

            let delta = 0;
            if(prev) delta = Math.min((timestamp-prev), 32)/1000;
            prev = timestamp

            //Update
            objectManager.update(delta);

            //Draw
            objectManager.draw();

            //Update Input
            inputManager.update();
            
        }
        render(0);

        return ()=>{
            if(id) window.cancelAnimationFrame(id);
            window.removeEventListener("resize", handleResize);
            
            canvas.removeEventListener("mousedown", mousePressed);
            canvas.removeEventListener("mouseup", mouseReleased);
            canvas.removeEventListener("mouseenter", mouseEntered);
            canvas.removeEventListener("mouseleave", mouseLeft);
            window.removeEventListener("mousemove", mouseMoved);
        }
    },[canvasObjects, staticCanvas, clearAfterUpdate]);

    return <div {...props}>
        <div className={styles.canvasContainer}>
            <canvas className={styles.canvas} ref={canvasRef}/>
        </div>
    </div>
}