import { connect } from "@/lib/mongodb/mongoose";
import Video from "@/lib/models/video.model";

// GET: Fetch all videos
export async function GET() {
  try {
    await connect();
    const videos = await Video.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(videos), { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching videos:", error);
    return new Response("Failed to fetch videos", { status: 500 });
  }
}

// POST: Add a new video
export async function POST(req) {
  try {
    await connect();

    const { title, description, url } = await req.json();

    if (!title || !url) {
      return new Response("Missing required fields", { status: 400 });
    }

    const newVideo = new Video({ title, description, url });
    const savedVideo = await newVideo.save();

    return new Response(JSON.stringify(savedVideo), { status: 201 });
  } catch (error) {
    console.error("❌ Error saving video:", error);
    return new Response("Failed to save video", { status: 500 });
  }
}
