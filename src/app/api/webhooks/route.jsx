import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';
import { Clerk } from '@clerk/clerk-sdk-node';

const clerkClient = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

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
    // ✅ FIXED: Use whole clerkUser object instead of destructuring
    const clerkUser = evt?.data;
    const user = await createOrUpdateUser(clerkUser);

    if (user && eventType === 'user.created') {
      try {
        await clerkClient.users.updateUserMetadata(clerkUser.id, {
          publicMetadata: {
            userMongoId: user._id.toString(),
            isAdmin: user.isAdmin || false,
          },
        });
        console.log('✅ Clerk metadata updated:', {
          userMongoId: user._id.toString(),
          isAdmin: user.isAdmin || false,
        });
      } catch (error) {
        console.warn('⚠️ Skipped Clerk metadata update (not critical):', error.message);
      }
    }
  }

  if (eventType === 'user.deleted') {
    await deleteUser(id);
  }

  return new Response('Success', { status: 200 });
}
