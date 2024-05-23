"use client"

import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";
import { createContext, useContext, useState } from "react";

export interface DrawingElement {
    id: string;
    type: 'rectangle';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    dimensions: {
        x: number;
        y: number;
        h: number;
        w: number;
        offsetX?: number;
        offsetY?: number;
        options?: any
    }
    // Add other properties as needed
  }

export interface DrawingContextType {
    elements: Map<string, DrawingElement>;
    addElement: (element: DrawingElement) => void;
    removeElement: (id: string) => void;
    pause: () => void;
    resume: () => void;
    updateElement: (e: string, element:DrawingElement) => void;
    canvasState: CanvasState;
    setCanvasState: (newState: CanvasState) => void;
  }

const DrawingContext = createContext<DrawingContextType | undefined>(undefined)

const DrawingProvider = ({children} : Readonly<{
    children: React.ReactNode;
  }>) => {
    const [elements, setElements] = useState(new Map())
    const [isPaused,setIsPaused] = useState(false)
    const [canvasState,setCanvasState] = useState<CanvasState>({mode: CanvasMode.None, layerType: LayerType.None})

    const addElement = (element: DrawingElement | undefined) => {
        if(isPaused){
            return
        }
        if(!element){
            return
        }
        setElements((prevElements) => {
          const newElements = new Map(prevElements);
          newElements.set(element.id, element);
          return newElements;
        });
      };
    
      const removeElement = (id: string) => {
        setElements((prevElements) => {
          const newElements = new Map(prevElements);
          newElements.delete(id);
          return newElements;
        });
      };

      const updateElement = (id: string, element: DrawingElement) => {
        elements.set(id, element)
      }

      const pause = () => {
        setIsPaused(true)
      }

      const resume = () => {
        setIsPaused(false)
      }

      return (
        <DrawingContext.Provider value={{ elements, addElement, removeElement,pause , resume,updateElement,canvasState,setCanvasState }}>
          {children}
        </DrawingContext.Provider>
      );

}   

const useDrawingContext = () => {
    const context = useContext(DrawingContext);
    if (context === undefined) {
      throw new Error('useDrawingContext must be used within a DrawingProvider');
    }
    return context;
  };
  
  export { DrawingProvider, useDrawingContext };