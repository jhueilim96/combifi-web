import { NextRequest } from 'next/server';
import { redirect, RedirectType } from 'next/navigation';
export const runtime = 'edge';

// /a/split/<id> is the explicit split link the app shares; same destination
// as the older /a/<id> form.
export async function GET(request: NextRequest) {
  const id = new URL(request.url).pathname.split('/a/split/')[1]?.split('/')[0];

  if (!id) {
    return new Response('No record ID provided.', { status: 400 });
  }

  redirect(`/instant-splits/${id}`, RedirectType.replace);
}
