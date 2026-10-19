import { NextRequest } from 'next/server';
import { redirect, RedirectType } from 'next/navigation';
export const runtime = 'edge';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  // console.log('Redirecting from old URL structure to new URL structure');
  const id = new URL(request.url).pathname.split('/a/').pop();

  if (!id) {
    return new Response('No record ID provided.', { status: 400 });
  }

  // Only a split id has a page here. Other /a/<name> links (home,
  // no-expense-day, ...) are for the app, so don't send them to a split page.
  if (!UUID.test(id)) {
    redirect('/open', RedirectType.replace);
  }

  // Use Next.js built-in redirect function for App Router
  redirect(`/instant-splits/${id}`, RedirectType.replace);
}
