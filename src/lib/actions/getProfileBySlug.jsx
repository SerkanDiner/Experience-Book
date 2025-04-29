import { connect } from '@/lib/mongodb/mongoose';
import Profile from '@/lib/models/profile.model';

export async function getProfileBySlug(slug) {
  try {
    await connect();

    const profile = await Profile.findOne({ slug }).populate('user');

    if (!profile) return null;

    return JSON.parse(JSON.stringify(profile)); // ✅ Clean it for Next.js/JSON usage
  } catch (error) {
    console.error('❌ Error fetching profile by slug:', error);
    return null;
  }
}
