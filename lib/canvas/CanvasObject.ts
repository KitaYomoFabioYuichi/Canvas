import { CanvasInput } from "./CanvasInput";
import CanvasObjectManager from "./CanvasObjectManager";

export default abstract class CanvasObject{
    static nextId:number = 0;

    private id:number;
    private objectManager:CanvasObjectManager|undefined;
    private created:boolean;

    constructor(){
        this.id = CanvasObject.nextId++;
        this.created = false;
    }
    
    //Abtsract
    abstract create():void;
    abstract update(delta:number):void;
    abstract draw():void;

    //Don't use
    getId(){
        return this.id;
    }
    
    handleCreate(objectManager:CanvasObjectManager){
        this.objectManager = objectManager;
        if(!this.created) this.create();
    }

    //utils
    getContext(){
        return this.objectManager?.getContext() as CanvasRenderingContext2D;
    }

    getInput(){
        return this.objectManager?.getInput() as CanvasInput;
    }

    getObjects(){
        return this.objectManager?.getObjects() as CanvasObject[];
    }

    instanceObject(newObject:CanvasObject){
        this.objectManager?.addObject(newObject);
    }

    destroy(object:CanvasObject = this){
        this.objectManager?.deleteObject(object);
    }
}