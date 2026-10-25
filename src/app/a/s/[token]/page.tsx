import type { Metadata } from 'next';
import { headers } from 'next/headers';

import AppPitch from '@/components/common/AppPitch';
import { formatCurrencyAmount } from '@/lib/currencyUtils';
import { isLinkPreview, loadShareLink } from './data';
import PaymentMethodList from './PaymentMethodList';

export const runtime = 'edge';

const card =
  'rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';

type Props = { params: Promise<{ token: string }> };

// What chat apps show under the link.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const link = await loadShareLink(token, { countOpen: false });
  if (!link) return { title: 'Combifi' };
  const title =
    link.kind === 'remind'
      ? `${link.sharedBy.name} sent you a reminder · ${link.groupName}`
      : `Settle up · ${link.groupName}`;
  return {
    title,
    description: 'Split bills and settle up with friends in Combifi.',
    openGraph: { title, siteName: 'Combifi' },
  };
}

/**
 * A link shared from the app's Settle up (https://m.combifi.app/a/s/<token>).
 * The app opens it directly when installed; this page is for everyone else.
 * It shows the payments as they were when shared (dated): a reminder shows
 * the one payment asked for; a group link shows the whole plan, and tapping a
 * payment shows how to pay. Only the sharer's payment details are shown.
 */
export default async function SharedSettleUpPage({ params }: Props) {
  const { token } = await params;
  const userAgent = (await headers()).get('user-agent');
  const link = await loadShareLink(token, {
    countOpen: !isLinkPreview(userAgent),
  });
  const appPath = `a/s/${token}`;

  if (!link) {
    return (
      <Shell>
        <Notice
          title="This link isn't valid"
          body="It may have been mistyped, or the group no longer exists."
        />
        <AppPitch
          heading="Split bills with friends"
          body="Combifi keeps track of who paid and who owes, so nobody has to."
        />
      </Shell>
    );
  }

  const sharer = link.sharedBy.name;
  const pitch = (
    <AppPitch
      heading={`Settle up ${link.groupName} in Combifi`}
      body={`See what you owe ${sharer} as it changes, get reminders, and mark payments in a tap.`}
      appPath={appPath}
    />
  );

  if (link.status === 'expired') {
    return (
      <Shell title={link.groupName}>
        <Notice
          title="This link has expired"
          body={`Ask ${sharer} to share it again, or open Combifi for the latest balances.`}
        />
        {pitch}
      </Shell>
    );
  }

  const asOf = `As of ${formatDate(link.sharedAt)}`;
  const reminder =
    link.kind === 'remind'
      ? link.routes.find(
          (route) => route.payerParticipantId === link.focusParticipantId
        )
      : undefined;

  const paysSharer = link.routes.some((route) => route.toSharer);
  const howToPay = paysSharer ? (
    <section className="space-y-3">
      <h2 className="px-1 text-sm font-semibold text-gray-700">
        How to pay {sharer}
      </h2>
      {link.paymentMethods.length > 0 ? (
        <PaymentMethodList methods={link.paymentMethods} />
      ) : (
        <p className={`${card} p-4 text-sm text-gray-500`}>
          {sharer} hasn&apos;t added payment details yet. Ask them how
          they&apos;d like to be paid.
        </p>
      )}
    </section>
  ) : null;

  if (link.kind === 'remind' && reminder) {
    return (
      <Shell title={link.groupName} subtitle={`Reminder from ${sharer}`}>
        <section className={`${card} p-5`}>
          <p className="text-gray-700">
            Hi {reminder.payerName}, please pay{' '}
            <span className="font-semibold">{reminder.receiverName}</span>
          </p>
          <p className="mt-1 text-4xl font-semibold text-gray-900">
            {formatCurrencyAmount(reminder.amount, link.currency)}
          </p>
          <p className="mt-1 text-xs text-gray-500">{asOf}</p>
        </section>
        {howToPay}
        {pitch}
      </Shell>
    );
  }

  return (
    <Shell title={link.groupName} subtitle={`Shared by ${sharer} · ${asOf}`}>
      <section className={card}>
        {link.routes.length === 0 ? (
          <p className="p-4 text-center text-gray-700">
            Everyone is settled up 🎉
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {link.routes.map((route) => (
              <li
                key={`${route.payerParticipantId}:${route.receiverParticipantId}`}
                className="flex items-center gap-3 px-4 py-3"
              >
                <span className="min-w-0 flex-1 truncate text-gray-800">
                  {route.payerName} <span className="text-gray-400">→</span>{' '}
                  {route.receiverName}
                </span>
                <span className="font-semibold text-gray-900">
                  {formatCurrencyAmount(route.amount, link.currency)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      {link.routes.some((route) => !route.toSharer) ? (
        <p className="px-1 text-xs text-gray-500">
          Paying someone else? Ask them how they&apos;d like to be paid.
        </p>
      ) : null}
      {howToPay}
      {pitch}
    </Shell>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className={`${card} p-4 text-center space-y-2`}>
      <p className="font-medium text-gray-900 dark:text-gray-100">{title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{body}</p>
    </div>
  );
}

function Shell({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="mx-auto w-full max-w-md space-y-4">
        <header className="text-center space-y-1">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Combifi · Settle up
          </p>
          {title ? (
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>
          ) : null}
        </header>
        {children}
      </div>
    </main>
  );
}
