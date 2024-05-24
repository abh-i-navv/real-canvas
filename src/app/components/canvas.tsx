"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {Shape} from "../../shape"
import { DrawingElement, useDrawingContext } from '../context/drawing-context';
import { CanvasMode, LayerType, Point } from '@/types/canvas';
import { ToolBar } from './toolbar';
import { elementFinder, pointerEventToCanvasPoint } from '@/lib/utils';
import { SelectionBox } from './selection-box';

export const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const { elements, addElement, removeElement, pause, resume,updateElement,setCanvasState,canvasState, selection, setSelection } = useDrawingContext();
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

              const newDimensions = {x:point.x, y:point.y}

              const {dimensions} = selectedEle

              if(dimensions.offsetX ){
                newDimensions.x -= dimensions.offsetX
              }
              if(dimensions.offsetY){
                newDimensions.y -= dimensions.offsetY
              }

              setCurrEle(selectedEle)
              const newSelection = [...selection]

              const existingCheck = newSelection.find((el) => el.id === selectedEle.id)
              
              if(!existingCheck){
                newSelection.push(selectedEle)
                setSelection(newSelection)
              }
              
              console.log(selectedEle.dimensions.w)

              setCanvasState({mode: CanvasMode.Translating, current: newDimensions, id: selectedEle?.id, w: selectedEle.dimensions.w, h: selectedEle.dimensions.h})
              
            }


            else if(canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.Rectangle){
              setCanvasState({mode: CanvasMode.Inserting, layerType: LayerType.Rectangle})
              const rect:any = generator.rectangle(point.x,point.y,0,0)
              setCurrEle(rect)
              addElement(rect)
              
            }
            
        }

        const onPointerUp = (e: any) => {
            if(!currEle){
                return
            }

            
            if(canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle){
              
              setCurrEle(undefined)

              setCanvasState({mode: CanvasMode.None, layerType: LayerType.Rectangle})
            }
            else{
              console.log(currEle.dimensions)
              setCanvasState({mode: CanvasMode.None, layerType: LayerType.None})
            }

        }

        const onPointerMove = (e: any) => {
          
          if(!currEle){
            return
          }

          const point = pointerEventToCanvasPoint(e,camera)

          if(canvasState.mode === CanvasMode.None){

            const threshold = 5

            let offsetX = 0
            let offsetY = 0

            if(currEle.dimensions.offsetX){
              offsetX = currEle.dimensions.offsetX
            }

            if(currEle.dimensions.offsetY){
              offsetY = currEle.dimensions.offsetY
            }
            
            if(Math.abs(point.y - currEle.dimensions.y - offsetY - currEle.dimensions.h ) <= threshold && point.x >= currEle.dimensions.x + offsetX && point.x <= currEle.dimensions.w + currEle.dimensions.x +offsetX){
              e.target.style.cursor = "ns-resize"

            }
            else if(Math.abs(point.x - (currEle.dimensions.w + currEle.dimensions.x + offsetX)) <= threshold && point.y >= currEle.dimensions.y + offsetY && point.y <= currEle.dimensions.y + offsetY + currEle.dimensions.h){
              e.target.style.cursor = "ew-resize"
            }
            else{
              e.target.style.cursor = "context-menu"
            }
            

          }

          if(canvasState.mode === CanvasMode.Translating){

            if(e.target.style.cursor === 'ew-resize' || e.target.style.cursor === 'ns-resize'){
              let diffX = (point.x - canvasState.current.x )
              let diffY = point.y - canvasState.current.y 
              
              console.log(canvasState.w)

              if(currEle.dimensions.offsetX){
                diffX -= currEle.dimensions.offsetX
              }
              if(currEle.dimensions.offsetY){
                diffY -= currEle.dimensions.offsetY
              }

              ctx?.clearRect(0,0,canvas.width,canvas.height)

              ctx?.save()
              ctx?.translate(camera.x,camera.y)
              generator.draw(elements)
              ctx?.restore()

              if(e.target.style.cursor === 'ew-resize'){
                // currEle.dimensions.h += diffY
                if(point.x > currEle.dimensions.x + (currEle.dimensions.offsetX ? currEle.dimensions.offsetX : 0)){
                  currEle.dimensions.w = canvasState.w + diffX
                }

              }

              if(e.target.style.cursor === 'ns-resize'){
                // currEle.dimensions.h += diffY
                if(point.y > currEle.dimensions.y + (currEle.dimensions.offsetY ? currEle.dimensions.offsetY : 0)){
                  currEle.dimensions.h = canvasState.h + diffY
                }

              }
              
            }

            else{

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

          }

          if(canvasState.mode !== CanvasMode.Inserting || canvasState.layerType !== LayerType.Rectangle){
            return
          }


          ctx?.clearRect(0,0,canvas.width,canvas.height)
          
          ctx?.save()
          ctx?.translate(camera.x,camera.y)

          const newRect: any = generator.rectangle(Math.min(currEle.dimensions.x, point.x),Math.min(currEle.dimensions.y, point.y), Math.abs(currEle.dimensions.x - point.x), Math.abs(currEle.dimensions.y - point.y))
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
            {/* <SelectionBox /> */}
        </>
    );
};
