import { DrawingElement } from "@/app/context/drawing-context";

export interface Point{
    x: number;
    y:number
}

export enum LayerType {
    Text,
    Note,
    Rectangle,
    Ellipse,
    Path,
    None,
    Translate,
    Line,
    Pencil
  }

export enum CanvasMode {
    None,
    Pressing,
    SelectionNet,
    Translating,
    Inserting,
    Resizing,
    Pencil,
}

export type XYWH = {
    x: number;
    y: number;
    a?: number;
    b?: number;
    width: number;
    height: number;
  };

  export enum Side {
    Top = 1,
    Bottom = 2,
    Left = 4,
    Right = 8,
  }

export type CanvasState =
    | {
        mode: CanvasMode.None;
        layerType?:
          | LayerType.Ellipse
          | LayerType.Rectangle
          | LayerType.Text
          | LayerType.Note
          | LayerType.None
          | LayerType.Translate
          | LayerType.Line
          | LayerType.Pencil;
      }
    | {
        mode: CanvasMode.Pressing;
        origin: Point;
      }
    | {
        mode: CanvasMode.SelectionNet;
        origin: Point;
        current?: Point;
      }
    | {
        mode: CanvasMode.Translating;
        current: Point;
        id?: string;
        element: DrawingElement;
      }
    | {
        mode: CanvasMode.Inserting;
        layerType:
          | LayerType.Ellipse
          | LayerType.Rectangle
          | LayerType.Text
          | LayerType.Note
          | LayerType.Line
          | LayerType.Pencil;
        current?: Point | Point[] | any;
      }
    | {
        mode: CanvasMode.Resizing;
        initialBounds: XYWH;
        corner: Side;
      }
    | {
        mode: CanvasMode.Pencil;
      };

export type shapeType = "rectangle" | "line" | "ellipse"