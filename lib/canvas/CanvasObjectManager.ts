import CanvasObject from "./CanvasObject";

export default class CanvasObjectManager{
    private context:CanvasRenderingContext2D;
    private objectMap:{[id:number]:CanvasObject};

    constructor(context:CanvasRenderingContext2D){
        this.context = context;
        this.objectMap = {};
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
        newObject.init(this);
        this.objectMap[newObject.getId()] = newObject;
        newObject.create();
    }

    deleteObject(object:CanvasObject|number){
        let deleteId:number;
        if(object instanceof CanvasObject) deleteId = object.getId();
        else deleteId = object;
        delete this.objectMap[deleteId];
    }

    getObject(objectId:number){
        return this.objectMap[objectId];
    }

    getContext(){
        return this.context;
    }
}