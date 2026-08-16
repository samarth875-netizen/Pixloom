"use client";

import React, { useState } from "react";
import {
  Move,
  Lasso,
  Crop,
  Paintbrush,
  Eraser,
  Stamp,
  Type,
  Square,
  Pipette,
  Circle,
  Star,
  Sliders,
} from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { ToolType } from "@/types/editor";

export function EditorToolRail() {
  const {
    activeTool,
    setActiveTool,
    brushSize,
    setBrushSize,
    brushColor,
    setBrushColor,
    brushOpacity,
    setBrushOpacity,
    secondaryColor,
    setSecondaryColor,
    activeShape,
    setActiveShape,
    addLayer,
    canvasWidth,
    canvasHeight,
  } = useEditorStore();

  const [brushSettingsOpen, setBrushSettingsOpen] = useState(false);
  const [shapesMenuOpen, setShapesMenuOpen] = useState(false);

  const tools: { id: ToolType; label: string; icon: React.ElementType; shortcut: string }[] = [
    { id: "move", label: "Move / Select", icon: Move, shortcut: "V" },
    { id: "lasso", label: "Lasso Select", icon: Lasso, shortcut: "M" },
    { id: "crop", label: "Crop & Resize", icon: Crop, shortcut: "C" },
    { id: "brush", label: "Brush Tool", icon: Paintbrush, shortcut: "B" },
    { id: "eraser", label: "Eraser Tool", icon: Eraser, shortcut: "E" },
    { id: "stamp", label: "Clone Stamp / Retouch", icon: Stamp, shortcut: "S" },
    { id: "text", label: "Add Text", icon: Type, shortcut: "T" },
    { id: "shapes", label: "Vector Shapes", icon: Square, shortcut: "U" },
    { id: "eyedropper", label: "Eyedropper", icon: Pipette, shortcut: "I" },
  ];

  const handleToolClick = (toolId: ToolType) => {
    setActiveTool(toolId);
    if (toolId === "brush") {
      setBrushSettingsOpen(!brushSettingsOpen);
    } else {
      setBrushSettingsOpen(false);
    }

    if (toolId === "shapes") {
      setShapesMenuOpen(!shapesMenuOpen);
    } else {
      setShapesMenuOpen(false);
    }

    if (toolId === "text") {
      // Prompt user to add text overlay
      const textVal = prompt("Enter text to add to canvas:", "Pixloom");
      if (textVal) {
        addLayer({
          name: `Text (${textVal.slice(0, 8)})`,
          type: "text",
          visible: true,
          locked: false,
          opacity: 100,
          blendMode: "normal",
          canvas: null,
          text: textVal,
          textColor: brushColor,
          fontSize: 48,
          x: canvasWidth / 2 - 100,
          y: canvasHeight / 2,
          width: 300,
          height: 80,
        });
      }
    }
  };

  const handleAddShape = (shape: "rect" | "circle" | "star") => {
    setActiveShape(shape);
    setShapesMenuOpen(false);
    setActiveTool("shapes");

    // Add new shape layer
    addLayer({
      name: `${shape.toUpperCase()} Shape`,
      type: "shape",
      shapeType: shape,
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: "normal",
      canvas: null,
      textColor: brushColor,
      x: canvasWidth / 2 - 100,
      y: canvasHeight / 2 - 100,
      width: 200,
      height: 200,
    });
  };

  return (
    <aside className="w-16 bg-[#121212] border-r border-white/[0.08] flex flex-col items-center py-4 justify-between z-30 select-none relative">
      {/* Top Tools */}
      <div className="flex flex-col items-center gap-1.5 w-full px-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;

          return (
            <div key={tool.id} className="relative group">
              <button
                onClick={() => handleToolClick(tool.id)}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-[#F5F547] text-black shadow-lg shadow-[#F5F547]/20 font-bold"
                    : "text-[#9CA3AF] hover:text-white hover:bg-white/5"
                }`}
                title={`${tool.label} (${tool.shortcut})`}
                aria-label={tool.label}
              >
                <Icon className="w-5 h-5" />
              </button>

              {/* Tooltip */}
              <div className="absolute left-14 top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-[#1c1c1c] text-white text-xs font-semibold rounded-md border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 flex items-center gap-1.5">
                <span>{tool.label}</span>
                <span className="text-[10px] text-[#F5F547] bg-black/60 px-1 rounded font-mono">
                  {tool.shortcut}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Brush Settings Flyout Panel */}
      {brushSettingsOpen && activeTool === "brush" && (
        <div className="absolute left-16 top-28 bg-[#171717] border border-white/15 rounded-2xl p-4 shadow-2xl w-60 z-50 text-white space-y-4 animate-in fade-in slide-in-from-left-2 duration-150">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Paintbrush className="w-3.5 h-3.5 text-[#F5F547]" />
              Brush Properties
            </span>
            <button
              onClick={() => setBrushSettingsOpen(false)}
              className="text-xs text-[#9CA3AF] hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Size */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-[#9CA3AF]">
              <span>Size</span>
              <span className="text-white font-mono">{brushSize}px</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full accent-[#F5F547] cursor-pointer"
            />
          </div>

          {/* Opacity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-[#9CA3AF]">
              <span>Opacity</span>
              <span className="text-white font-mono">{brushOpacity}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={brushOpacity}
              onChange={(e) => setBrushOpacity(Number(e.target.value))}
              className="w-full accent-[#F5F547] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Shapes Flyout Menu */}
      {shapesMenuOpen && activeTool === "shapes" && (
        <div className="absolute left-16 top-64 bg-[#171717] border border-white/15 rounded-2xl p-3 shadow-2xl w-44 z-50 text-white space-y-2 animate-in fade-in slide-in-from-left-2 duration-150">
          <p className="text-[11px] font-bold text-[#9CA3AF] uppercase px-1">
            Add Shape
          </p>
          <button
            onClick={() => handleAddShape("rect")}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/10 text-white transition-colors"
          >
            <Square className="w-4 h-4 text-[#F5F547]" /> Rectangle
          </button>
          <button
            onClick={() => handleAddShape("circle")}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/10 text-white transition-colors"
          >
            <Circle className="w-4 h-4 text-[#F5F547]" /> Ellipse / Circle
          </button>
          <button
            onClick={() => handleAddShape("star")}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/10 text-white transition-colors"
          >
            <Star className="w-4 h-4 text-[#F5F547]" /> Star Badge
          </button>
        </div>
      )}

      {/* Bottom: Color Swatch Pickers */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <div className="relative w-9 h-9">
          {/* Primary Color Picker */}
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            className="absolute top-0 left-0 w-7 h-7 rounded-lg cursor-pointer border-2 border-white/20 shadow-md bg-transparent z-20 appearance-none p-0 overflow-hidden"
            title="Primary Brush Color"
          />
          {/* Secondary Color Picker */}
          <input
            type="color"
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
            className="absolute bottom-0 right-0 w-6 h-6 rounded-md cursor-pointer border border-white/40 shadow bg-transparent z-10 appearance-none p-0 overflow-hidden"
            title="Secondary Color"
          />
        </div>
      </div>
    </aside>
  );
}
