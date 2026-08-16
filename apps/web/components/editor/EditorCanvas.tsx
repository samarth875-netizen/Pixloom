"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { Upload, Image as ImageIcon, Sparkles, Crop, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

interface DragState {
  layerId: string;
  startX: number;
  startY: number;
  layerX: number;
  layerY: number;
}

interface ResizeState {
  layerId: string;
  handle: ResizeHandle;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  origW: number;
  origH: number;
  origFontSize?: number;
}

const HANDLE_SIZE = 9;
const HANDLES: ResizeHandle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

export function EditorCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);

  const {
    canvasWidth,
    canvasHeight,
    setCanvasSize,
    zoom,
    setZoom,
    pan,
    setPan,
    layers,
    activeLayerId,
    setActiveLayerId,
    addLayer,
    updateLayer,
    activeTool,
    brushSize,
    brushColor,
    brushOpacity,
    adjustments,
    isComparing,
    cropRect,
    setCropRect,
    applyCrop,
    renderCounter,
    triggerRender,
    setBrushColor,
    recordHistory,
  } = useEditorStore();

  const [isPanning, setIsPanning] = useState(false);
  const [startPanPos, setStartPanPos] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);

  // Drag & drop state
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Crop drag state
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [cropDragStart, setCropDragStart] = useState({ x: 0, y: 0 });

  // Handle image upload from file or URL
  const loadImageFile = useCallback(
    (file: File) => {
      useEditorStore.getState().importImage(file);
    },
    []
  );

  // Load sample demo image
  const loadSampleImage = (type: "portrait" | "landscape" | "neon") => {
    const sampleImages = {
      portrait:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=80",
      landscape:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
      neon:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (layers.length === 0) {
        setCanvasSize(img.width, img.height);
      }

      const layerCanvas = document.createElement("canvas");
      layerCanvas.width = img.width;
      layerCanvas.height = img.height;
      const ctx = layerCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }

      addLayer({
        name: `Sample (${type})`,
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
    img.src = sampleImages[type];
  };

  // Convert mouse event coordinates to Canvas coordinates
  const getCanvasCoords = (e: React.MouseEvent | MouseEvent) => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Find the top-most visible & unlocked layer at a canvas point
  const hitTestLayer = useCallback(
    (x: number, y: number) => {
      for (let i = layers.length - 1; i >= 0; i--) {
        const layer = layers[i];
        if (!layer.visible || layer.locked) continue;
        if (
          x >= layer.x &&
          x <= layer.x + layer.width &&
          y >= layer.y &&
          y <= layer.y + layer.height
        ) {
          return layer;
        }
      }
      return null;
    },
    [layers]
  );

  // Render all layers and adjustments onto main canvas
  useEffect(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear main canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Apply adjustments filter string if not comparing
    if (!isComparing) {
      const b = 100 + adjustments.brightness;
      const c = 100 + adjustments.contrast;
      const s = 100 + adjustments.saturation;
      const h = adjustments.hueRotate;
      const blur = adjustments.blur;
      const gray = adjustments.grayscale;
      const sepia = adjustments.sepia;
      const invert = adjustments.invert;

      ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) hue-rotate(${h}deg) blur(${blur}px) grayscale(${gray}%) sepia(${sepia}%) invert(${invert}%)`;
    } else {
      ctx.filter = "none";
    }

    // Render layers from bottom to top
    layers.forEach((layer) => {
      if (!layer.visible) return;

      ctx.save();
      ctx.globalAlpha = layer.opacity / 100;
      ctx.globalCompositeOperation =
        layer.blendMode === "normal"
          ? "source-over"
          : (layer.blendMode as GlobalCompositeOperation);

      if (layer.canvas) {
        ctx.drawImage(layer.canvas, layer.x, layer.y, layer.width, layer.height);
      } else if (layer.type === "text" && layer.text) {
        ctx.font = `bold ${layer.fontSize || 48}px sans-serif`;
        ctx.fillStyle = layer.textColor || "#FFFFFF";
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 8;
        ctx.fillText(layer.text, layer.x, layer.y + (layer.fontSize || 48));
      } else if (layer.type === "shape") {
        ctx.fillStyle = layer.textColor || "#F5F547";
        ctx.beginPath();
        if (layer.shapeType === "rect") {
          ctx.roundRect(layer.x, layer.y, layer.width, layer.height, 16);
        } else if (layer.shapeType === "circle") {
          ctx.arc(
            layer.x + layer.width / 2,
            layer.y + layer.height / 2,
            layer.width / 2,
            0,
            Math.PI * 2
          );
        } else if (layer.shapeType === "star") {
          const cx = layer.x + layer.width / 2;
          const cy = layer.y + layer.height / 2;
          const spikes = 5;
          const outerRadius = layer.width / 2;
          const innerRadius = outerRadius / 2;
          let rot = (Math.PI / 2) * 3;
          let step = Math.PI / spikes;

          ctx.moveTo(cx, cy - outerRadius);
          for (let i = 0; i < spikes; i++) {
            let x = cx + Math.cos(rot) * outerRadius;
            let y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
          }
          ctx.lineTo(cx, cy - outerRadius);
        }
        ctx.fill();
      }

      ctx.restore();
    });

    // Reset filter
    ctx.filter = "none";
  }, [
    canvasWidth,
    canvasHeight,
    layers,
    adjustments,
    isComparing,
    renderCounter,
  ]);

  // Handle the "move" tool drag on window level for robustness
  useEffect(() => {
    if (!dragState && !resizeState) return;

    const handleMove = (e: MouseEvent) => {
      const coords = getCanvasCoords(e);

      if (dragState) {
        const dx = coords.x - dragState.startX;
        const dy = coords.y - dragState.startY;
        const nextX = Math.max(-9999, Math.min(canvasWidth - 1, dragState.layerX + dx));
        const nextY = Math.max(-9999, Math.min(canvasHeight - 1, dragState.layerY + dy));
        updateLayer(dragState.layerId, { x: nextX, y: nextY });
      }

      if (resizeState) {
        const { handle, startX, startY, origX, origY, origW, origH, origFontSize } =
          resizeState;
        const dx = coords.x - startX;
        const dy = coords.y - startY;

        let x = origX;
        let y = origY;
        let w = origW;
        let h = origH;

        if (handle.includes("e")) w = origW + dx;
        if (handle.includes("s")) h = origH + dy;
        if (handle.includes("w")) {
          w = origW - dx;
          x = origX + dx;
        }
        if (handle.includes("n")) {
          h = origH - dy;
          y = origY + dy;
        }

        w = Math.max(20, Math.min(canvasWidth, w));
        h = Math.max(20, Math.min(canvasHeight, h));

        if (handle.includes("w")) x = origX + origW - w;
        if (handle.includes("n")) y = origY + origH - h;

        const updates: { x: number; y: number; width: number; height: number; fontSize?: number } = {
          x,
          y,
          width: w,
          height: h,
        };
        if (origFontSize && origW > 0) {
          updates.fontSize = Math.max(8, Math.round(origFontSize * (w / origW)));
        }
        updateLayer(resizeState.layerId, updates);
      }
    };

    const handleUp = () => {
      if (dragState) {
        recordHistory("Move Layer");
        setDragState(null);
      }
      if (resizeState) {
        recordHistory("Resize Layer");
        setResizeState(null);
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [
    dragState,
    resizeState,
    canvasWidth,
    canvasHeight,
    updateLayer,
    recordHistory,
  ]);

  // Compute resize handle position within canvas coordinates
  const handlePosition = (handle: ResizeHandle, layer: { x: number; y: number; width: number; height: number }) => {
    const half = HANDLE_SIZE / 2;
    let x = layer.x;
    let y = layer.y;
    if (handle.includes("e")) x = layer.x + layer.width;
    if (handle.includes("s")) y = layer.y + layer.height;
    if (handle.includes("n")) y = layer.y;
    if (handle.includes("w")) x = layer.x;
    return { left: x - half, top: y - half };
  };

  const handleResizeHandleMouseDown = (
    e: React.MouseEvent,
    layerId: string,
    handle: ResizeHandle,
    layer: { x: number; y: number; width: number; height: number; fontSize?: number }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const coords = getCanvasCoords(e);
    setResizeState({
      layerId,
      handle,
      startX: coords.x,
      startY: coords.y,
      origX: layer.x,
      origY: layer.y,
      origW: layer.width,
      origH: layer.height,
      origFontSize: layer.fontSize,
    });
  };

  // Drawing handlers (Brush, Eraser, Eyedropper, Move/Select)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Middle click or alt-drag pan
    if (e.button === 1 || e.altKey) {
      setIsPanning(true);
      setStartPanPos({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    const coords = getCanvasCoords(e);

    // Move / Select tool
    if (activeTool === "move") {
      const layer = hitTestLayer(coords.x, coords.y);
      if (layer) {
        setActiveLayerId(layer.id);
        setDragState({
          layerId: layer.id,
          startX: coords.x,
          startY: coords.y,
          layerX: layer.x,
          layerY: layer.y,
        });
      } else {
        setActiveLayerId(null);
      }
      return;
    }

    // Eyedropper tool
    if (activeTool === "eyedropper") {
      const canvas = mainCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const pixel = ctx.getImageData(Math.round(coords.x), Math.round(coords.y), 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
        .toString(16)
        .slice(1)}`;
      setBrushColor(hex);
      return;
    }

    // Brush or Eraser drawing
    if (activeTool === "brush" || activeTool === "eraser") {
      let activeLayer = layers.find((l) => l.id === activeLayerId);

      // If no drawing layer, create one automatically
      if (!activeLayer || !activeLayer.canvas) {
        const drawCanvas = document.createElement("canvas");
        drawCanvas.width = canvasWidth;
        drawCanvas.height = canvasHeight;

        const newId = `layer-${Date.now()}`;
        addLayer({
          id: newId,
          name: "Paint Layer",
          type: "drawing",
          visible: true,
          locked: false,
          opacity: 100,
          blendMode: "normal",
          canvas: drawCanvas,
          x: 0,
          y: 0,
          width: canvasWidth,
          height: canvasHeight,
        });
      }

      setIsDrawing(true);
      setLastPoint(coords);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPanPos.x, y: e.clientY - startPanPos.y });
      return;
    }

    if (!isDrawing || !lastPoint) return;

    const coords = getCanvasCoords(e);
    const activeLayer = layers.find((l) => l.id === activeLayerId);
    if (!activeLayer || !activeLayer.canvas) return;

    const ctx = activeLayer.canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (activeTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
      ctx.globalAlpha = brushOpacity / 100;
    }

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    ctx.restore();

    setLastPoint(coords);
    triggerRender();
  };

  const handleMouseUp = () => {
    if (isPanning) setIsPanning(false);
    if (isDrawing) {
      setIsDrawing(false);
      setLastPoint(null);
      recordHistory(activeTool === "eraser" ? "Erase Stroke" : "Brush Stroke");
    }
  };

  // Double-click a text layer to edit its content
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    const layer = hitTestLayer(coords.x, coords.y);
    if (!layer || layer.type !== "text") return;

    setActiveLayerId(layer.id);
    const textVal = prompt("Edit text:", layer.text ?? "");
    if (textVal !== null) {
      updateLayer(layer.id, {
        text: textVal,
        name: `Text (${textVal.slice(0, 8)})` || "Text",
      });
      recordHistory("Edit Text");
    }
  };

  // Drag & drop upload handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      loadImageFile(e.dataTransfer.files[0]);
    }
  };

  // Active layer for selection overlay
  const activeLayer = activeLayerId
    ? layers.find((l) => l.id === activeLayerId && l.visible && l.type !== "drawing")
    : null;
  const showSelection = activeTool === "move" && activeLayer;

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex-1 bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center select-none"
      style={{
        cursor:
          activeTool === "brush"
            ? "crosshair"
            : activeTool === "eyedropper"
            ? "cell"
            : activeTool === "move"
            ? isPanning || dragState
              ? "grabbing"
              : "default"
            : "default",
      }}
    >
      {/* Top and Left Rulers */}
      <div className="absolute top-0 left-0 right-0 h-5 bg-[#121212] border-b border-white/10 z-20 flex items-center text-[9px] font-mono text-[#9CA3AF] px-4 pointer-events-none opacity-50 justify-between">
        <span>0px</span>
        <span>{Math.round(canvasWidth / 2)}px</span>
        <span>{canvasWidth}px</span>
      </div>
      <div className="absolute top-5 left-0 bottom-0 w-5 bg-[#121212] border-r border-white/10 z-20 flex flex-col justify-between items-center text-[9px] font-mono text-[#9CA3AF] py-4 pointer-events-none opacity-50">
        <span>0</span>
        <span>{Math.round(canvasHeight / 2)}</span>
        <span>{canvasHeight}</span>
      </div>

      {/* Empty State / Initial Upload Prompt */}
      {layers.length === 0 && (
        <div className="z-20 max-w-lg w-full p-8 bg-[#171717]/95 backdrop-blur-md rounded-3xl border border-white/10 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#F5F547]/15 text-[#F5F547] border border-[#F5F547]/30 flex items-center justify-center mx-auto shadow-inner">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Start Your Project</h2>
            <p className="text-sm text-[#9CA3AF]">
              Drag & drop any image (PNG, JPG, WebP) or pick a sample photo to start editing.
            </p>
          </div>

          {/* File Picker Button */}
          <div className="pt-2">
            <label className="cursor-pointer inline-block">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    loadImageFile(e.target.files[0]);
                  }
                }}
              />
              <span className="inline-flex items-center justify-center font-bold rounded-full bg-[#F5F547] text-black px-7 py-3 text-sm hover:brightness-105 transition-all shadow-lg shadow-[#F5F547]/15">
                Upload from Device
              </span>
            </label>
          </div>

          {/* Sample Photos Grid */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
              Or Try A Preset Template
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => loadSampleImage("portrait")}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all flex flex-col items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#F5F547]" />
                Portrait
              </button>
              <button
                onClick={() => loadSampleImage("landscape")}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all flex flex-col items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#F5F547]" />
                Landscape
              </button>
              <button
                onClick={() => loadSampleImage("neon")}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all flex flex-col items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#F5F547]" />
                Cyber Neon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Viewport with Zoom & Pan */}
      <div
        className="relative transition-transform duration-75 shadow-2xl"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: canvasWidth,
          height: canvasHeight,
        }}
      >
        {/* Checkerboard Transparency Pattern */}
        <div
          className="absolute inset-0 rounded-lg shadow-2xl"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #1f1f1f 25%, transparent 25%), linear-gradient(-45deg, #1f1f1f 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f1f1f 75%), linear-gradient(-45deg, transparent 75%, #1f1f1f 75%)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            backgroundColor: "#121212",
          }}
        />

        {/* The Master Render Canvas */}
        <canvas
          ref={mainCanvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          className="relative z-10 rounded-lg block"
          style={{ width: canvasWidth, height: canvasHeight }}
        />

        {/* Selection Overlay (Canva-style move & resize) */}
        {showSelection && activeLayer && (
          <div
            className="absolute z-20 border border-[#F5F547] pointer-events-none"
            style={{
              left: activeLayer.x,
              top: activeLayer.y,
              width: activeLayer.width,
              height: activeLayer.height,
            }}
          >
            {/* Resize Handles */}
            {HANDLES.map((handle) => {
              const pos = handlePosition(handle, activeLayer);
              const cursorMap: Record<ResizeHandle, string> = {
                nw: "nwse-resize",
                n: "ns-resize",
                ne: "nesw-resize",
                e: "ew-resize",
                se: "nwse-resize",
                s: "ns-resize",
                sw: "nesw-resize",
                w: "ew-resize",
              };
              return (
                <div
                  key={handle}
                  onMouseDown={(e) =>
                    handleResizeHandleMouseDown(e, activeLayer.id, handle, activeLayer)
                  }
                  className="absolute bg-[#F5F547] border border-black pointer-events-auto"
                  style={{
                    width: HANDLE_SIZE,
                    height: HANDLE_SIZE,
                    left: pos.left,
                    top: pos.top,
                    cursor: cursorMap[handle],
                    boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Interactive Crop Box Overlay */}
        {activeTool === "crop" && (
          <div className="absolute inset-0 z-30 pointer-events-auto bg-black/60 flex items-center justify-center">
            <div
              className="relative border-2 border-[#F5F547] shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
              style={{
                width: cropRect.width || canvasWidth * 0.8,
                height: cropRect.height || canvasHeight * 0.8,
              }}
            >
              {/* Rule of Thirds Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>

              {/* Crop Corner Resize Handles */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#F5F547] border border-black cursor-nwse-resize" />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#F5F547] border border-black cursor-nesw-resize" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#F5F547] border border-black cursor-nesw-resize" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#F5F547] border border-black cursor-nwse-resize" />

              {/* Crop Action Buttons */}
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#171717] px-3 py-1.5 rounded-full border border-white/20 shadow-2xl">
                <button
                  onClick={applyCrop}
                  className="flex items-center gap-1 bg-[#F5F547] text-black font-bold text-xs px-3 py-1 rounded-full hover:brightness-110"
                >
                  <Check className="w-3.5 h-3.5" /> Apply
                </button>
                <button
                  onClick={() => useEditorStore.getState().setActiveTool("move")}
                  className="flex items-center gap-1 text-white hover:text-[#9CA3AF] text-xs px-2 py-1"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dragging over highlight overlay */}
      {isDraggingOver && (
        <div className="absolute inset-0 bg-[#F5F547]/10 border-4 border-dashed border-[#F5F547] z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-[#171717] text-white px-8 py-4 rounded-2xl border border-white/20 font-bold text-lg flex items-center gap-3">
            <Upload className="w-6 h-6 text-[#F5F547]" />
            Drop Image to Add Layer
          </div>
        </div>
      )}
    </div>
  );
}
