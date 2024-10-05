import { HTMLAttributes, useEffect, useRef } from "react"
import styles from "./Canvas.module.css"
import CanvasObject from "./CanvasObject";
import CanvasObjectManager from "./CanvasObjectManager";

interface CanvasProps extends HTMLAttributes<HTMLElement>{
    canvasObjects?:CanvasObject[],
    clearAfterUpdate?:boolean
}

export default function Canvas({
    canvasObjects = [],
    clearAfterUpdate = true,
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

            const positionStyle = window.getComputedStyle(parentElement).position;
            if(positionStyle == "static") parentElement.style.position = "relative";

            const parentRect = parentElement.getBoundingClientRect();
            canvas.width = parentRect.width;
            canvas.height = parentRect.height;
        }
        
        handleResize();
        window.addEventListener("resize", handleResize);

        //Handle Objects
        const objectManager = new CanvasObjectManager(context);
        objectManager.create(canvasObjects);

        //Handle Input
        //TODO

        //Handle Animation
        let id = 0;
        let prev = 0;
        
        const render = (timestamp:number)=>{
            id = window.requestAnimationFrame(render);

            if(clearAfterUpdate) 
                context.clearRect(0, 0, canvas.width, canvas.height);

            let delta = 0;
            if(prev) delta = Math.min((timestamp-prev), 32)/1000;
            prev = timestamp

            //Update
            objectManager.update(delta);

            //Draw
            objectManager.draw();
        }
        render(0);

        return ()=>{
            if(id) window.cancelAnimationFrame(id);
            window.removeEventListener("resize", handleResize);
        }
    },[canvasObjects]);

    return <div className={styles.canvasContainer} {...props}>
        <canvas className={styles.canvas} ref={canvasRef}/>
    </div>
}