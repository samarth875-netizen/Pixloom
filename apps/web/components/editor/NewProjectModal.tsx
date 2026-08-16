"use client";

import React, { useEffect, useState } from "react";
import { X, LayoutTemplate } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { Button } from "@/components/ui/Button";

interface SizePreset {
  label: string;
  width: number;
  height: number;
  hint: string;
  bg: string;
}

const PRESETS: SizePreset[] = [
  { label: "Instagram Post", width: 1080, height: 1080, hint: "Square", bg: "from-pink-500/30 to-purple-500/30" },
  { label: "Instagram Story", width: 1080, height: 1920, hint: "Story · 9:16", bg: "from-purple-500/30 to-indigo-500/30" },
  { label: "YouTube Thumbnail", width: 1280, height: 720, hint: "16:9", bg: "from-red-500/30 to-orange-500/30" },
  { label: "X / Twitter Post", width: 1600, height: 900, hint: "Social", bg: "from-sky-500/30 to-blue-500/30" },
  { label: "Facebook Cover", width: 851, height: 315, hint: "Banner", bg: "from-blue-500/30 to-cyan-500/30" },
  { label: "A4 Poster", width: 1240, height: 1748, hint: "Print", bg: "from-emerald-500/30 to-teal-500/30" },
  { label: "Landscape", width: 1920, height: 1080, hint: "Full HD", bg: "from-amber-500/30 to-yellow-500/30" },
  { label: "Portrait", width: 1080, height: 1350, hint: "4:5", bg: "from-lime-500/30 to-green-500/30" },
];

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewProjectModal({ open, onClose }: NewProjectModalProps) {
  const {
    setCanvasSize,
    clearLayers,
    setProjectName,
    setProjectId,
    setActiveTool,
  } = useEditorStore();

  const [customW, setCustomW] = useState(1200);
  const [customH, setCustomH] = useState(800);
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    if (open) {
      setShowCustom(false);
      setCustomW(1200);
      setCustomH(800);
    }
  }, [open]);

  if (!open) return null;

  const createProject = (width: number, height: number, name: string) => {
    clearLayers();
    setCanvasSize(width, height);
    setProjectName(name);
    setProjectId(null);
    setActiveTool("move");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#171717] border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F547]/15 border border-[#F5F547]/30 flex items-center justify-center">
              <LayoutTemplate className="w-5 h-5 text-[#F5F547]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Create New Design</h2>
              <p className="text-xs text-[#9CA3AF]">Pick a size to start your canvas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Grid */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => createProject(preset.width, preset.height, preset.label)}
              className="group text-left rounded-2xl border border-white/10 hover:border-[#F5F547]/50 bg-black/40 overflow-hidden transition-all hover:-translate-y-0.5"
            >
              <div
                className={`w-full aspect-video bg-gradient-to-br ${preset.bg} flex items-center justify-center`}
              >
                <div className="w-10 h-10 rounded-md border-2 border-white/40 bg-black/30 group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-white truncate">{preset.label}</p>
                <p className="text-[10px] text-[#9CA3AF] font-mono">
                  {preset.width} × {preset.height} · {preset.hint}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Size */}
        <div className="px-6 pb-6">
          {showCustom ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    min="16"
                    max="8000"
                    value={customW}
                    onChange={(e) => setCustomW(Math.max(16, Number(e.target.value)))}
                    className="w-full bg-black/60 border border-white/15 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#F5F547]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    min="16"
                    max="8000"
                    value={customH}
                    onChange={(e) => setCustomH(Math.max(16, Number(e.target.value)))}
                    className="w-full bg-black/60 border border-white/15 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#F5F547]"
                  />
                </div>
              </div>
              <Button
                variant="yellow"
                size="md"
                className="w-full font-bold"
                onClick={() =>
                  createProject(customW, customH, `Custom ${customW}×${customH}`)
                }
              >
                Create Custom Design
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setShowCustom(true)}
              className="w-full py-3 rounded-2xl border border-dashed border-white/20 text-sm font-semibold text-[#9CA3AF] hover:text-white hover:border-[#F5F547]/40 transition-colors"
            >
              + Custom Size…
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
