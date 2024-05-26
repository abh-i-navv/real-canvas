import { cn } from "@/lib/utils";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";
import { Minus, MousePointer2, Square } from "lucide-react";

interface ToolBarProps {
    canvasState: CanvasState;
    setCanvasState: (state: CanvasState) => void;
}

export const ToolBar = ({canvasState,setCanvasState}: ToolBarProps) => {


    return(
        <div className="h-10 w-60 border-2 rounded-md absolute left-[50%] top-0 z-10">
            <div className="h-full flex justify-center items-center">
                <Square className={cn("m-5 hover:bg-purple-300", canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.Rectangle && "bg-purple-300")} 
                    onClick={() => setCanvasState({mode: CanvasMode.None, layerType: LayerType.Rectangle})} 
                />
                <MousePointer2 className={cn("m-5 hover:bg-purple-300", canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.None && "bg-purple-300")} onClick={() => setCanvasState({mode: CanvasMode.None, layerType: LayerType.None})}/>
                <Minus className={cn("m-5 hover:bg-purple-300", canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.Line && "bg-purple-300")} onClick={() => setCanvasState({mode: CanvasMode.None, layerType: LayerType.Line})}/>
            </div>


        </div>
    )

}