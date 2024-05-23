"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {Shape} from "../../shape"
import { DrawingElement, useDrawingContext } from '../context/drawing-context';
import { CanvasMode, LayerType, Point } from '@/types/canvas';
import { ToolBar } from './toolbar';
import { pointerEventToCanvasPoint } from '@/lib/utils';

export const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const { elements, addElement, removeElement, pause, resume,updateElement,setCanvasState,canvasState } = useDrawingContext();
    const [camera, setCamera] = useState<Point>({x:0, y:0})
    const [currEle, setCurrEle] = useState<DrawingElement>()

    useEffect(() => {
        const canvas = canvasRef.current;
        
        if(!canvas) return
        
        const ctx = canvas.getContext("2d")
        const options = {
            strokeStyle: "bevel",
            lineWidth: 1,
            lineJoin: "bevel"
          } 
          
          ctx?.clearRect(0,0,canvas.width,canvas.height)
          ctx?.save()
          ctx?.translate(camera.x,camera.y)
          const generator = new Shape(ctx,options)
          generator.draw(elements)
          ctx?.restore()

        const onPointerDown = (e: any) => {

            if(!e){
                return
            }
            const point = pointerEventToCanvasPoint(e,camera)

            if(canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.None){
              const selectedEle = elementFinder({x:point.x, y:point.y}, elements)
              
              if(!selectedEle){
                return
              }

              // console.log(selectedEle)

              const testing = {x:point.x, y:point.y}

              const {dimensions} = selectedEle

              if(dimensions.offsetX ){
                testing.x -= dimensions.offsetX
              }
              if(dimensions.offsetY){
                testing.y -= dimensions.offsetY
              }

              setCurrEle(selectedEle)
              setCanvasState({mode: CanvasMode.Translating, current: testing})
              
            }


            else if(canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.Rectangle){
              setCanvasState({mode: CanvasMode.Inserting, layerType: LayerType.Rectangle})
              const rect:any = generator.rectangle(point.x,point.y,point.x,point.y)
              setCurrEle(rect)
              addElement(rect)
              
            }
            
        }

        const onPointerUp = (e: any) => {
            if(!currEle){
                return
            }

            setCurrEle(undefined)
            if(canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle){

             

              setCanvasState({mode: CanvasMode.None, layerType: LayerType.Rectangle})
            }
            else{
              // console.log(currEle)
              setCanvasState({mode: CanvasMode.None, layerType: LayerType.None})
            }

        }

        const onPointerMove = (e: any) => {
          
          if(!currEle){
            return
          }

          const point = pointerEventToCanvasPoint(e,camera)

          if(canvasState.mode === CanvasMode.Translating){

            let offsetX = point.x - currEle.dimensions.x - ( canvasState.current.x - currEle.dimensions.x)
            let offsetY = point.y - currEle.dimensions.y - ( canvasState.current.y - currEle.dimensions.y)
            
            const temp = {...currEle}

            temp.dimensions.offsetX = offsetX
            temp.dimensions.offsetY = offsetY

            updateElement(currEle.id, temp)

            ctx?.clearRect(0,0,canvas.width,canvas.height)

            ctx?.save()
            ctx?.translate(camera.x,camera.y)
            
            generator.draw(elements)

            ctx?.restore()
            // generator.translate()

          }


          if(canvasState.mode !== CanvasMode.Inserting || canvasState.layerType !== LayerType.Rectangle){
            return
          }


          ctx?.clearRect(0,0,canvas.width,canvas.height)
          
          ctx?.save()
          ctx?.translate(camera.x,camera.y)

          const newRect: any = generator.rectangle(currEle.dimensions.x,currEle.dimensions.y, point.x, point.y)
          updateElement(currEle.id, newRect)
          
          generator.draw(elements)
          
          ctx?.restore()

        }
        
        canvas.addEventListener("pointerdown", onPointerDown)
        document.addEventListener("pointerup", onPointerUp)
        canvas.addEventListener("pointermove", onPointerMove)

        return () => {
            canvas.removeEventListener("pointerdown", onPointerDown)
            document.removeEventListener("pointerup", onPointerUp)
            canvas.removeEventListener("pointermove", onPointerMove)
        }
        
    }, [elements, dimensions,canvasState,camera]);

    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x -e.deltaX,
            y: camera.y -e.deltaY
        }))
    },[])

    useEffect(() => {
        if (typeof window !== 'undefined') {
          const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
          };
    
          handleResize(); // Set initial dimensions
          window.addEventListener('resize', handleResize);
    
          return () => {
            window.removeEventListener('resize', handleResize);
          };
        }
      }, [camera]);

    return (
        <>
            <ToolBar canvasState={canvasState} setCanvasState={setCanvasState}/>
            <canvas className='bg-blue-50' height={ dimensions.height} width={dimensions.width} ref={canvasRef} onWheel={onWheel}/>
        </>
    );
};

export const elementFinder = (point: Point, elements: Map<string, DrawingElement>): DrawingElement | null => {
  const entries = Array.from(elements.entries());

  for (let i = 0; i < entries.length; i++) {
    const [key, el] = entries[i];
    const { x, y, w, h,offsetX,offsetY } = el.dimensions;

    if (x+(offsetX ? offsetX : 0) <= point.x && y+(offsetY ? offsetY : 0) <= point.y && x + w + (offsetX ? offsetX : 0) >= point.x && y + h + (offsetY ? offsetY : 0) >= point.y) {
      return el;
    }
  }

  return null;
};