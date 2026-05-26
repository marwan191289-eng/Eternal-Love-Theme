export const config = {
  runtime: "edge",
};

// ✅ تعريف نوع البيانات
interface MediaItem {
  id: string;
  objectPath: string;
  type: string;
  visibility: string;
  createdAt: string;
}

// ✅ تعريف المتغير مع النوع
let MEDIA_STORE: MediaItem[] = [];

// ✅ تعريف الأنواع لـ req و Response
export default async function handler(req: Request): Promise<Response> {
  const method = req.method;

  if (method === "GET") {
    const items = [...MEDIA_STORE].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (method === "POST") {
    const body = await req.json();
    const { objectPath, type, visibility } = body;

    if (!objectPath || !type || !visibility) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ استخدام crypto من globalThis
    const item: MediaItem = {
      id: globalThis.crypto.randomUUID(),
      objectPath,
      type,
      visibility,
      createdAt: new Date().toISOString(),
    };

    MEDIA_STORE.unshift(item);

    return new Response(JSON.stringify(item), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}
