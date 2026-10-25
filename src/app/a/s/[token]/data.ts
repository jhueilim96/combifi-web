// Shared settle-up links come from the Worker (pennywise-worker
// src/groupShareLinks.ts): the group name, who shared, the payments as they
// were when shared, and the sharer's own payment details.

export type SharePaymentMethod = {
  provider: string;
  label: string;
  type: string;
  details: string | null;
  image_key: string | null;
  image_url: string | null;
  image_expired_at: number | null;
  is_primary: boolean;
};

export type ShareRoute = {
  payerParticipantId: string;
  payerName: string;
  receiverParticipantId: string;
  receiverName: string;
  amount: number;
  /** Paid to the person who shared: their payment details apply. */
  toSharer: boolean;
};

export type ShareLink = {
  kind: 'remind' | 'group';
  status: 'active' | 'expired';
  groupId: string;
  groupName: string;
  currency: string;
  sharedBy: { participantId: string; name: string };
  /** remind only: the person asked to pay. */
  focusParticipantId: string | null;
  sharedAt: string;
  expiresAt: string;
  routes: ShareRoute[];
  paymentMethods: SharePaymentMethod[];
};

export const SHARE_TOKEN = /^[A-Za-z0-9]{10}$/;

// Chat apps fetch a link to build its preview; that is not someone opening it.
const LINK_PREVIEW_AGENT =
  /bot|crawler|spider|facebookexternalhit|whatsapp|telegram|slack|discord|skype|line\/|preview/i;

export const isLinkPreview = (userAgent: string | null) =>
  !userAgent || LINK_PREVIEW_AGENT.test(userAgent);

async function refreshedImageUrl(imageKey: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WORKER_BASE_URL}/users/QR/${imageKey}/share`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      cache: 'no-store',
    }
  );
  if (!response.ok) return null;
  const json = await response.json();
  return json?.success
    ? (json.data as { shareUrl: string; expiredAt: number })
    : null;
}

/** null when the link does not exist, was revoked, or its group is gone. */
export async function loadShareLink(
  token: string,
  { countOpen }: { countOpen: boolean }
): Promise<ShareLink | null> {
  if (!SHARE_TOKEN.test(token)) return null;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WORKER_BASE_URL}/group-share-links/${token}${
      countOpen ? '' : '?preview=1'
    }`,
    { cache: 'no-store' }
  );
  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.success) {
    if (response.status !== 404) {
      console.error('Unable to load share link', response.status, json);
    }
    return null;
  }

  const link = json.data as ShareLink;
  // QR images are signed links that expire; refresh any that have.
  link.paymentMethods = await Promise.all(
    link.paymentMethods.map(async (method) => {
      const expired =
        method.image_expired_at && method.image_expired_at < Date.now();
      if (method.image_key && (expired || !method.image_url)) {
        const fresh = await refreshedImageUrl(method.image_key);
        if (fresh) {
          return {
            ...method,
            image_url: fresh.shareUrl,
            image_expired_at: fresh.expiredAt,
          };
        }
      }
      return method;
    })
  );
  return link;
}
