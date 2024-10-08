import { CanvasInput } from "./CanvasInput";
import CanvasObjectManager from "./CanvasObjectManager";

export default abstract class CanvasObject{
    static nextId:number = 0;

    private id:number;
    private objectManager:CanvasObjectManager|undefined;

    constructor(){
        this.id = CanvasObject.nextId++;
    }
    
    //Abtsract
    abstract create():void;
    abstract update(delta:number):void;
    abstract draw():void;

    //Don't use
    init(objectManager:CanvasObjectManager){
        this.objectManager = objectManager;
    }

    getId(){
        return this.id;
    }
    
    //utils
    getContext(){
        return this.objectManager?.getContext() as CanvasRenderingContext2D;
    }

    getInput(){
        return this.objectManager?.getInput() as CanvasInput;
    }

    instanceObject(newObject:CanvasObject){
        this.objectManager?.addObject(newObject);
    }

    destroy(object:CanvasObject = this){
        this.objectManager?.deleteObject(object);
    }
}