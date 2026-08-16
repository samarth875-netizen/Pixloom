export type ToolType =
  | "move"
  | "lasso"
  | "crop"
  | "brush"
  | "eraser"
  | "stamp"
  | "text"
  | "shapes"
  | "eyedropper";

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "soft-light";

export interface Adjustments {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  exposure: number; // -100 to 100
  temperature: number; // -100 to 100
  hueRotate: number; // -180 to 180
  blur: number; // 0 to 50px
  grayscale: number; // 0 to 100%
  sepia: number; // 0 to 100%
  invert: number; // 0 to 100%
  vignette: number; // 0 to 100%
  curves: {
    r: number;
    g: number;
    b: number;
    rgb: number;
  };
}

export interface Layer {
  id: string;
  name: string;
  type: "image" | "drawing" | "text" | "shape";
  visible: boolean;
  locked: boolean;
  opacity: number; // 0 to 100
  blendMode: BlendMode;
  canvas: HTMLCanvasElement | null;
  text?: string;
  textColor?: string;
  fontSize?: number;
  shapeType?: "rect" | "circle" | "star";
  x: number;
  y: number;
  width: number;
  height: number;
  previewUrl?: string;
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number | null; // null for freeform
}

export interface HistoryStep {
  description: string;
  timestamp: number;
  layers: {
    id: string;
    name: string;
    type: "image" | "drawing" | "text" | "shape";
    visible: boolean;
    locked: boolean;
    opacity: number;
    blendMode: BlendMode;
    dataUrl: string | null;
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
    textColor?: string;
    fontSize?: number;
  }[];
  adjustments: Adjustments;
  canvasWidth: number;
  canvasHeight: number;
}
