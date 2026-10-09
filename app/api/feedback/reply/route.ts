import { env } from "cloudflare:workers";

const OWNER_EMAIL = "wanglinger115@gmail.com";
const json = (body: unknown, status = 200) => Response.json(body, { status });

export async function POST(request: Request) {
  const email = request.headers.get("oai-authenticated-user-email")?.toLowerCase();
  if (email !== OWNER_EMAIL) return json({ error: "Owner access required." }, 403);
  try {
    const db = env.DB;
    if (!db) return json({ error: "Feedback storage is unavailable." }, 503);
    const data = (await request.json()) as { commentId?: number; reply?: string };
    const commentId = Number(data.commentId);
    const reply = data.reply?.trim().slice(0, 1200);
    if (!Number.isInteger(commentId) || commentId < 1 || !reply) return json({ error: "A valid reply is required." }, 400);
    const result = await db.prepare(
      "UPDATE feedback SET reply = ?, replied_at = ? WHERE id = ? RETURNING id"
    ).bind(reply, new Date().toISOString(), commentId).first();
    if (!result) return json({ error: "Comment not found." }, 404);
    return json({ ok: true });
  } catch (error) {
    console.error("feedback reply failed", error);
    return json({ error: "The reply could not be saved." }, 503);
  }
}
