import Comment from "@/lib/models/comment.model";
import Post from "@/lib/models/post.model";
import { addXP, incrementStat } from "@/lib/actions/user";
import UserStats from "@/lib/models/userStats.model";

// Add new comment
export async function handleNewComment({ postId, userId, content }) {
  const comment = await Comment.create({ postId, userId, content });

  // Update user stat
  await incrementStat(userId, "comment");

  // Add XP to commenter
  await addXP(userId, 10); // 💬 +10 XP per comment

  return comment;
}

// Like a comment
export async function toggleCommentLike({ commentId, likerId }) {
  const comment = await Comment.findById(commentId);
  if (!comment) return null;

  const hasLiked = comment.likes.includes(likerId);

  if (hasLiked) {
    comment.likes.pull(likerId);
    comment.likeCount -= 1;
  } else {
    comment.likes.push(likerId);
    comment.likeCount += 1;

    // XP reward to comment author
    if (comment.userId.toString() !== likerId.toString()) {
      await addXP(comment.userId, 5); // ❤️ +5 XP per like
      await incrementStat(comment.userId, "likeReceived");
    }
  }

  await comment.save();
  return comment.likeCount;
}

// Add reply (only post owner allowed, check separately in route)
export async function replyToComment({ commentId, userId, content }) {
  const comment = await Comment.findById(commentId);
  if (!comment) return null;

  comment.reply = { userId, content, createdAt: new Date() };

  // Optional XP for post author replying
  await addXP(userId, 8); // 🗣️ +8 XP for thoughtful reply

  await comment.save();
  return comment;
}
