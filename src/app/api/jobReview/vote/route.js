import { connect } from '@/lib/mongodb/mongoose';
import JobReview from '@/lib/models/jobReview.model';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await connect();
    const { id, vote } = await req.json();

    if (!id || !['agree', 'disagree'].includes(vote)) {
      return Response.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const update =
      vote === 'agree'
        ? { $inc: { xp: 10, agrees: 1 } }
        : { $inc: { xp: -5, disagrees: 1 } };

    const updated = await JobReview.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updated) {
      return Response.json({ error: 'Review not found' }, { status: 404 });
    }

    return Response.json({ success: true, updated });
  } catch (err) {
    console.error('❌ Vote API error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
