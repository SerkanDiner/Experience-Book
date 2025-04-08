import { connectToDB } from "@/lib/mongodb/mongoose";
import Video from "@/lib/models/video.model";

export async function POST(req) {
  try {
    await connectToDB();

    const { title, description, embedCode } = await req.json();

    if (!title || !embedCode) {
      return new Response("Missing required fields", { status: 400 });
    }

    const newVideo = new Video({ title, description, embedCode });
    const savedVideo = await newVideo.save();

    return new Response(JSON.stringify(savedVideo), { status: 201 });
  } catch (error) {
    console.error("❌ Error in /api/videos:", error);
    return new Response("Failed to save video", { status: 500 });
  }
}
