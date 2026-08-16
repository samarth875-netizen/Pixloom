import { create } from "zustand";
import { ToolType, BlendMode, Adjustments, Layer, HistoryStep, CropRect } from "@/types/editor";
import type { Project } from "@/store/useProjectStore";

export const defaultAdjustments: Adjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  temperature: 0,
  hueRotate: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  vignette: 0,
  curves: {
    r: 0,
    g: 0,
    b: 0,
    rgb: 0,
  },
};

interface EditorState {
  projectName: string;
  setProjectName: (name: string) => void;

  projectId: string | null;
  setProjectId: (id: string | null) => void;

  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;

  brushSize: number;
  setBrushSize: (size: number) => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushOpacity: number;
  setBrushOpacity: (opacity: number) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;

  canvasWidth: number;
  canvasHeight: number;
  setCanvasSize: (width: number, height: number) => void;

  zoom: number;
  setZoom: (zoom: number) => void;
  pan: { x: number; y: number };
  setPan: (pan: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  fitToScreen: () => void;

  layers: Layer[];
  activeLayerId: string | null;
  setActiveLayerId: (id: string | null) => void;
  addLayer: (layer: Omit<Layer, "id"> & { id?: string }) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  removeLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  reorderLayers: (startIndex: number, endIndex: number) => void;
  clearLayers: () => void;
  importImage: (file: File) => void;

  loadProject: (project: Project) => void;

  adjustments: Adjustments;
  setAdjustment: <K extends keyof Adjustments>(key: K, value: Adjustments[K]) => void;
  setAllAdjustments: (adjustments: Adjustments) => void;
  resetAdjustments: () => void;
  autoEnhance: () => void;

  isComparing: boolean;
  setIsComparing: (comparing: boolean) => void;

  cropRect: CropRect;
  setCropRect: (crop: Partial<CropRect>) => void;
  applyCrop: () => void;

  // History / Undo / Redo
  history: HistoryStep[];
  historyIndex: number;
  recordHistory: (description: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Export
  exportFormat: "png" | "jpg" | "webp";
  setExportFormat: (format: "png" | "jpg" | "webp") => void;
  exportQuality: number;
  setExportQuality: (quality: number) => void;
  exportScale: number;
  setExportScale: (scale: number) => void;

  // Text & Shape tool settings
  textColor: string;
  setTextColor: (color: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  activeShape: "rect" | "circle" | "star";
  setActiveShape: (shape: "rect" | "circle" | "star") => void;

  // Active layer trigger redraw
  renderCounter: number;
  triggerRender: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  projectName: "Untitled Project",
  setProjectName: (name) => set({ projectName: name }),

  projectId: null,
  setProjectId: (id) => set({ projectId: id }),

  activeTool: "move",
  setActiveTool: (tool) => set({ activeTool: tool }),

  brushSize: 16,
  setBrushSize: (size) => set({ brushSize: size }),
  brushColor: "#F5F547",
  setBrushColor: (color) => set({ brushColor: color }),
  brushOpacity: 100,
  setBrushOpacity: (opacity) => set({ brushOpacity: opacity }),
  secondaryColor: "#000000",
  setSecondaryColor: (color) => set({ secondaryColor: color }),

  canvasWidth: 1200,
  canvasHeight: 800,
  setCanvasSize: (width, height) => {
    set({ canvasWidth: width, canvasHeight: height });
    get().recordHistory("Resize Canvas");
  },

  zoom: 1,
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),
  pan: { x: 0, y: 0 },
  setPan: (pan) =>
    set((state) => ({
      pan: typeof pan === "function" ? pan(state.pan) : pan,
    })),
  fitToScreen: () => {
    set({ zoom: 0.85, pan: { x: 0, y: 0 } });
  },

  layers: [],
  activeLayerId: null,
  setActiveLayerId: (id) => set({ activeLayerId: id }),

  addLayer: (layerData) => {
    const id = layerData.id || `layer-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newLayer: Layer = {
      ...layerData,
      id,
    };
    set((state) => ({
      layers: [...state.layers, newLayer],
      activeLayerId: id,
    }));
    get().triggerRender();
    get().recordHistory(`Add ${newLayer.name}`);
  },

  updateLayer: (id, updates) => {
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
    get().triggerRender();
  },

  removeLayer: (id) => {
    const state = get();
    const layer = state.layers.find((l) => l.id === id);
    if (!layer) return;

    const remaining = state.layers.filter((l) => l.id !== id);
    const nextActive = remaining.length > 0 ? remaining[remaining.length - 1].id : null;

    set({
      layers: remaining,
      activeLayerId: nextActive,
    });
    get().triggerRender();
    get().recordHistory(`Delete ${layer.name}`);
  },

  duplicateLayer: (id) => {
    const state = get();
    const target = state.layers.find((l) => l.id === id);
    if (!target) return;

    // Clone canvas if exists
    let clonedCanvas: HTMLCanvasElement | null = null;
    if (target.canvas) {
      clonedCanvas = document.createElement("canvas");
      clonedCanvas.width = target.canvas.width;
      clonedCanvas.height = target.canvas.height;
      const ctx = clonedCanvas.getContext("2d");
      if (ctx) ctx.drawImage(target.canvas, 0, 0);
    }

    const newId = `layer-${Date.now()}`;
    const duplicated: Layer = {
      ...target,
      id: newId,
      name: `${target.name} (Copy)`,
      canvas: clonedCanvas,
      x: target.x + 20,
      y: target.y + 20,
    };

    set({
      layers: [...state.layers, duplicated],
      activeLayerId: newId,
    });
    get().triggerRender();
    get().recordHistory(`Duplicate ${target.name}`);
  },

  reorderLayers: (startIndex, endIndex) => {
    const state = get();
    const result = Array.from(state.layers);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    set({ layers: result });
    get().triggerRender();
    get().recordHistory("Reorder Layers");
  },

  clearLayers: () => {
    set({ layers: [], activeLayerId: null });
    get().triggerRender();
    get().recordHistory("Clear Canvas");
  },

  importImage: (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        const state = get();
        // Resize the canvas to match the imported image when it's the first layer
        if (state.layers.length === 0) {
          state.setCanvasSize(img.width, img.height);
        }

        const layerCanvas = document.createElement("canvas");
        layerCanvas.width = img.width;
        layerCanvas.height = img.height;
        const ctx = layerCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }

        state.addLayer({
          name: file.name.slice(0, 18) || "Uploaded Image",
          type: "image",
          visible: true,
          locked: false,
          opacity: 100,
          blendMode: "normal",
          canvas: layerCanvas,
          x: 0,
          y: 0,
          width: img.width,
          height: img.height,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  },

  loadProject: (project) => {
    const layers: Layer[] = project.layers.map((sl) => {
      let canvas: HTMLCanvasElement | null = null;
      if (sl.dataUrl) {
        canvas = document.createElement("canvas");
        canvas.width = sl.width;
        canvas.height = sl.height;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = sl.dataUrl;
        img.onload = () => {
          if (ctx) ctx.drawImage(img, 0, 0);
          get().triggerRender();
        };
      }
      return {
        id: sl.id,
        name: sl.name,
        type: sl.type,
        visible: sl.visible,
        locked: sl.locked,
        opacity: sl.opacity,
        blendMode: sl.blendMode as BlendMode,
        canvas,
        text: sl.text,
        textColor: sl.textColor,
        fontSize: sl.fontSize,
        shapeType: sl.shapeType,
        x: sl.x,
        y: sl.y,
        width: sl.width,
        height: sl.height,
      };
    });

    set({
      projectName: project.name,
      canvasWidth: project.canvasWidth,
      canvasHeight: project.canvasHeight,
      layers,
      activeLayerId: layers.length > 0 ? layers[layers.length - 1].id : null,
      adjustments: { ...project.adjustments },
      activeTool: "move",
      zoom: 1,
      pan: { x: 0, y: 0 },
    });
    get().triggerRender();
    get().recordHistory(`Open ${project.name}`);
  },

  adjustments: defaultAdjustments,
  setAdjustment: (key, value) => {
    set((state) => ({
      adjustments: {
        ...state.adjustments,
        [key]: value,
      },
    }));
    get().triggerRender();
  },
  setAllAdjustments: (adjustments) => {
    set({ adjustments });
    get().triggerRender();
  },
  resetAdjustments: () => {
    set({ adjustments: defaultAdjustments });
    get().triggerRender();
    get().recordHistory("Reset Adjustments");
  },
  autoEnhance: () => {
    set({
      adjustments: {
        ...defaultAdjustments,
        brightness: 6,
        contrast: 14,
        saturation: 18,
        exposure: 4,
        temperature: 2,
      },
    });
    get().triggerRender();
    get().recordHistory("Auto Enhance");
  },

  isComparing: false,
  setIsComparing: (comparing) => set({ isComparing: comparing }),

  cropRect: {
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    aspectRatio: null,
  },
  setCropRect: (crop) =>
    set((state) => ({
      cropRect: { ...state.cropRect, ...crop },
    })),
  applyCrop: () => {
    const state = get();
    const { x, y, width, height } = state.cropRect;
    if (width <= 10 || height <= 10) return;

    // Crop all layers
    const croppedLayers = state.layers.map((layer) => {
      if (!layer.canvas) return layer;
      const newCanvas = document.createElement("canvas");
      newCanvas.width = width;
      newCanvas.height = height;
      const ctx = newCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(layer.canvas, x, y, width, height, 0, 0, width, height);
      }
      return {
        ...layer,
        canvas: newCanvas,
        width,
        height,
        x: 0,
        y: 0,
      };
    });

    set({
      canvasWidth: Math.round(width),
      canvasHeight: Math.round(height),
      layers: croppedLayers,
      activeTool: "move",
    });
    get().triggerRender();
    get().recordHistory("Crop Canvas");
  },

  // History implementation
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,

  recordHistory: (description) => {
    const state = get();
    const snapshotLayers = state.layers.map((l) => ({
      id: l.id,
      name: l.name,
      type: l.type,
      visible: l.visible,
      locked: l.locked,
      opacity: l.opacity,
      blendMode: l.blendMode,
      dataUrl: l.canvas ? l.canvas.toDataURL() : null,
      x: l.x,
      y: l.y,
      width: l.width,
      height: l.height,
      text: l.text,
      textColor: l.textColor,
      fontSize: l.fontSize,
    }));

    const newStep: HistoryStep = {
      description,
      timestamp: Date.now(),
      layers: snapshotLayers,
      adjustments: { ...state.adjustments },
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
    };

    const trimmed = state.history.slice(0, state.historyIndex + 1);
    const updated = [...trimmed, newStep].slice(-30); // keep last 30 steps

    set({
      history: updated,
      historyIndex: updated.length - 1,
      canUndo: updated.length > 1,
      canRedo: false,
    });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex <= 0) return;

    const targetIndex = state.historyIndex - 1;
    const targetStep = state.history[targetIndex];
    if (!targetStep) return;

    // Restore layers
    const restoredLayers: Layer[] = targetStep.layers.map((sl) => {
      let canvas: HTMLCanvasElement | null = null;
      if (sl.dataUrl) {
        canvas = document.createElement("canvas");
        canvas.width = sl.width;
        canvas.height = sl.height;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = sl.dataUrl;
        img.onload = () => {
          if (ctx) ctx.drawImage(img, 0, 0);
          state.triggerRender();
        };
      }
      return {
        id: sl.id,
        name: sl.name,
        type: sl.type,
        visible: sl.visible,
        locked: sl.locked,
        opacity: sl.opacity,
        blendMode: sl.blendMode,
        canvas,
        x: sl.x,
        y: sl.y,
        width: sl.width,
        height: sl.height,
        text: sl.text,
        textColor: sl.textColor,
        fontSize: sl.fontSize,
      };
    });

    set({
      historyIndex: targetIndex,
      layers: restoredLayers,
      adjustments: { ...targetStep.adjustments },
      canvasWidth: targetStep.canvasWidth,
      canvasHeight: targetStep.canvasHeight,
      canUndo: targetIndex > 0,
      canRedo: true,
    });
    state.triggerRender();
  },

  redo: () => {
    const state = get();
    if (state.historyIndex >= state.history.length - 1) return;

    const targetIndex = state.historyIndex + 1;
    const targetStep = state.history[targetIndex];
    if (!targetStep) return;

    const restoredLayers: Layer[] = targetStep.layers.map((sl) => {
      let canvas: HTMLCanvasElement | null = null;
      if (sl.dataUrl) {
        canvas = document.createElement("canvas");
        canvas.width = sl.width;
        canvas.height = sl.height;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = sl.dataUrl;
        img.onload = () => {
          if (ctx) ctx.drawImage(img, 0, 0);
          state.triggerRender();
        };
      }
      return {
        id: sl.id,
        name: sl.name,
        type: sl.type,
        visible: sl.visible,
        locked: sl.locked,
        opacity: sl.opacity,
        blendMode: sl.blendMode,
        canvas,
        x: sl.x,
        y: sl.y,
        width: sl.width,
        height: sl.height,
        text: sl.text,
        textColor: sl.textColor,
        fontSize: sl.fontSize,
      };
    });

    set({
      historyIndex: targetIndex,
      layers: restoredLayers,
      adjustments: { ...targetStep.adjustments },
      canvasWidth: targetStep.canvasWidth,
      canvasHeight: targetStep.canvasHeight,
      canUndo: true,
      canRedo: targetIndex < state.history.length - 1,
    });
    state.triggerRender();
  },

  exportFormat: "png",
  setExportFormat: (format) => set({ exportFormat: format }),
  exportQuality: 92,
  setExportQuality: (quality) => set({ exportQuality: quality }),
  exportScale: 1,
  setExportScale: (scale) => set({ exportScale: scale }),

  textColor: "#FFFFFF",
  setTextColor: (color) => set({ textColor: color }),
  fontSize: 48,
  setFontSize: (size) => set({ fontSize: size }),
  activeShape: "rect",
  setActiveShape: (shape) => set({ activeShape: shape }),

  renderCounter: 0,
  triggerRender: () => set((state) => ({ renderCounter: state.renderCounter + 1 })),
}));
