import { DrawingElement } from "@/app/context/drawing-context";
import { Point } from "@/types/canvas";
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

export const elementFinder = (point: Point, elements: Map<string, DrawingElement>): DrawingElement | null => {
  const entries = Array.from(elements.entries());

  for (let i = 0; i < entries.length; i++) {
    const [key, el] = entries[i];
    const { x, y, w, h,offsetX,offsetY } = el.dimensions;

    if (x+(offsetX ? offsetX : 0) <= point.x + 5 && y+(offsetY ? offsetY : 0) <= point.y + 5 && x + w + (offsetX ? offsetX : 0) >= point.x - 5 && y + h + (offsetY ? offsetY : 0) >= point.y - 5) {
      return el;
    }
  }

  return null;
};

