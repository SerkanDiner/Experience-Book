import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('❌ Webhook verification failed:', err);
    return new Response('Unauthorized webhook', { status: 400 });
  }

  const { id } = evt?.data;
  const eventType = evt?.type;
  console.log(`📩 Webhook event: ${eventType} for user ID: ${id}`);

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const clerkUser = evt?.data;

    // 💥 Apply safe fallback for missing username before syncing
    if (!clerkUser.username) {
      const fallbackUsername =
        clerkUser.email_addresses?.[0]?.email_address?.split('@')[0] || `user-${Date.now()}`;
      clerkUser.username = fallbackUsername;
      console.warn('⚠️ Missing username, applied fallback:', fallbackUsername);
    }

    const user = await createOrUpdateUser(clerkUser);

    if (user && eventType === 'user.created') {
      try {
        // ✅ Clerk metadata update via REST API
        await fetch(`https://api.clerk.com/v1/users/${clerkUser.id}/metadata`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            public_metadata: {
              userMongoId: user._id.toString(),
              isAdmin: user.isAdmin || false,
            },
          }),
        });

        console.log('✅ Clerk metadata updated');
      } catch (error) {
        console.warn('⚠️ Skipped Clerk metadata update:', error.message);
      }
    }
  }

  if (eventType === 'user.deleted') {
    await deleteUser(id);
  }

  return new Response('Success', { status: 200 });
}
