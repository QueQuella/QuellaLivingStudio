import { env } from "cloudflare:workers";

const OWNER_EMAIL = "wanglinger115@gmail.com";
const json = (body: unknown, status = 200) => Response.json(body, { status });
const isOwner = (request: Request) =>
  request.headers.get("oai-authenticated-user-email")?.toLowerCase() === OWNER_EMAIL;

export async function GET(request: Request) {
  try {
    const db = env.DB;
    if (!db) return json({ error: "Feedback storage is unavailable." }, 503);
    const result = await db.prepare(
      "SELECT id, name, message, created_at AS createdAt, reply, replied_at AS repliedAt FROM feedback ORDER BY id DESC LIMIT 100"
    ).all();
    return json({ comments: result.results, isOwner: isOwner(request) });
  } catch (error) {
    console.error("feedback GET failed", error);
    return json({ error: "Feedback is temporarily unavailable." }, 503);
  }
}

export async function POST(request: Request) {
  try {
    const db = env.DB;
    if (!db) return json({ error: "Feedback storage is unavailable." }, 503);
    const data = (await request.json()) as { name?: string; message?: string };
    const name = data.name?.trim().slice(0, 40);
    const message = data.message?.trim().slice(0, 1200);
    if (!name || !message) return json({ error: "Name and message are required." }, 400);
    const createdAt = new Date().toISOString();
    const result = await db.prepare(
      "INSERT INTO feedback (name, message, created_at) VALUES (?, ?, ?) RETURNING id"
    ).bind(name, message, createdAt).first();
    return json({ id: result?.id, createdAt }, 201);
  } catch (error) {
    console.error("feedback POST failed", error);
    return json({ error: "The message could not be saved." }, 503);
  }
}
