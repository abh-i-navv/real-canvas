import { cn } from "@/lib/utils";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";
import { Circle, Minus, MousePointer2, Square, Type } from "lucide-react";

interface ToolBarProps {
    canvasState: CanvasState;
    setCanvasState: (state: CanvasState) => void;
}

export const ToolBar = ({canvasState,setCanvasState}: ToolBarProps) => {


    return(
        <div className="h-10 w-80 border-2 rounded-md absolute left-[50%] top-0 z-10">
            <div className="h-full flex justify-center items-center">
                <MousePointer2 className={cn("m-5 hover:bg-purple-300", canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.None && "bg-purple-300")} onClick={() => setCanvasState({mode: CanvasMode.None, layerType: LayerType.None})}/>
                <Minus className={cn("m-5 hover:bg-purple-300", canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.Line && "bg-purple-300")} onClick={() => setCanvasState({mode: CanvasMode.None, layerType: LayerType.Line})}/>
                <Square className={cn("m-5 hover:bg-purple-300", canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.Rectangle && "bg-purple-300")} 
                    onClick={() => setCanvasState({mode: CanvasMode.None, layerType: LayerType.Rectangle})} 
                />
                <Circle className={cn("m-5 hover:bg-purple-300", canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.Ellipse && "bg-purple-300")} 
                    onClick={() => setCanvasState({mode: CanvasMode.None, layerType: LayerType.Ellipse})} 
                />
                <Type className={cn("m-5 hover:bg-purple-300", canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.Text && "bg-purple-300")} 
                    onClick={() => setCanvasState({mode: CanvasMode.None, layerType: LayerType.Text})} 
                />

            </div>


        </div>
    )

}