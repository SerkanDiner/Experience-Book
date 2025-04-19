import Post from "@/lib/models/post.model";
import { connect } from "@/lib/mongodb/mongoose";

// ✅ Handles new post creation
export async function handleNewPost({ userId, postData }) {
  try {
    await connect();

    // Attach userId to the post (security + tracking)
    const post = await Post.create({
      ...postData,
      userId,
    });

    return post;
  } catch (error) {
    console.error("❌ Error creating post:", error);
    throw new Error("Failed to create post. Please try again.");
  }
}
