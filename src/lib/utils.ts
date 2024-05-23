import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Camera {
  x:number;
  y:number;
}

export function pointerEventToCanvasPoint(e: React.PointerEvent, camera: Camera){
  return{
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y
  }
}