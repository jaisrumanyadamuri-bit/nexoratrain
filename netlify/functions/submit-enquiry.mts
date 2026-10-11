import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { enquiries } from "../../db/schema.js";

const field = (form: FormData, name: string, max: number) =>
  String(form.get(name) ?? "").trim().slice(0, max);

export default async (req: Request) => {
  const form = await req.formData();
  const wantsJson = req.headers.get("accept")?.includes("application/json");
  const done = () =>
    wantsJson
      ? Response.json({ ok: true })
      : new Response(null, { status: 303, headers: { Location: "/thank-you.html" } });

  // Honeypot: bots fill the hidden field; pretend success without saving.
  if (field(form, "bot-field", 200)) return done();

  const enquiry = {
    studentName: field(form, "student_name", 100),
    phone: field(form, "phone", 20),
    email: field(form, "email", 254),
    course: field(form, "course", 100),
    message: field(form, "message", 5000),
  };

  if (!enquiry.studentName || !enquiry.phone || !enquiry.email || !enquiry.course) {
    return new Response("Please fill in your name, phone, email and course.", { status: 400 });
  }

  await db.insert(enquiries).values(enquiry);
  return done();
};

export const config: Config = {
  path: "/api/enquiries",
  method: "POST",
};
