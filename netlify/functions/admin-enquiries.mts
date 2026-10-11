import type { Config } from "@netlify/functions";
import { getUser } from "@netlify/identity";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { enquiries } from "../../db/schema.js";

const STATUSES = ["new", "contacted", "enrolled", "closed"];

export default async (req: Request) => {
  const user = await getUser();
  if (!user) return Response.json({ error: "Please log in." }, { status: 401 });
  if (!user.roles?.includes("admin")) {
    return Response.json({ error: "Your account does not have the admin role." }, { status: 403 });
  }

  if (req.method === "GET") {
    const rows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
    return Response.json({ user: { email: user.email }, enquiries: rows });
  }

  if (req.method === "PATCH") {
    const { id, status } = await req.json();
    if (!Number.isInteger(id) || !STATUSES.includes(status)) {
      return Response.json({ error: "Invalid update." }, { status: 400 });
    }
    const [row] = await db.update(enquiries).set({ status }).where(eq(enquiries.id, id)).returning();
    return row ? Response.json(row) : Response.json({ error: "Not found." }, { status: 404 });
  }

  if (req.method === "DELETE") {
    const id = Number(new URL(req.url).searchParams.get("id"));
    if (!Number.isInteger(id)) return Response.json({ error: "Invalid id." }, { status: 400 });
    await db.delete(enquiries).where(eq(enquiries.id, id));
    return new Response(null, { status: 204 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/admin/enquiries",
};
