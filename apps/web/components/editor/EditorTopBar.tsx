"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Save,
  Plus,
  ImagePlus,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { Button } from "@/components/ui/Button";
import { NewProjectModal } from "@/components/editor/NewProjectModal";

interface EditorTopBarProps {
  onQuickExport: () => void;
  onSave: () => void;
  onOpenExportModal?: () => void;
}

export function EditorTopBar({ onQuickExport, onSave }: EditorTopBarProps) {
  const {
    projectName,
    setProjectName,
    undo,
    redo,
    canUndo,
    canRedo,
    zoom,
    setZoom,
    fitToScreen,
    isComparing,
    setIsComparing,
    canvasWidth,
    canvasHeight,
    autoEnhance,
  } = useEditorStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      useEditorStore.getState().importImage(e.target.files[0]);
    }
    e.target.value = "";
  };

  return (
    <header className="h-16 w-full bg-[#121212] border-b border-white/[0.08] px-4 flex items-center justify-between z-40 select-none">
      {/* Left: Brand & Project Name */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-[#9CA3AF] hover:text-white transition-colors group px-2 py-1.5 rounded-lg hover:bg-white/5"
          title="Back to Landing Page"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5F547]" />
            <span className="font-black text-sm tracking-wider text-white uppercase">
              PIXLOOM
            </span>
          </div>
        </Link>

        {/* New Project */}
        <button
          onClick={() => setNewProjectOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-black/40 text-[#9CA3AF] hover:text-white border border-white/10 hover:border-[#F5F547]/40 transition-colors"
          title="Create a new design"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New</span>
        </button>

        {/* Import Image */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F5F547]/10 text-[#F5F547] border border-[#F5F547]/30 hover:bg-[#F5F547]/20 hover:border-[#F5F547]/50 transition-colors"
          title="Import an image onto the canvas"
        >
          <ImagePlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Import</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImportFile}
        />

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Project Name */}
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
              autoFocus
              className="bg-black/60 text-white font-medium text-xs sm:text-sm px-2.5 py-1 rounded-md border border-[#F5F547]/50 focus:outline-none"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-xs sm:text-sm font-semibold text-white/90 hover:text-white px-2 py-1 rounded-md hover:bg-white/5 transition-colors flex items-center gap-1.5"
              title="Click to rename"
            >
              <span>{projectName}</span>
              <span className="text-[10px] text-[#9CA3AF] font-mono">
                ({canvasWidth} × {canvasHeight})
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Center: History & View Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center bg-black/40 p-1 rounded-full border border-white/10">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-1.5 rounded-full text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-1.5 rounded-full text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center bg-black/40 px-2 py-1 rounded-full border border-white/10 gap-1 text-xs">
          <button
            onClick={() => setZoom(zoom - 0.15)}
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-white/90 min-w-[42px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(zoom + 0.15)}
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={fitToScreen}
            className="p-1 rounded-full hover:bg-white/10 text-[#9CA3AF] hover:text-white transition-colors ml-0.5"
            title="Fit to Screen"
            aria-label="Fit to Screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compare Original Button */}
        <button
          onClick={() => setIsComparing(!isComparing)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            isComparing
              ? "bg-[#F5F547] text-black border-[#F5F547]"
              : "bg-black/40 text-[#9CA3AF] hover:text-white border-white/10 hover:border-white/20"
          }`}
          title="Hold/Toggle to compare with original image"
        >
          {isComparing ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="hidden md:inline">Compare</span>
        </button>

        {/* Auto Enhance Quick Action */}
        <button
          onClick={autoEnhance}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F5F547]/10 text-[#F5F547] border border-[#F5F547]/30 hover:bg-[#F5F547]/20 transition-colors"
          title="1-Click Auto Tone & Color"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto Tone</span>
        </button>
      </div>

      {/* Right: Save + Export Button */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline-white"
          size="sm"
          onClick={onSave}
          className="font-semibold text-xs px-5 py-2 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Project</span>
        </Button>

        <Button
          variant="yellow"
          size="sm"
          onClick={onQuickExport}
          className="font-bold text-xs px-5 py-2 flex items-center gap-2 shadow-lg shadow-[#F5F547]/10"
        >
          <Download className="w-4 h-4" />
          <span>Export Image</span>
        </Button>
      </div>

      {/* New Project Modal */}
      <NewProjectModal open={newProjectOpen} onClose={() => setNewProjectOpen(false)} />
    </header>
  );
}
