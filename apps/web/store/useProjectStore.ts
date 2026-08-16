import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Adjustments } from "@/types/editor";

export interface SerializedLayer {
  id: string;
  name: string;
  type: "image" | "drawing" | "text" | "shape";
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: string;
  dataUrl: string | null;
  text?: string;
  textColor?: string;
  fontSize?: number;
  shapeType?: "rect" | "circle" | "star";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  name: string;
  thumbnail: string | null;
  canvasWidth: number;
  canvasHeight: number;
  layers: SerializedLayer[];
  adjustments: Adjustments;
  createdAt: number;
  updatedAt: number;
}

interface ProjectState {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Omit<Project, "id">>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],

      addProject: (project) =>
        set((state) => {
          const existing = state.projects.find((p) => p.id === project.id);
          const projects = existing
            ? state.projects.map((p) =>
                p.id === project.id
                  ? { ...p, ...project, updatedAt: Date.now() }
                  : p
              )
            : [project, ...state.projects].slice(0, 50);
          return { projects };
        }),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      getProject: (id) => get().projects.find((p) => p.id === id),
    }),
    {
      name: "pixloom-projects",
    }
  )
);

export function serializeLayerDataUrl(canvas: HTMLCanvasElement | null): string | null {
  if (!canvas) return null;
  return canvas.toDataURL("image/png");
}
