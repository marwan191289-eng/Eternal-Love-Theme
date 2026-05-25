export type MediaItem = {
  id: string;
  objectPath: string;
  type: "image" | "video";
  caption: string | null;
  uploader: string | null;
  visibility: "public" | "private";
  createdAt: string;
};

const BASE = "/api";

export async function fetchMedia(): Promise<MediaItem[]> {
  const r = await fetch(`${BASE}/media`);
  if (!r.ok) throw new Error("Failed to fetch media");
  return r.json() as Promise<MediaItem[]>;
}

export async function createMedia(body: {
  objectPath: string;
  type: "image" | "video";
  caption?: string | null;
  uploader?: string | null;
  visibility: "public" | "private";
}): Promise<MediaItem> {
  const r = await fetch(`${BASE}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error("Failed to create media");
  return r.json() as Promise<MediaItem>;
}

export async function updateMedia(
  id: string,
  patch: { visibility?: "public" | "private"; caption?: string | null }
): Promise<MediaItem> {
  const r = await fetch(`${BASE}/media/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error("Failed to update media");
  return r.json() as Promise<MediaItem>;
}

export async function deleteMedia(id: string): Promise<void> {
  const r = await fetch(`${BASE}/media/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to delete media");
}

export async function uploadFile(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  // Step 1: request presigned URL
  const res = await fetch(`${BASE}/storage/uploads/request-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: file.name,
      size: file.size,
      contentType: file.type,
    }),
  });
  if (!res.ok) throw new Error("Failed to get upload URL");
  const { uploadURL, objectPath } = (await res.json()) as {
    uploadURL: string;
    objectPath: string;
  };

  // Step 2: upload directly to GCS
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadURL);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed: ${xhr.status}`));
    });
    xhr.addEventListener("error", () => reject(new Error("Upload error")));
    xhr.send(file);
  });

  return objectPath;
}

export function mediaUrl(objectPath: string): string {
  return `/api/storage${objectPath}`;
}

// Cache signed URLs client-side so remounts don't hit the server again
const signedUrlCache = new Map<string, string>();

export async function resolveVideoUrl(objectPath: string): Promise<string> {
  const cached = signedUrlCache.get(objectPath);
  if (cached) return cached;
  const r = await fetch(`/api/storage${objectPath}/signed-url`);
  if (!r.ok) throw new Error("Failed to get signed URL");
  const { url } = (await r.json()) as { url: string };
  signedUrlCache.set(objectPath, url);
  // Signed URLs expire in 1 hour — evict cache entry 5 min early
  setTimeout(() => signedUrlCache.delete(objectPath), 55 * 60 * 1000);
  return url;
}

const STORAGE_KEY = "wedding_unlocked";
const PASSWORD = "Amira14052026";

export function isUnlocked(): boolean {
  return sessionStorage.getItem(STORAGE_KEY) === "yes";
}

export function tryUnlock(pw: string): boolean {
  if (pw === PASSWORD) {
    sessionStorage.setItem(STORAGE_KEY, "yes");
    return true;
  }
  return false;
}

export function lock(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
