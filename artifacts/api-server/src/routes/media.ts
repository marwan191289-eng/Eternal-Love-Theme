import { randomUUID } from "crypto";

interface MediaItem {
  id: string;
  objectPath: string;
  type: string;
  visibility: string;
  createdAt: string;
}

let MEDIA_STORE: MediaItem[] = [];

export default function handler(req: { method: string; body: Record<string, any> }, res: any) {
  if (req.method === "GET") {
    const items = [...MEDIA_STORE].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return res.status(200).json(items);
  }

  if (req.method === "POST") {
    const { objectPath, type, visibility } = req.body;

    if (!objectPath || !type || !visibility) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const item = {
      id: randomUUID(),
      objectPath,
      type,
      visibility,
      createdAt: new Date().toISOString(),
    };

    MEDIA_STORE.unshift(item);
    return res.status(201).json(item);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
