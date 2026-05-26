export const config = {
  runtime: "edge",
};

const JSON_HEADERS = { "Content-Type": "application/json" };

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

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS,
  });
}

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

export default async function handler(req: Request): Promise<Response> {
  const method = req.method;

  if (method === "GET") {
    const items = [...MEDIA_STORE].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return jsonResponse(items, 200);
  }

  if (method === "POST") {
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    if (!isCreateMediaBody(body)) {
      return jsonResponse({ error: "Invalid request body" }, 400);
    }

    const item: MediaItem = {
      id: crypto.randomUUID(),
      objectPath: body.objectPath,
      type: body.type,
      visibility: body.visibility,
      createdAt: new Date().toISOString(),
    };

    MEDIA_STORE.unshift(item);

    return jsonResponse(item, 201);
  }

  return jsonResponse({ error: "Method Not Allowed" }, 405);
}
