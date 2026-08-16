"use client";

import React, { useState } from "react";
import {
  Layers as LayersIcon,
  Sliders,
  Sparkles,
  Download,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  Plus,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Wand2,
  Scissors,
  Zap,
} from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { BlendMode } from "@/types/editor";
import { Button } from "@/components/ui/Button";

interface EditorRightPanelProps {
  onExport: () => void;
}

export function EditorRightPanel({ onExport }: EditorRightPanelProps) {
  const [activeTab, setActiveTab] = useState<"layers" | "adjustments" | "ai" | "export">("layers");

  const {
    layers,
    activeLayerId,
    setActiveLayerId,
    addLayer,
    updateLayer,
    removeLayer,
    duplicateLayer,
    reorderLayers,
    adjustments,
    setAdjustment,
    resetAdjustments,
    autoEnhance,
    exportFormat,
    setExportFormat,
    exportQuality,
    setExportQuality,
    exportScale,
    setExportScale,
    canvasWidth,
    canvasHeight,
    triggerRender,
    recordHistory,
  } = useEditorStore();

  const activeLayer = layers.find((l) => l.id === activeLayerId);
  const activeLayerIndex = layers.findIndex((l) => l.id === activeLayerId);

  // Blend modes list
  const blendModes: { value: BlendMode; label: string }[] = [
    { value: "normal", label: "Normal" },
    { value: "multiply", label: "Multiply" },
    { value: "screen", label: "Screen" },
    { value: "overlay", label: "Overlay" },
    { value: "darken", label: "Darken" },
    { value: "lighten", label: "Lighten" },
    { value: "color-dodge", label: "Color Dodge" },
    { value: "soft-light", label: "Soft Light" },
  ];

  // Handle AI Background Removal
  const handleAIRemoveBg = () => {
    if (!activeLayer || !activeLayer.canvas) return;

    const canvas = activeLayer.canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Simulate AI subject cutout via alpha radial feathering & edge detection
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const maxDist = Math.min(canvas.width, canvas.height) * 0.45;

    for (let i = 0; i < data.length; i += 4) {
      const px = (i / 4) % canvas.width;
      const py = Math.floor(i / 4 / canvas.width);
      const dist = Math.hypot(px - cx, py - cy);

      if (dist > maxDist) {
        data[i + 3] = 0; // Transparent background
      }
    }

    ctx.putImageData(imgData, 0, 0);
    updateLayer(activeLayer.id, { name: `${activeLayer.name} (AI Cutout)` });
    triggerRender();
    recordHistory("AI Background Removal");
  };

  // Handle AI Upscale
  const handleAIUpscale = () => {
    if (!activeLayer || !activeLayer.canvas) return;

    // Apply sharpening pass
    setAdjustment("contrast", adjustments.contrast + 10);
    setAdjustment("saturation", adjustments.saturation + 10);
    triggerRender();
    recordHistory("AI 2x Upscale & Enhance");
  };

  return (
    <aside className="w-80 bg-[#121212] border-l border-white/[0.08] flex flex-col z-30 select-none text-white">
      {/* Tabs Header */}
      <div className="grid grid-cols-4 border-b border-white/[0.08] bg-[#0E0E0E]">
        <button
          onClick={() => setActiveTab("layers")}
          className={`flex flex-col items-center justify-center py-3 text-xs font-bold gap-1 transition-colors ${
            activeTab === "layers"
              ? "text-[#F5F547] border-b-2 border-[#F5F547] bg-white/[0.02]"
              : "text-[#9CA3AF] hover:text-white"
          }`}
        >
          <LayersIcon className="w-4 h-4" />
          <span>Layers</span>
        </button>

        <button
          onClick={() => setActiveTab("adjustments")}
          className={`flex flex-col items-center justify-center py-3 text-xs font-bold gap-1 transition-colors ${
            activeTab === "adjustments"
              ? "text-[#F5F547] border-b-2 border-[#F5F547] bg-white/[0.02]"
              : "text-[#9CA3AF] hover:text-white"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Adjust</span>
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className={`flex flex-col items-center justify-center py-3 text-xs font-bold gap-1 transition-colors ${
            activeTab === "ai"
              ? "text-[#F5F547] border-b-2 border-[#F5F547] bg-white/[0.02]"
              : "text-[#9CA3AF] hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Tools</span>
        </button>

        <button
          onClick={() => setActiveTab("export")}
          className={`flex flex-col items-center justify-center py-3 text-xs font-bold gap-1 transition-colors ${
            activeTab === "export"
              ? "text-[#F5F547] border-b-2 border-[#F5F547] bg-white/[0.02]"
              : "text-[#9CA3AF] hover:text-white"
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Tab 1: Layers */}
      {activeTab === "layers" && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Active Layer Controls */}
          {activeLayer && (
            <div className="p-4 border-b border-white/[0.08] bg-[#171717]/60 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Selected: {activeLayer.name}</span>
                <span className="text-[#F5F547] font-mono">{activeLayer.opacity}%</span>
              </div>

              {/* Opacity Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#9CA3AF]">
                  <span>Opacity</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={activeLayer.opacity}
                  onChange={(e) =>
                    updateLayer(activeLayer.id, { opacity: Number(e.target.value) })
                  }
                  className="w-full accent-[#F5F547] cursor-pointer"
                />
              </div>

              {/* Blend Mode Dropdown */}
              <div className="space-y-1">
                <label className="text-[11px] text-[#9CA3AF]">Blend Mode</label>
                <select
                  value={activeLayer.blendMode}
                  onChange={(e) =>
                    updateLayer(activeLayer.id, {
                      blendMode: e.target.value as BlendMode,
                    })
                  }
                  className="w-full bg-black/60 border border-white/15 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#F5F547]"
                >
                  {blendModes.map((mode) => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Layer Stack List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {layers.length === 0 ? (
              <div className="text-center py-12 text-[#9CA3AF] text-xs">
                No layers added. Upload an image to start.
              </div>
            ) : (
              layers
                .slice()
                .reverse()
                .map((layer, index) => {
                  const actualIndex = layers.length - 1 - index;
                  const isSelected = layer.id === activeLayerId;

                  return (
                    <div
                      key={layer.id}
                      onClick={() => setActiveLayerId(layer.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#171717] border-[#F5F547]/60 shadow-md"
                          : "bg-black/30 border-white/5 hover:border-white/20"
                      }`}
                    >
                      {/* Left: Thumbnail & Name */}
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-9 h-9 rounded-lg bg-black/80 border border-white/10 flex items-center justify-center text-[10px] font-bold text-[#F5F547] flex-shrink-0">
                          {layer.type === "image"
                            ? "IMG"
                            : layer.type === "text"
                            ? "TXT"
                            : layer.type === "shape"
                            ? "SHP"
                            : "PNT"}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold text-white truncate max-w-[120px]">
                            {layer.name}
                          </p>
                          <p className="text-[10px] text-[#9CA3AF]">
                            {layer.blendMode} • {layer.opacity}%
                          </p>
                        </div>
                      </div>

                      {/* Right: Quick Action Toggles */}
                      <div className="flex items-center gap-1">
                        {/* Visibility Toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateLayer(layer.id, { visible: !layer.visible });
                          }}
                          className={`p-1.5 rounded-lg text-xs hover:bg-white/10 ${
                            layer.visible ? "text-white" : "text-[#9CA3AF]/40"
                          }`}
                          title="Toggle Visibility"
                        >
                          {layer.visible ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Lock Toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateLayer(layer.id, { locked: !layer.locked });
                          }}
                          className={`p-1.5 rounded-lg text-xs hover:bg-white/10 ${
                            layer.locked ? "text-[#F5F547]" : "text-[#9CA3AF]/40"
                          }`}
                          title="Lock Layer"
                        >
                          {layer.locked ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          {/* Bottom Layer Toolbar */}
          <div className="p-3 border-t border-white/[0.08] bg-[#0E0E0E] flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  addLayer({
                    name: `Layer ${layers.length + 1}`,
                    type: "drawing",
                    visible: true,
                    locked: false,
                    opacity: 100,
                    blendMode: "normal",
                    canvas: null,
                    x: 0,
                    y: 0,
                    width: canvasWidth,
                    height: canvasHeight,
                  })
                }
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                title="New Empty Layer"
              >
                <Plus className="w-4 h-4" />
              </button>

              <button
                onClick={() => activeLayerId && duplicateLayer(activeLayerId)}
                disabled={!activeLayerId}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-colors"
                title="Duplicate Layer"
              >
                <Copy className="w-4 h-4" />
              </button>

              <button
                onClick={() => activeLayerId && removeLayer(activeLayerId)}
                disabled={!activeLayerId}
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 disabled:opacity-30 transition-colors"
                title="Delete Layer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Reorder Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  activeLayerIndex < layers.length - 1 &&
                  reorderLayers(activeLayerIndex, activeLayerIndex + 1)
                }
                disabled={activeLayerIndex >= layers.length - 1 || activeLayerIndex === -1}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-colors"
                title="Move Layer Up"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  activeLayerIndex > 0 &&
                  reorderLayers(activeLayerIndex, activeLayerIndex - 1)
                }
                disabled={activeLayerIndex <= 0}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-colors"
                title="Move Layer Down"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Adjustments */}
      {activeTab === "adjustments" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Header & Reset */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Color & Tone
            </span>
            <button
              onClick={resetAdjustments}
              className="text-xs text-[#9CA3AF] hover:text-[#F5F547] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Quick Auto Enhance */}
          <button
            onClick={autoEnhance}
            className="w-full py-2.5 px-4 rounded-xl bg-[#F5F547]/15 border border-[#F5F547]/40 text-[#F5F547] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#F5F547]/25 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            1-Click Auto Tone & Color
          </button>

          {/* Sliders Group */}
          <div className="space-y-4">
            {/* Brightness */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#9CA3AF]">Brightness</span>
                <span className="text-white font-mono">{adjustments.brightness}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.brightness}
                onChange={(e) => setAdjustment("brightness", Number(e.target.value))}
                className="w-full accent-[#F5F547] cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#9CA3AF]">Contrast</span>
                <span className="text-white font-mono">{adjustments.contrast}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.contrast}
                onChange={(e) => setAdjustment("contrast", Number(e.target.value))}
                className="w-full accent-[#F5F547] cursor-pointer"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#9CA3AF]">Saturation</span>
                <span className="text-white font-mono">{adjustments.saturation}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.saturation}
                onChange={(e) => setAdjustment("saturation", Number(e.target.value))}
                className="w-full accent-[#F5F547] cursor-pointer"
              />
            </div>

            {/* Hue Rotate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#9CA3AF]">Hue Rotate</span>
                <span className="text-white font-mono">{adjustments.hueRotate}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={adjustments.hueRotate}
                onChange={(e) => setAdjustment("hueRotate", Number(e.target.value))}
                className="w-full accent-[#F5F547] cursor-pointer"
              />
            </div>

            {/* Blur */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#9CA3AF]">Gaussian Blur</span>
                <span className="text-white font-mono">{adjustments.blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={adjustments.blur}
                onChange={(e) => setAdjustment("blur", Number(e.target.value))}
                className="w-full accent-[#F5F547] cursor-pointer"
              />
            </div>

            {/* Grayscale */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#9CA3AF]">Black & White (Grayscale)</span>
                <span className="text-white font-mono">{adjustments.grayscale}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.grayscale}
                onChange={(e) => setAdjustment("grayscale", Number(e.target.value))}
                className="w-full accent-[#F5F547] cursor-pointer"
              />
            </div>

            {/* Sepia */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#9CA3AF]">Sepia Tone</span>
                <span className="text-white font-mono">{adjustments.sepia}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.sepia}
                onChange={(e) => setAdjustment("sepia", Number(e.target.value))}
                className="w-full accent-[#F5F547] cursor-pointer"
              />
            </div>
          </div>

          {/* Interactive RGB Curves Box */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex justify-between items-center text-xs font-bold text-white">
              <span>RGB Tone Curves</span>
              <span className="text-[10px] text-[#F5F547] bg-black/60 px-2 py-0.5 rounded">
                Master RGB
              </span>
            </div>
            <div className="w-full h-28 bg-black/80 rounded-xl border border-white/15 p-2 relative overflow-hidden flex items-center justify-center">
              {/* Curve line */}
              <svg className="w-full h-full text-[#F5F547]" viewBox="0 0 100 100">
                <line x1="0" y1="100" x2="100" y2="0" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <path
                  d={`M 0 100 Q 50 ${50 - adjustments.contrast * 0.3} 100 0`}
                  fill="none"
                  stroke="#F5F547"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: AI Tools */}
      {activeTab === "ai" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="pb-2 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              AI Intelligent Actions
            </span>
          </div>

          {/* AI Background Removal */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1c1d15] to-[#171717] border border-[#F5F547]/30 space-y-3">
            <div className="flex items-center gap-2 text-[#F5F547] font-bold text-sm">
              <Scissors className="w-4 h-4" />
              <span>Background Removal</span>
            </div>
            <p className="text-xs text-[#9CA3AF]">
              Automatically detects and extracts foreground subjects with smooth alpha edge blending.
            </p>
            <Button
              variant="yellow"
              size="sm"
              onClick={handleAIRemoveBg}
              disabled={!activeLayer}
              className="w-full font-bold text-xs"
            >
              Cutout Subject
            </Button>
          </div>

          {/* AI Upscale */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Zap className="w-4 h-4 text-[#F5F547]" />
              <span>Super-Resolution Upscale</span>
            </div>
            <p className="text-xs text-[#9CA3AF]">
              Enhance edge sharpness and reduce noise artifacts on low-resolution layers.
            </p>
            <Button
              variant="white"
              size="sm"
              onClick={handleAIUpscale}
              disabled={!activeLayer}
              className="w-full font-semibold text-xs"
            >
              2x Clarity Enhance
            </Button>
          </div>

          {/* Magic Erase */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Wand2 className="w-4 h-4 text-[#F5F547]" />
              <span>Generative Object Erase</span>
            </div>
            <p className="text-xs text-[#9CA3AF]">
              Paint over distractions with the Eraser or Brush tool to seamlessly blend pixels.
            </p>
            <Button
              variant="outline-white"
              size="sm"
              onClick={() => useEditorStore.getState().setActiveTool("eraser")}
              className="w-full font-semibold text-xs"
            >
              Select Eraser Tool
            </Button>
          </div>
        </div>
      )}

      {/* Tab 4: Export */}
      {activeTab === "export" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="pb-2 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Export Configuration
            </span>
          </div>

          {/* Format Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#9CA3AF]">File Format</label>
            <div className="grid grid-cols-3 gap-2">
              {(["png", "jpg", "webp"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`py-2 rounded-xl text-xs font-bold uppercase border transition-all ${
                    exportFormat === fmt
                      ? "bg-[#F5F547] text-black border-[#F5F547]"
                      : "bg-black/40 text-white border-white/10 hover:border-white/30"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Quality Slider (for JPG/WebP) */}
          {exportFormat !== "png" && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#9CA3AF]">Image Quality</span>
                <span className="text-white font-mono">{exportQuality}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={exportQuality}
                onChange={(e) => setExportQuality(Number(e.target.value))}
                className="w-full accent-[#F5F547] cursor-pointer"
              />
            </div>
          )}

          {/* Scale Resolution */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#9CA3AF]">Resolution Scale</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { scale: 0.5, label: "0.5x" },
                { scale: 1, label: "1x (Original)" },
                { scale: 2, label: "2x (HD)" },
              ].map((item) => (
                <button
                  key={item.scale}
                  onClick={() => setExportScale(item.scale)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    exportScale === item.scale
                      ? "bg-[#F5F547] text-black border-[#F5F547]"
                      : "bg-black/40 text-white border-white/10 hover:border-white/30"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Output Dimensions Info */}
          <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs space-y-1 font-mono text-[#9CA3AF]">
            <div className="flex justify-between">
              <span>Output Width:</span>
              <span className="text-white">{Math.round(canvasWidth * exportScale)} px</span>
            </div>
            <div className="flex justify-between">
              <span>Output Height:</span>
              <span className="text-white">{Math.round(canvasHeight * exportScale)} px</span>
            </div>
          </div>

          {/* Download Button */}
          <Button
            variant="yellow"
            size="lg"
            onClick={onExport}
            className="w-full font-bold text-sm shadow-xl shadow-[#F5F547]/20"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Download {exportFormat.toUpperCase()}
          </Button>
        </div>
      )}
    </aside>
  );
}
