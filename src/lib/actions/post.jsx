import Post from "@/lib/models/post.model";
import { addXP, incrementStat, updateTopPost } from "@/lib/actions/user";
import UserStats from "@/lib/models/userStats.model";
import { connect } from "@/lib/mongodb/mongoose";

// When a new post is created
export async function handleNewPost({ userId, postData }) {
  await connect();
  const post = await Post.create(postData);

  // Award XP for posting
  await addXP(userId, 30); // 📝 +30 XP per post

  // Update post count
  await incrementStat(userId, "post");

  return post;
}

// Like a post (toggle like from UI logic)
export async function togglePostLike({ postId, likerId }) {
  await connect();
  const post = await Post.findById(postId);
  if (!post) return null;

  const hasLiked = post.likeUsers.includes(likerId);

  if (hasLiked) {
    post.likeUsers.pull(likerId);
    post.likes -= 1;
  } else {
    post.likeUsers.push(likerId);
    post.likes += 1;

    // Add XP to post author (if not liking own post)
    if (post.userId.toString() !== likerId.toString()) {
      await addXP(post.userId, 10); // ❤️ +10 XP per post like
      await incrementStat(post.userId, "likeReceived");

      // Optional: Update most liked post
      await updateTopPost(post.userId, "liked", post._id);
    }
  }

  await post.save();
  return post.likes;
}

// View count tracker (optional session-based)
export async function registerPostView({ postId, viewerId }) {
  await connect();
  const post = await Post.findById(postId);
  if (!post) return;

  post.views += 1;
  await post.save();

  // Stat update (no XP for just viewing)
  await incrementStat(post.userId, "view");

  // Optional: Track top viewed
  const authorId = post.userId.toString();
  await updateTopPost(authorId, "viewed", post._id);
}

// Share tracker (triggered on successful share)
export async function registerPostShare({ postId, sharerId }) {
  await connect();
  const post = await Post.findById(postId);
  if (!post) return;

  post.shares += 1;
  await post.save();

  await incrementStat(post.userId, "share");
  await addXP(post.userId, 5); // 📤 +5 XP for post shared
}

// ✅ Get all posts created by a specific user
export async function getUserPosts(userId) {
  await connect();
  const posts = await Post.find({ userId }).sort({ createdAt: -1 }).lean();
  return posts;
}
