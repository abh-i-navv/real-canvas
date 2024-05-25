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
    Translate
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
          | LayerType.Translate;
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
        h: number;
        w: number;
      }
    | {
        mode: CanvasMode.Inserting;
        layerType:
          | LayerType.Ellipse
          | LayerType.Rectangle
          | LayerType.Text
          | LayerType.Note;
        current?: Point;
      }
    | {
        mode: CanvasMode.Resizing;
        initialBounds: XYWH;
        corner: Side;
      }
    | {
        mode: CanvasMode.Pencil;
      };