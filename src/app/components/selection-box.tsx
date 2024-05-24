import { CanvasState } from "@/types/canvas";
import { DrawingElement, useDrawingContext } from "../context/drawing-context"
import { useEffect } from "react";
import { selectionBounds } from "@/hooks/selection-bounds";

interface SelectionBoxProps{
    element: DrawingElement | undefined;
    state: CanvasState;
}

export const SelectionBox = () => {

    const {selection,elements,canvasState} = useDrawingContext()

    useEffect(() => {
        if(!selection.length){
            return
        }
        
        console.log(selection)
    
        if(elements == undefined){
            return
        } 
        
    },[selection])

    const bounds = selectionBounds(selection)

    if(!bounds){
        return
    }

    console.log(bounds)

    return(
        <div className="border-2 border-blue-500 absolute "
            style={{top: bounds.y, left: bounds.x, height: bounds.h, width: bounds.w}}
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()}}
        >
            
        </div>
    )
}