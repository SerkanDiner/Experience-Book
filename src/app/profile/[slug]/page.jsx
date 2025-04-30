import { notFound } from 'next/navigation';
import ClientProfilePage from './ClientProfilePage';

export const dynamic = 'force-dynamic';

export default async function PublicProfilePage({ params }) {
  const slug = params?.slug;
  if (!slug) notFound();

  let profile = null;

  try {
    const res = await fetch(`${process.env.URL}/api/profile/get`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });

    const data = await res.json();
    profile = data?.profile;
  } catch (err) {
    console.error('❌ Failed to fetch profile:', err);
    notFound();
  }

  if (!profile || !profile.isPublic) {
    notFound();
  }

  return <ClientProfilePage profile={profile} />;
}
