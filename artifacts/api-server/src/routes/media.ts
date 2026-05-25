import { Router, type IRouter, type Request, type Response } from "express";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { z } from "zod";

const router: IRouter = Router();

const DATA_FILE = join(process.cwd(), "media-store.json");

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

function readStore(): MediaItem[] {
  if (!existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf-8")) as MediaItem[];
  } catch {
    return [];
  }
}

function writeStore(items: MediaItem[]) {
  writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
}

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

router.get("/media", (_req: Request, res: Response) => {
  const items = readStore().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(items);
});

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
  const items = readStore();
  items.unshift(item);
  writeStore(items);
  res.status(201).json(item);
});

router.patch("/media/:id", (req: Request, res: Response) => {
  const parsed = UpdateMediaBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const items = readStore();
  const idx = items.findIndex((m) => m.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  items[idx] = { ...items[idx], ...parsed.data };
  writeStore(items);
  res.json(items[idx]);
});

router.delete("/media/:id", (req: Request, res: Response) => {
  const items = readStore();
  const filtered = items.filter((m) => m.id !== req.params.id);
  if (filtered.length === items.length) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  writeStore(filtered);
  res.status(204).send();
});

export default router;
