import { auth } from '@clerk/nextjs/server';
import { connect } from "@/lib/mongodb/mongoose";
import Post from "@/lib/models/post.model";
import { handleNewPost } from "@/lib/actions/post";

/**
 * GET: Fetch all posts (newest first)
 */
export async function GET() {
  try {
    await connect();

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username profilePicture")
      .lean();

    return Response.json(posts);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return new Response("Failed to fetch posts", { status: 500 });
  }
}

/**
 * POST: Create a new post
 */
export async function POST(req) {
  try {
    await connect();

    const { userId } = auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const data = await req.json();

    // 🌍 Ensure the language field is always passed, default to "en"
    const postData = {
      ...data,
      language: data.language || "en", // ✅ Default to English if not provided
      userId,
    };

    const newPost = await handleNewPost({ userId, postData });

    return Response.json(newPost, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating post:", error);
    return new Response("Failed to create post", { status: 500 });
  }
}
