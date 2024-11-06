import { auth } from "../../../../auth";

export async function GET(req) {
  const session = await auth(req);

  if (!session) {
    return new Response(JSON.stringify({ user: null }), { status: 200 });
  }

  return new Response(JSON.stringify({ user: session.user }), { status: 200 });
}
