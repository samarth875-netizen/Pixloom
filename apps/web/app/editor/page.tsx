"use client";

import React, { useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EditorTopBar } from "@/components/editor/EditorTopBar";
import { EditorToolRail } from "@/components/editor/EditorToolRail";
import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { EditorRightPanel } from "@/components/editor/EditorRightPanel";
import { EditorBottomBar } from "@/components/editor/EditorBottomBar";
import { useEditorStore } from "@/store/useEditorStore";
import { saveCurrentProject } from "@/lib/projects";

function EditorFallback() {
  return (
    <div className="h-screen w-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="w-3 h-3 rounded-full bg-[#F5F547] animate-pulse" />
        <p className="text-sm font-semibold text-[#9CA3AF]">Loading editor…</p>
      </div>
    </div>
  );
}

function EditorContent() {
  const {
    projectName,
    canvasWidth,
    canvasHeight,
    layers,
    adjustments,
    exportFormat,
    exportQuality,
    exportScale,
    undo,
    redo,
    setActiveTool,
    activeTool,
    clearLayers,
    setProjectId,
    setProjectName,
    setCanvasSize,
  } = useEditorStore();

  const searchParams = useSearchParams();

  // If opened with ?new=<projectId>, start a fresh blank project.
  useEffect(() => {
    const newId = searchParams.get("new");
    if (newId) {
      clearLayers();
      setProjectId(newId);
      setProjectName("Untitled Design");
      setCanvasSize(1200, 800);
      setActiveTool("move");
    }
  }, [searchParams, clearLayers, setProjectId, setProjectName, setCanvasSize, setActiveTool]);

  // Master Save Function
  const handleSave = useCallback(() => {
    saveCurrentProject();
    // eslint-disable-next-line @next/next/no-html-link-for-pages
  }, []);

  // Master Export Function
  const handleExport = useCallback(() => {
    const exportWidth = Math.round(canvasWidth * exportScale);
    const exportHeight = Math.round(canvasHeight * exportScale);

    const offCanvas = document.createElement("canvas");
    offCanvas.width = exportWidth;
    offCanvas.height = exportHeight;
    const ctx = offCanvas.getContext("2d");
    if (!ctx) return;

    // Apply adjustments
    const b = 100 + adjustments.brightness;
    const c = 100 + adjustments.contrast;
    const s = 100 + adjustments.saturation;
    const h = adjustments.hueRotate;
    const blur = adjustments.blur * exportScale;
    const gray = adjustments.grayscale;
    const sepia = adjustments.sepia;
    const invert = adjustments.invert;

    ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) hue-rotate(${h}deg) blur(${blur}px) grayscale(${gray}%) sepia(${sepia}%) invert(${invert}%)`;

    // Draw background if JPG
    if (exportFormat === "jpg") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, exportWidth, exportHeight);
    }

    // Render layers
    layers.forEach((layer) => {
      if (!layer.visible) return;

      ctx.save();
      ctx.globalAlpha = layer.opacity / 100;
      ctx.globalCompositeOperation =
        layer.blendMode === "normal"
          ? "source-over"
          : (layer.blendMode as GlobalCompositeOperation);

      if (layer.canvas) {
        ctx.drawImage(
          layer.canvas,
          layer.x * exportScale,
          layer.y * exportScale,
          layer.width * exportScale,
          layer.height * exportScale
        );
      } else if (layer.type === "text" && layer.text) {
        ctx.font = `bold ${(layer.fontSize || 48) * exportScale}px sans-serif`;
        ctx.fillStyle = layer.textColor || "#FFFFFF";
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 8 * exportScale;
        ctx.fillText(
          layer.text,
          layer.x * exportScale,
          (layer.y + (layer.fontSize || 48)) * exportScale
        );
      } else if (layer.type === "shape") {
        ctx.fillStyle = layer.textColor || "#F5F547";
        ctx.beginPath();
        const sx = layer.x * exportScale;
        const sy = layer.y * exportScale;
        const sw = layer.width * exportScale;
        const sh = layer.height * exportScale;

        if (layer.shapeType === "rect") {
          ctx.roundRect(sx, sy, sw, sh, 16 * exportScale);
        } else if (layer.shapeType === "circle") {
          ctx.arc(sx + sw / 2, sy + sh / 2, sw / 2, 0, Math.PI * 2);
        } else if (layer.shapeType === "star") {
          const cx = sx + sw / 2;
          const cy = sy + sh / 2;
          const spikes = 5;
          const outerRadius = sw / 2;
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

    // Generate download link
    const mimeType =
      exportFormat === "jpg"
        ? "image/jpeg"
        : exportFormat === "webp"
        ? "image/webp"
        : "image/png";

    const quality = exportFormat === "png" ? undefined : exportQuality / 100;
    const dataUrl = offCanvas.toDataURL(mimeType, quality);

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${projectName.replace(/\s+/g, "-").toLowerCase() || "pixloom-export"}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [
    canvasWidth,
    canvasHeight,
    exportScale,
    adjustments,
    exportFormat,
    layers,
    exportQuality,
    projectName,
  ]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }

      // Tool shortcuts
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case "v":
            setActiveTool("move");
            break;
          case "m":
            setActiveTool("lasso");
            break;
          case "c":
            setActiveTool("crop");
            break;
          case "b":
            setActiveTool("brush");
            break;
          case "e":
            setActiveTool("eraser");
            break;
          case "s":
            setActiveTool("stamp");
            break;
          case "t":
            setActiveTool("text");
            break;
          case "u":
            setActiveTool("shapes");
            break;
          case "i":
            setActiveTool("eyedropper");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, setActiveTool]);

  return (
    <div className="h-screen w-screen bg-[#0A0A0A] text-white flex flex-col overflow-hidden font-sans select-none">
      {/* 1. Top Bar */}
      <EditorTopBar onQuickExport={handleExport} onSave={handleSave} />

      {/* 2. Main Workspace (Tool Rail + Canvas + Inspector Panel) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Tool Rail */}
        <EditorToolRail />

        {/* Center Canvas Area */}
        <EditorCanvas />

        {/* Right Inspector Panel */}
        <EditorRightPanel onExport={handleExport} />
      </div>

      {/* 3. Bottom Status Bar */}
      <EditorBottomBar />
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorFallback />}>
      <EditorContent />
    </Suspense>
  );
}
