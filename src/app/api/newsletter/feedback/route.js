import { connect } from "@/lib/mongodb/mongoose";
import Newsletter from "@/lib/models/newsletter.model";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connect();

    const feedback = await Newsletter.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error("❌ Failed to load feedback:", error);
    return NextResponse.json({ error: "Failed to load feedback" }, { status: 500 });
  }
}
