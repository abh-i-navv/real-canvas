"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {Shape} from "../../shape"
import { DrawingElement, useDrawingContext } from '../context/drawing-context';
import { CanvasMode, LayerType, Point, shapeType } from '@/types/canvas';
import { ToolBar } from './toolbar';
import { elementFinder, pointerEventToCanvasPoint } from '@/lib/utils';
import { SelectionBox } from './selection-box';
import { RenderCanvas } from './render';

export const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const { elements, addElement, removeElement, pause, resume,updateElement,setCanvasState,canvasState, selection, setSelection } = useDrawingContext();
    const [camera, setCamera] = useState<Point>({x:0, y:0})
    const [currEle, setCurrEle] = useState<DrawingElement>()
    const [selectionBox, setSelectionBox] = useState<DrawingElement | DrawingElement[]>()

    useEffect(() => {
        const canvas = canvasRef.current;
        
        if(!canvas) return
        
        const ctx = canvas.getContext("2d")
        const options = {
            strokeStyle: "bevel",
            lineWidth: 5,
            lineJoin: "bevel"
          } 
          const generator = new Shape(ctx,options)
          
          // ctx?.clearRect(0,0,canvas.width,canvas.height)
          // ctx?.save()
          // ctx?.translate(camera.x,camera.y)
          // generator.draw(elements)
          // generator.draw([selectionBox])
          // ctx?.restore()
          RenderCanvas(canvas, options,elements, camera, selectionBox)

        const onPointerDown = (e: any) => {

            if(!e || !ctx){
                return
            }
            const point = pointerEventToCanvasPoint(e,camera)
            
            if(canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.None){
              const selectedEle = elementFinder({x:point.x, y:point.y}, elements)
              
              if(!selectedEle){
                setSelection([])
                setSelectionBox(undefined)
                return
              }
              const type = selectedEle.type as shapeType
              const newDimensions = {x:point.x, y:point.y}

              const {dimensions} = selectedEle

              if(dimensions.offsetX ){
                newDimensions.x -= dimensions.offsetX
              }
              if(dimensions.offsetY){
                newDimensions.y -= dimensions.offsetY
              }

              if(type === 'line'){
                const bounds = {
                  x: selectedEle.x1,
                  y: selectedEle.y1,
                  a: selectedEle.x2 + (dimensions.offsetX || 0),
                  b: selectedEle.y2 + (dimensions.offsetY || 0),
                  width: selectedEle.dimensions.w,
                  height: selectedEle.dimensions.h
                }
                SelectionBox(ctx,selectedEle.type, bounds, setSelectionBox)
                
              }

              else{
                const bounds = {
                  x: selectedEle.dimensions.x +(selectedEle.dimensions.offsetX || 0),
                  y:selectedEle.dimensions.y + (selectedEle.dimensions.offsetY || 0),
                  width: selectedEle.dimensions.w,
                  height: selectedEle.dimensions.h
                }
  
                SelectionBox(ctx,selectedEle.type, bounds, setSelectionBox)

              }

              setCurrEle(selectedEle)
              // const newSelection = [...selection]

              // const existingCheck = newSelection.find((el) => el.id === selectedEle.id)
              
              // if(!existingCheck){
              //   newSelection.push(selectedEle)
              //   setSelection(newSelection)
              // }

              const cloneEle = structuredClone(selectedEle)

              setCanvasState({mode: CanvasMode.Translating, current: newDimensions, id: selectedEle?.id,element: cloneEle})
              
            }


            else if(canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.Rectangle){
              setSelectionBox(undefined)
              setCanvasState({mode: CanvasMode.Inserting, layerType: LayerType.Rectangle})
              const rect:any = generator.rectangle(point.x,point.y,0,0)
              setCurrEle(rect)
              addElement(rect)
              
            }
            else if(canvasState.mode === CanvasMode.None && canvasState.layerType === LayerType.Line){
              setSelectionBox(undefined)
              setCanvasState({mode: CanvasMode.Inserting, layerType: LayerType.Line})
              const line:any = generator.line(point.x,point.y,point.x,point.y)
              setCurrEle(line)
              addElement(line)
              
            }
            
        }

        const onPointerUp = (e: any) => {
            if(!currEle){
                return
            }
            
            if(canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle){
              
              setCurrEle(undefined)

              setCanvasState({mode: CanvasMode.None, layerType: LayerType.Rectangle})
            }else if(canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Line){
              setCurrEle(undefined)

              setCanvasState({mode: CanvasMode.None, layerType: LayerType.Line})
            }
            else if(canvasState.mode === CanvasMode.Translating) {
              console.log(canvasState)
              RenderCanvas(canvas,options,elements,camera)
              console.log(elements)

              setCanvasState({mode: CanvasMode.None, layerType: LayerType.None})
            }
            else{

              setCanvasState({mode: CanvasMode.None, layerType: LayerType.None})
            }

        }

        const onPointerMove = (e: any) => {
          
          if(!currEle || !ctx){
            return
          }

          const point = pointerEventToCanvasPoint(e,camera)
          const type = currEle.type as shapeType

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
            
            if( type !== 'line' && Math.abs(point.y - currEle.dimensions.y - offsetY - currEle.dimensions.h ) <= threshold && point.x >= currEle.dimensions.x + offsetX && point.x <= currEle.dimensions.w + currEle.dimensions.x +offsetX){
              e.target.style.cursor = "ns-resize"

            }
            else if(type !== 'line' && Math.abs(point.x - (currEle.dimensions.w + currEle.dimensions.x + offsetX)) <= threshold && point.y >= currEle.dimensions.y + offsetY && point.y <= currEle.dimensions.y + offsetY + currEle.dimensions.h){
              e.target.style.cursor = "ew-resize"
            }
            else if(type === 'line' && Math.abs(point.x - (currEle.x2 + offsetX)) <= threshold && Math.abs(point.y - (currEle.y2 + offsetY)) <= threshold){
              e.target.style.cursor = "ew-resize"
            }
            else if(type === 'line' && Math.abs(point.x - (currEle.x1 + offsetX)) <= threshold && Math.abs(point.y - (currEle.y1 + offsetY)) <= threshold){
              e.target.style.cursor = "e-resize"
            }
            else{
              e.target.style.cursor = "context-menu"
            }
            

          }

          if(canvasState.mode === CanvasMode.Translating){

            if(e.target.style.cursor === 'ew-resize' || e.target.style.cursor === 'ns-resize' || e.target.style.cursor === 'e-resize'){
              let diffX = (point.x - canvasState.current.x )
              let diffY = point.y - canvasState.current.y 
              
              if(currEle.dimensions.offsetX){
                diffX -= currEle.dimensions.offsetX
              }
              if(currEle.dimensions.offsetY){
                diffY -= currEle.dimensions.offsetY
              }

              if(e.target.style.cursor === 'ew-resize'){
                // currEle.dimensions.h += diffY
                if(type === 'rectangle' && point.x > currEle.dimensions.x + (currEle.dimensions.offsetX ? currEle.dimensions.offsetX : 0)){
                  currEle.dimensions.w = canvasState.element.dimensions.w + diffX
                }
                if(type === 'line'){
                  currEle.x2 = canvasState.element.x2 + diffX
                  currEle.y2 = canvasState.element.y2 + diffY
                  currEle.dimensions.x = Math.min(currEle.x1,currEle.x2) 
                  currEle.dimensions.y = Math.min(currEle.y1,currEle.y2) 
                  currEle.dimensions.w = Math.abs(currEle.x2-currEle.x1)
                  currEle.dimensions.h = Math.abs(currEle.y2-currEle.y1)
                }

              }

              if(e.target.style.cursor === 'ns-resize'){
                
                if(type === 'rectangle' && point.y > currEle.dimensions.y + (currEle.dimensions.offsetY ? currEle.dimensions.offsetY : 0)){
                  currEle.dimensions.h = canvasState.element.dimensions.h + diffY
                }

              }
              if(e.target.style.cursor === 'e-resize'){
                
                if(type === 'line'){
                  currEle.x1 = canvasState.element.x1 + diffX
                  currEle.y1 = canvasState.element.y1 + diffY
                  currEle.dimensions.x = Math.min(currEle.x1,currEle.x2) 
                  currEle.dimensions.y = Math.min(currEle.y1,currEle.y2) 
                  currEle.dimensions.w = Math.abs(currEle.x2-currEle.x1)
                  currEle.dimensions.h = Math.abs(currEle.y2-currEle.y1)
                }
              }

              if(type === 'line'){
                const bounds = {
                  x: currEle.x1 + (currEle.dimensions.offsetX || 0),
                  y: currEle.y1 + (currEle.dimensions.offsetY || 0),
                  a: currEle.x2 + (currEle.dimensions.offsetX || 0),
                  b:currEle.y2 + (currEle.dimensions.offsetY || 0),
                  width: currEle.dimensions.w,
                  height: currEle.dimensions.h
                }
              
                const selectRect = SelectionBox(ctx,currEle.type ,bounds,setSelectionBox)

                RenderCanvas(canvas, options,elements, camera,selectRect)

              }
              else{

                const bounds = {
                  x: currEle.dimensions.x + (currEle.dimensions.offsetX || 0),
                  y: currEle.dimensions.y + (currEle.dimensions.offsetY || 0),
                  width: currEle.dimensions.w,
                  height: currEle.dimensions.h
                }
              
              const selectRect = SelectionBox(ctx,currEle.type ,bounds,setSelectionBox)
            
              RenderCanvas(canvas, options,elements, camera, selectRect)

            }
              
            }

            else{

              let offsetX = point.x - currEle.dimensions.x - ( canvasState.current.x - currEle.dimensions.x)
              let offsetY = point.y - currEle.dimensions.y - ( canvasState.current.y - currEle.dimensions.y)
              
              const temp = {...currEle}
              
              temp.dimensions.offsetX = offsetX
              temp.dimensions.offsetY = offsetY

              const bounds = {
                x: currEle.dimensions.x + offsetX,
                y: currEle.dimensions.y + offsetY,
                width: currEle.dimensions.w,
                height: currEle.dimensions.h
              }

              const selectRect = SelectionBox(ctx,currEle.type ,bounds,setSelectionBox)

              ctx.restore()
              
              RenderCanvas(canvas, options,elements, camera,selectRect)
            }

          }

          if(canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle){
            const newRect: any = generator.rectangle(Math.min(currEle.dimensions.x, point.x),Math.min(currEle.dimensions.y, point.y), Math.abs(currEle.dimensions.x - point.x), Math.abs(currEle.dimensions.y - point.y))
            updateElement(currEle.id, newRect)

            // ctx?.clearRect(0,0,canvas.width,canvas.height)
          
            // ctx?.save()
            // ctx?.translate(camera.x,camera.y)

            
            // generator.draw(elements)
            
            // ctx?.restore()

            RenderCanvas(canvas, options,elements, camera)
          }

          else if(canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Line) {
            const newRect: any = generator.line(currEle.dimensions.x,currEle.dimensions.y, point.x,  point.y)
            updateElement(currEle.id, newRect)

            // ctx?.clearRect(0,0,canvas.width,canvas.height)
          
            // ctx?.save()
            // ctx?.translate(camera.x,camera.y)

            
            // generator.draw(elements)
            
            // ctx?.restore()

            RenderCanvas(canvas, options,elements, camera)

          }


          

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