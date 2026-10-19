import AppPitch from '@/components/common/AppPitch';

export default function PromoBanner() {
  return (
    <div className="mx-auto max-w-xs">
      <AppPitch
        heading="Continue on mobile"
        body="Track splits and payments automatically. No passwords next time."
      />
    </div>
  );
}
