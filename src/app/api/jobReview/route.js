import { connect } from '@/lib/mongodb/mongoose';
import JobReview from '@/lib/models/jobReview.model';

export const dynamic = 'force-dynamic';

// ✅ GET: Fetch all job reviews
export async function GET() {
  try {
    await connect();
    const reviews = await JobReview.find({}).sort({ xp: -1 }).lean();
    return Response.json({ reviews });
  } catch (error) {
    console.error('❌ Job review GET error:', error);
    return Response.json({ error: 'Failed to fetch job reviews.' }, { status: 500 });
  }
}




// ✅ POST: Submit new job review
export async function POST(req) {
  try {
    await connect();

    const body = await req.json();
    const { jobTitle, country, monthlySalary, recommended } = body;

    if (!jobTitle || !country || !monthlySalary || typeof recommended !== 'boolean') {
      return Response.json({ error: 'Missing or invalid fields.' }, { status: 400 });
    }

    const createdReview = await JobReview.create({
      jobTitle: jobTitle.trim(),
      country: country.trim(),
      monthlySalary,
      recommended,
      xp: 0,
      agrees: 0,
      disagrees: 0,
    });

    const review = createdReview.toObject();
    review._id = review._id.toString();

    return Response.json({ success: true, review });
  } catch (error) {
    console.error('❌ Job review POST error:', error);
    return Response.json({ error: 'Failed to submit job review.' }, { status: 500 });
  }
}

