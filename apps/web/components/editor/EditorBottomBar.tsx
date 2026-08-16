"use client";

import React from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { History, Layers, ZoomIn } from "lucide-react";

export function EditorBottomBar() {
  const {
    history,
    historyIndex,
    canvasWidth,
    canvasHeight,
    activeTool,
    brushColor,
    zoom,
    layers,
  } = useEditorStore();

  const currentStep = history[historyIndex];

  return (
    <footer className="h-9 w-full bg-[#0E0E0E] border-t border-white/[0.08] px-4 flex items-center justify-between text-[11px] text-[#9CA3AF] select-none z-30">
      {/* Left: Active Tool & Color */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-medium text-white">
          <span className="w-2 h-2 rounded-full bg-[#F5F547]" />
          <span className="capitalize">{activeTool} Tool</span>
        </div>

        <div className="h-3 w-px bg-white/10" />

        <div className="flex items-center gap-1.5 font-mono">
          <span
            className="w-3 h-3 rounded-full border border-white/20"
            style={{ backgroundColor: brushColor }}
          />
          <span>{brushColor.toUpperCase()}</span>
        </div>
      </div>

      {/* Center: History Timeline Step */}
      <div className="hidden md:flex items-center gap-2 font-mono">
        <History className="w-3.5 h-3.5 text-[#F5F547]" />
        <span>{currentStep ? currentStep.description : "Initial State"}</span>
        <span className="text-[#9CA3AF]/60">
          ({historyIndex + 1}/{Math.max(1, history.length)})
        </span>
      </div>

      {/* Right: Resolution & Zoom */}
      <div className="flex items-center gap-4 font-mono">
        <div className="flex items-center gap-1">
          <Layers className="w-3 h-3 text-[#9CA3AF]" />
          <span>{layers.length} Layers</span>
        </div>

        <div className="h-3 w-px bg-white/10" />

        <span>
          {canvasWidth} × {canvasHeight} px
        </span>

        <div className="h-3 w-px bg-white/10" />

        <span className="text-white font-semibold">{Math.round(zoom * 100)}%</span>
      </div>
    </footer>
  );
}
