import { redirect, RedirectType } from 'next/navigation';

export const runtime = 'edge';

// /a/group/<id>/... links (e.g. a reminder push opened on a device without
// the app) are for the app: the website shows settle-up only through shared
// /a/s/<token> links.
export function GET() {
  redirect('/open', RedirectType.replace);
}
