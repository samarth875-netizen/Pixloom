import { useEditorStore } from "@/store/useEditorStore";
import {
  useProjectStore,
  serializeLayerDataUrl,
  type Project,
  type SerializedLayer,
} from "@/store/useProjectStore";

const THUMBNAIL_MAX = 480;

/**
 * Render the current layers to a small thumbnail data URL for the dashboard.
 */
function generateThumbnail(): string | null {
  const editor = useEditorStore.getState();
  if (editor.layers.length === 0) return null;

  const ratio = Math.min(1, THUMBNAIL_MAX / editor.canvasWidth);
  const w = Math.max(1, Math.round(editor.canvasWidth * ratio));
  const h = Math.max(1, Math.round(editor.canvasHeight * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  editor.layers.forEach((layer) => {
    if (!layer.visible) return;
    ctx.save();
    ctx.globalAlpha = layer.opacity / 100;
    ctx.globalCompositeOperation =
      layer.blendMode === "normal"
        ? "source-over"
        : (layer.blendMode as GlobalCompositeOperation);

    const sx = layer.x * ratio;
    const sy = layer.y * ratio;
    const sw = layer.width * ratio;
    const sh = layer.height * ratio;

    if (layer.canvas) {
      ctx.drawImage(layer.canvas, sx, sy, sw, sh);
    } else if (layer.type === "text" && layer.text) {
      ctx.font = `bold ${Math.max(4, (layer.fontSize || 48) * ratio)}px sans-serif`;
      ctx.fillStyle = layer.textColor || "#FFFFFF";
      ctx.fillText(layer.text, sx, sy + (layer.fontSize || 48) * ratio);
    } else if (layer.type === "shape") {
      ctx.fillStyle = layer.textColor || "#F5F547";
      ctx.beginPath();
      if (layer.shapeType === "rect") {
        ctx.roundRect(sx, sy, sw, sh, 16 * ratio);
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

  return canvas.toDataURL("image/jpeg", 0.72);
}

/**
 * Serialize the current editor state into a savable Project.
 */
export function buildProjectFromEditor(): Project {
  const editor = useEditorStore.getState();

  const layers: SerializedLayer[] = editor.layers.map((layer) => ({
    id: layer.id,
    name: layer.name,
    type: layer.type,
    visible: layer.visible,
    locked: layer.locked,
    opacity: layer.opacity,
    blendMode: layer.blendMode,
    dataUrl: serializeLayerDataUrl(layer.canvas),
    text: layer.text,
    textColor: layer.textColor,
    fontSize: layer.fontSize,
    shapeType: layer.shapeType,
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height,
  }));

  const now = Date.now();

  return {
    id:
      editor.projectId ??
      `project-${now}-${Math.random().toString(36).slice(2, 6)}`,
    name: editor.projectName,
    thumbnail: generateThumbnail(),
    canvasWidth: editor.canvasWidth,
    canvasHeight: editor.canvasHeight,
    layers,
    adjustments: { ...editor.adjustments },
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Save the current editor state to the persisted project store.
 * Returns the saved project id.
 */
export function saveCurrentProject(): string {
  const project = buildProjectFromEditor();
  useProjectStore.getState().addProject(project);
  useEditorStore.getState().setProjectId(project.id);
  return project.id;
}
