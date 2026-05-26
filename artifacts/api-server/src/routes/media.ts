import { randomUUID } from "crypto";
import type { Request, Response } from "express";

interface MediaItem {
  id: string;
  objectPath: string;
  type: string;
  visibility: string;
  createdAt: string;
}

interface CreateMediaBody {
  objectPath: string;
  type: string;
  visibility: string;
}

let MEDIA_STORE: MediaItem[] = [];

function isCreateMediaBody(body: unknown): body is CreateMediaBody {
  if (!body || typeof body !== "object") {
    return false;
  }

  const candidate = body as Record<string, unknown>;
  return (
    typeof candidate.objectPath === "string" &&
    candidate.objectPath.length > 0 &&
    typeof candidate.type === "string" &&
    candidate.type.length > 0 &&
    typeof candidate.visibility === "string" &&
    candidate.visibility.length > 0
  );
}

export default function handler(req: Request, res: Response) {
  if (req.method === "GET") {
    const items = [...MEDIA_STORE].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return res.status(200).json(items);
  }

  if (req.method === "POST") {
    if (!isCreateMediaBody(req.body)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const item: MediaItem = {
      id: randomUUID(),
      objectPath: req.body.objectPath,
      type: req.body.type,
      visibility: req.body.visibility,
      createdAt: new Date().toISOString(),
    };

    MEDIA_STORE.unshift(item);
    return res.status(201).json(item);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
