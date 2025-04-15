import { connect } from "@/lib/mongodb/mongoose";
import Newsletter from "@/lib/models/newsletter.model";

export const dynamic = "force-dynamic";

// ✅ GET: Load approved testimonials for display
export async function GET() {
  try {
    await connect();
    const testimonials = await Newsletter.find({
      feedback: { $ne: "" },
      approved: true,
      showOnHomepage: true,
    })
      .select("name avatar feedback category rating title") // 👈 Only pull needed fields
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    return Response.json({ testimonials });
  } catch (err) {
    console.error("❌ GET testimonials error:", err);
    return Response.json({ error: "Failed to load testimonials" }, { status: 500 });
  }
}

// ✅ POST: Save newsletter feedback for moderation
export async function POST(req) {
  try {
    await connect();

    const body = await req.json();
    const { email, name, avatar, feedback, category, rating, title } = body;

    if (!email || !feedback) {
      return Response.json({ error: "Email and feedback are required." }, { status: 400 });
    }

    const entry = await Newsletter.create({
      email,
      name: name?.trim() || "",
      avatar: avatar?.trim() || "",
      feedback: feedback.trim(),
      title: title?.trim() || "", // Optional title
      category: category || "other",
      rating: rating >= 1 && rating <= 5 ? rating : null,
      approved: false,
      showOnHomepage: false,
    });

    return Response.json({ success: true, entry });
  } catch (err) {
    console.error("❌ Newsletter POST error:", err);
    return Response.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
