import { HTMLAttributes, useEffect, useRef } from "react"
import styles from "./Canvas.module.css"
import CanvasObject from "./CanvasObject";
import CanvasObjectManager from "./CanvasObjectManager";
import CanvasInputManager from "./CanvasInput";

interface CanvasProps extends HTMLAttributes<HTMLElement>{
    staticCanvas?:boolean,
    canvasObjects?:CanvasObject[],
    clearAfterUpdate?:boolean,
    fps?:number,
    scaleX?:number,
    scaleY?:number
}

export default function Canvas({
    canvasObjects = [],
    clearAfterUpdate = true,
    staticCanvas = false,
    fps,
    scaleX = 1.0,
    scaleY = 1.0,
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
            canvas.width = parentRect.width/scaleX;
            canvas.height = parentRect.height/scaleY;
            canvas.style.width = parentRect.width + "px";
            canvas.style.height = parentRect.height + "px";
        }
        
        handleResize();
        window.addEventListener("resize", handleResize);

        //Handle Input
        const inputManager = new CanvasInputManager();

        //Mouse Input
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
            inputManager.mousePosition.x = (e.clientX - rect.left)/scaleX;
            inputManager.mousePosition.y = (e.clientY - rect.top)/scaleY;
        }

        window.addEventListener("mousedown", mousePressed);
        window.addEventListener("mouseup", mouseReleased);
        canvas.addEventListener("mouseenter", mouseEntered);
        canvas.addEventListener("mouseleave", mouseLeft);
        window.addEventListener("mousemove", mouseMoved);
        
        //TouchScreen Input
        const handleSetTouchPosition = (x:number, y:number)=>{
            const rect = canvas.getBoundingClientRect();
            inputManager.mousePosition.x = (x - rect.left)/scaleX;
            inputManager.mousePosition.y = (y - rect.top)/scaleY;
            
            const canvasOuterWidth = canvas.width*scaleX;
            const canvasOuterHeight = canvas.height*scaleY;

            if(x >= 0 && x < canvasOuterWidth && y >= 0 && y < canvasOuterHeight){
                inputManager.inCanvas = true;
            }else{
                inputManager.inCanvas = false;
            }
        }

        const touchStart = (e:TouchEvent)=>{
            inputManager.mousePressed = true;
            handleSetTouchPosition(e.touches[0].clientX, e.touches[0].clientY);
        }

        const touchEnd = ()=>{
            inputManager.mousePressed = false;
            inputManager.inCanvas = false;
        }

        const touchMove = (e:TouchEvent)=>{
            handleSetTouchPosition(e.touches[0].clientX, e.touches[0].clientY);
        }

        window.addEventListener("touchstart", touchStart);
        window.addEventListener("touchend", touchEnd);
        window.addEventListener("touchmove", touchMove);

        //Handle Objects
        const objectManager = new CanvasObjectManager(context, inputManager);
        objectManager.create(canvasObjects);

        //Handle Animation
        const FPS_INTERVAL = fps?1000/fps:undefined;

        let id = 0;

        let prev = 0;
        let lag = 0;

        const render = (now:number)=>{
            if(!staticCanvas) id = window.requestAnimationFrame(render);
            
            let elapsed = Math.min((now-prev), 32);
            prev = now;
            lag += elapsed;

            if(!FPS_INTERVAL || lag >= FPS_INTERVAL){
                if(clearAfterUpdate) context.clearRect(0, 0, canvas.width, canvas.height);
                
                if(FPS_INTERVAL) lag -= FPS_INTERVAL;

                //Update
                objectManager.update((FPS_INTERVAL?FPS_INTERVAL:elapsed)/1000);
                objectManager.draw();
                inputManager.update();
            }
            
        }
        render(0);

        return ()=>{
            if(id) window.cancelAnimationFrame(id);

            window.removeEventListener("resize", handleResize);
            
            window.removeEventListener("mousedown", mousePressed);
            window.removeEventListener("mouseup", mouseReleased);
            canvas.removeEventListener("mouseenter", mouseEntered);
            canvas.removeEventListener("mouseleave", mouseLeft);
            window.removeEventListener("mousemove", mouseMoved);

            window.removeEventListener("touchstart", touchStart);
            window.removeEventListener("touchend", touchEnd);
            window.removeEventListener("touchmove", touchMove);
        }
    },[canvasObjects, staticCanvas, clearAfterUpdate, fps, scaleX, scaleY]);

    return <div {...props}>
        <div className={styles.canvasContainer}>
            <canvas className={styles.canvas} ref={canvasRef}/>
        </div>
    </div>
}