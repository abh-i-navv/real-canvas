import { cn } from "@/lib/utils";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";
import { Circle, Minus, MousePointer2, Square, Type, Pencil, Brush, Trash2 } from "lucide-react";
import { useDrawingContext } from "../context/drawing-context";

interface ToolBarProps {
    canvasState: CanvasState;
    setCanvasState: (state: CanvasState) => void;
    Clear: () => void
}

export const Sidebar = ({canvasState,setCanvasState, Clear}: ToolBarProps) => {

    const {selectedTool, setSelectedTool} = useDrawingContext()

    return(
        <div className="flex flex-col border-[#322560] border-2 mt-2 shadow-md rounded-lg lg:hidden shadow:md absolute left-0 h-auto w-16 ">
            <div className="h-full flex flex-col justify-center items-center">
                <div className={cn("m-2 p-2 hover:bg-[#b3aad5]", ((canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.None) || selectedTool === 'none') && "bg-[#b3aad5]")}>
                    <MousePointer2 className={''} onClick={() => {setCanvasState({mode: CanvasMode.None, layerType: LayerType.None})
                    setSelectedTool('none')
                }}/>
                </div>

            <div className={cn("m-2 p-2 hover:bg-[#b3aad5]", ((canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.Brush) || selectedTool === 'brush') &&  "bg-[#b3aad5]")}>

                <Brush className='' 
                    onClick={() => {
                        setCanvasState({mode: CanvasMode.None, layerType: LayerType.Brush})
                        setSelectedTool('brush')
                    }} 
                />
            </div>

            <div className={cn("m-2 p-2 hover:bg-[#b3aad5]", ((canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.Line) || selectedTool === 'line') && "bg-[#b3aad5]")}>
                <Minus className='' onClick={() => {setCanvasState({mode: CanvasMode.None, layerType: LayerType.Line})
                    setSelectedTool('line')
                }}/>
            </div>

            <div className={cn("m-2 p-2 hover:bg-[#b3aad5]", ((canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.Rectangle) || selectedTool === 'rectangle') && "bg-[#b3aad5]")} >
                <Square className=''
                    onClick={() => {setCanvasState({mode: CanvasMode.None, layerType: LayerType.Rectangle})
                    setSelectedTool('rectangle')
                }} 
                />
            </div>

            <div className={cn("m-2 p-2 hover:bg-[#b3aad5]", ((canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.Ellipse) || selectedTool === 'ellipse') && "bg-[#b3aad5]")} >
                <Circle className=''
                    onClick={() => {setCanvasState({mode: CanvasMode.None, layerType: LayerType.Ellipse})
                    setSelectedTool('ellipse')
                }} 
                />
            </div>

            <div className={cn("m-2 p-2 hover:bg-[#b3aad5]", ((canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.Text) || selectedTool === 'text') && "bg-[#b3aad5]")}>

                <Type className='' 
                    onClick={() => {setCanvasState({mode: CanvasMode.None, layerType: LayerType.Text})
                    setSelectedTool('text')
                }} 
                />
            </div>

            <div  onPointerDown={Clear}
                className={"m-2 p-2 hover:bg-[#b3aad5]"}
            >
            <Trash2 />
            </div>

            </div>


        </div>
    )

}