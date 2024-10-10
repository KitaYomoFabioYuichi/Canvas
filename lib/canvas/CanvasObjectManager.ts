import CanvasInputManager from "./CanvasInput";
import CanvasObject from "./CanvasObject";

export default class CanvasObjectManager{
    private context:CanvasRenderingContext2D;
    private objectMap:{[id:number]:CanvasObject};
    private inputManager:CanvasInputManager;

    constructor(context:CanvasRenderingContext2D, inputManager:CanvasInputManager){
        this.context = context;
        this.objectMap = {};
        this.inputManager = inputManager;
    }

    create(objectList:CanvasObject[]){
        for(let object of objectList)
            this.addObject(object);
    }

    update(delta:number){
        for(let object of Object.values(this.objectMap))
            object.update(delta);
    }

    draw(){
        for(let object of Object.values(this.objectMap))
            object.draw();
    }

    addObject(newObject:CanvasObject){
        this.objectMap[newObject.getId()] = newObject;
        newObject.handleCreate(this);
    }

    deleteObject(object:CanvasObject|number){
        let deleteId:number;
        if(object instanceof CanvasObject) deleteId = object.getId();
        else deleteId = object;
        delete this.objectMap[deleteId];
    }

    getObjects(){
        return Object.values(this.objectMap);
    }

    getObject(objectId:number){
        return this.objectMap[objectId];
    }

    getContext(){
        return this.context;
    }

    getInput(){
        return this.inputManager;
    }
}