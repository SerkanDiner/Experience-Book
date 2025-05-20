import { connect } from "@/lib/mongodb/mongoose";
import Newsletter from "@/lib/models/newsletter.model";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connect();

    const body = await req.json();
    const { email, name, avatar, feedback, category, rating, title } = body;

    if (!email || !feedback) {
      return NextResponse.json({ error: "Email and feedback are required." }, { status: 400 });
    }

    const entry = await Newsletter.create({
      email,
      name: name?.trim() || "",
      avatar: avatar?.trim() || "",
      feedback: feedback.trim(),
      title: title?.trim() || "",
      category: category || "other",
      rating: rating >= 1 && rating <= 5 ? rating : null,
      approved: false,
      showOnHomepage: false,
    });

    return NextResponse.json({ success: true, entry });
  } catch (err) {
    console.error("❌ Newsletter POST error:", err);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
