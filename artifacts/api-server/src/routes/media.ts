import { Router, type IRouter, type Request, type Response } from "express";
import { randomUUID } from "crypto";
import { z } from "zod";

const router: IRouter = Router();

// تخزين مؤقت داخل الذاكرة (شغال على Vercel)
let MEDIA_STORE: MediaItem[] = [];

type MediaItem = {
  id: string;
  objectPath: string;
  externalUrl: string | null;
  type: "image" | "video";
  caption: string | null;
  uploader: string | null;
  visibility: "public" | "private";
  createdAt: string;
};

const CreateMediaBody = z.object({
  objectPath: z.string(),
  externalUrl: z.string().nullable().optional(),
  type: z.enum(["image", "video"]),
  caption: z.string().nullable().optional(),
  uploader: z.string().nullable().optional(),
  visibility: z.enum(["public", "private"]),
});

const UpdateMediaBody = z.object({
  visibility: z.enum(["public", "private"]).optional(),
  caption: z.string().nullable().optional(),
});

// GET /api/media
router.get("/media", (_req: Request, res: Response) => {
  const items = [...MEDIA_STORE].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(items);
});

// POST /api/media
router.post("/media", (req: Request, res: Response) => {
  const parsed = CreateMediaBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { objectPath, externalUrl, type, caption, uploader, visibility } = parsed.data;

  const item: MediaItem = {
    id: randomUUID(),
    objectPath,
    externalUrl: externalUrl ?? null,
    type,
    caption: caption ?? null,
    uploader: uploader ?? null,
    visibility,
    createdAt: new Date().toISOString(),
  };

  MEDIA_STORE.unshift(item);

  res.status(201).json(item);
});

// PATCH /api/media/:id
router.patch("/media/:id", (req: Request, res: Response) => {
  const parsed = UpdateMediaBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const idx = MEDIA_STORE.findIndex((m) => m.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  MEDIA_STORE[idx] = { ...MEDIA_STORE[idx], ...parsed.data };

  res.json(MEDIA_STORE[idx]);
});

// DELETE /api/media/:id
router.delete("/media/:id", (req: Request, res: Response) => {
  const before = MEDIA_STORE.length;
  MEDIA_STORE = MEDIA_STORE.filter((m) => m.id !== req.params.id);

  if (MEDIA_STORE.length === before) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.status(204).send();
});

export default router;
