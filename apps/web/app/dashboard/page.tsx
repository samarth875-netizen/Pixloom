"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Pencil,
  LayoutGrid,
  Image as ImageIcon,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useUser } from "@/components/auth/useUser";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { useProjectStore, type Project } from "@/store/useProjectStore";
import { useEditorStore } from "@/store/useEditorStore";
import { Button } from "@/components/ui/Button";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ProjectCard({
  project,
  onOpen,
  onDelete,
}: {
  project: Project;
  onOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group bg-[#171717] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-[#F5F547]/40 hover:shadow-xl hover:shadow-[#F5F547]/5 transition-all">
      {/* Thumbnail */}
      <button
        onClick={onOpen}
        className="relative w-full aspect-[3/2] bg-black/50 flex items-center justify-center overflow-hidden"
      >
        {project.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <ImageIcon className="w-10 h-10 text-[#9CA3AF]/40" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-black/70 border border-white/20 px-3.5 py-1.5 rounded-full">
            <Pencil className="w-3.5 h-3.5" /> Open Project
          </span>
        </div>
      </button>

      {/* Meta */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{project.name}</h3>
            <p className="text-[11px] text-[#9CA3AF] font-mono mt-0.5">
              {project.canvasWidth} × {project.canvasHeight} px
            </p>
          </div>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete project"
            aria-label={`Delete ${project.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#9CA3AF]">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(project.updatedAt)}
          </span>
          <span className="font-mono">{project.layers.length} layers</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const { projects, deleteProject } = useProjectStore();
  const loadProject = useEditorStore((s) => s.loadProject);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    if (confirmDelete) {
      const t = setTimeout(() => setConfirmDelete(null), 3000);
      return () => clearTimeout(t);
    }
  }, [confirmDelete]);

  const openProject = (project: Project) => {
    loadProject(project);
    router.push("/editor");
  };

  const newProjectId = `project-${Date.now()}`;

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-3 h-3 rounded-full bg-[#F5F547] shadow-[0_0_10px_rgba(245,245,71,0.6)] group-hover:scale-110 transition-transform" />
            <span className="text-lg font-black tracking-widest uppercase">
              PIXLOOM
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-[#9CA3AF] hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-[#F5F547]">
              Dashboard
            </Link>
            <Link href="/pricing" className="text-[#9CA3AF] hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-[#9CA3AF] hover:text-white transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F547]/10 border border-[#F5F547]/25 text-[#F5F547] text-xs font-black uppercase tracking-widest">
              <LayoutGrid className="w-3.5 h-3.5" />
              Your Workspace
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
              Welcome back
              {user ? (
                <span className="text-[#F5F547]">
                  , {user.user_metadata?.full_name || user.email?.split("@")[0] || "Creator"}
                </span>
              ) : null}
            </h1>
            <p className="text-[#9CA3AF]">
              {loading
                ? "Loading your workspace…"
                : "Pick up where you left off or start something new."}
            </p>
          </div>

          <Button
            variant="yellow"
            size="lg"
            onClick={() => router.push(`/editor?new=${newProjectId}`)}
            className="font-bold"
          >
            <Plus className="w-5 h-5" />
            New Project
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Projects", value: projects.length },
            { label: "Active Layers", value: projects.reduce((n, p) => n + p.layers.length, 0) },
            { label: "Exports Ready", value: "PNG · JPG · WEBP" },
            { label: "Storage", value: "Local Cloud" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#171717] border border-white/[0.08] rounded-2xl p-5"
            >
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight">Recent Projects</h2>
          <Link
            href="/editor"
            className="text-xs font-bold text-[#9CA3AF] hover:text-white flex items-center gap-1 transition-colors"
          >
            Open Blank Editor <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-[#171717]/60 border border-white/[0.06] rounded-3xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F5F547]/10 border border-[#F5F547]/30 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-[#F5F547]" />
            </div>
            <h3 className="text-xl font-black text-white mt-6">No projects yet</h3>
            <p className="text-sm text-[#9CA3AF] mt-2 max-w-sm mx-auto">
              Create your first design in the editor and hit save — it will show
              up here instantly.
            </p>
            <Link href="/editor">
              <Button variant="yellow" className="mt-8 font-bold">
                <Plus className="w-4 h-4" />
                Create Your First Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={() => openProject(project)}
                onDelete={() => {
                  if (confirmDelete === project.id) {
                    deleteProject(project.id);
                    setConfirmDelete(null);
                  } else {
                    setConfirmDelete(project.id);
                  }
                }}
              />
            ))}
          </div>
        )}

        {/* Delete confirmation hint */}
        {confirmDelete && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#171717] border border-white/20 rounded-full px-6 py-3 shadow-2xl text-sm flex items-center gap-3">
            <span className="text-white font-semibold">
              Click delete again to confirm — this cannot be undone.
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
