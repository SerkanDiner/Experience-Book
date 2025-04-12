'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { FaThumbsUp } from 'react-icons/fa';

const QuestionList = ({
  postId,
  currentUserId,
  postAuthorId,
  isAdmin,
  newQuestion // ✅ Accept injected new question
}) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [showAnswerInput, setShowAnswerInput] = useState({});
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  // ✅ Fetch initial questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`/api/questions?postId=${postId}`);
        const data = await res.json();
        if (res.ok) {
          setQuestions(data.questions);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [postId]);

  // ✅ Inject new question immediately after submit
  useEffect(() => {
    if (newQuestion && newQuestion._id) {
      setQuestions((prev) => [newQuestion, ...prev]);
    }
  }, [newQuestion]);

  const handleAnswerSubmit = async (e, questionId) => {
    e.preventDefault();
    const answer = answers[questionId];
    if (!answer) return;

    try {
      const res = await fetch(`/api/questions/answer`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, answer }),
      });

      if (res.ok) {
        setQuestions((prev) =>
          prev.map((q) => (q._id === questionId ? { ...q, answer, isAnswered: true } : q))
        );
        setAnswers((prev) => ({ ...prev, [questionId]: '' }));
        setShowAnswerInput((prev) => ({ ...prev, [questionId]: false }));
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleLike = async (questionId) => {
    try {
      const res = await fetch('/api/questions/like', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, userId: currentUserId }),
      });

      const data = await res.json();
      if (res.ok) {
        setQuestions((prev) =>
          prev.map((q) =>
            q._id === questionId
              ? { ...q, likes: data.likes, likedBy: data.likedBy }
              : q
          )
        );
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const filteredQuestions = questions
    .filter((q) => {
      if (filter === 'answered') return !!q.answer;
      if (filter === 'unanswered') return !q.answer;
      return true;
    })
    .sort((a, b) => b.likes - a.likes || new Date(b.createdAt) - new Date(a.createdAt));

  const questionsToShow = showAll ? filteredQuestions : filteredQuestions.slice(0, 4);

  if (loading) return <p className="text-gray-500 dark:text-gray-400 text-center">Loading questions...</p>;
  if (!filteredQuestions.length) return <p className="text-gray-500 dark:text-gray-400 text-center">No questions to show.</p>;

  return (
    <div className="mt-6">
      {/* 🔁 Filter Dropdown */}
      <div className="mb-4 flex justify-end">
        <select
          className="border px-3 py-2 rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">🔁 All Questions</option>
          <option value="unanswered">❓ Unanswered Only</option>
          <option value="answered">✅ Answered Only</option>
        </select>
      </div>

      <div className="space-y-6">
        {questionsToShow.map((q) => {
          const canAnswer = currentUserId === postAuthorId || isAdmin;
          const isUnanswered = !q.answer;
          const hasLiked = q.likedBy?.includes(currentUserId);

          return (
            <div
              key={q._id}
              id={`question-${q._id}`}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {q.userAvatar && (
                    <img
                      src={q.userAvatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{q.userName || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => handleLike(q._id)}
                    className={`flex items-center gap-1 text-xs font-medium ${
                      hasLiked ? 'text-orange-600' : 'text-gray-500 hover:text-orange-500'
                    }`}
                  >
                    <FaThumbsUp className="text-sm" />
                    {q.likes || 0}
                  </button>

                  {q.answer ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200">
                      Answered
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200">
                      Awaiting answer
                    </span>
                  )}
                </div>
              </div>

              {/* Question */}
              <p className="mb-3 text-gray-800 dark:text-gray-200">{q.question}</p>

              {/* Answer */}
              {q.answer && (
                <div className="mt-3 ml-4 border-l-4 border-green-400 pl-4 bg-green-50 dark:bg-green-800/20 rounded-md">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-1">Answer:</p>
                  <p className="text-gray-700 dark:text-gray-200">{q.answer}</p>
                </div>
              )}

              {/* Answer form */}
              {canAnswer && isUnanswered && (
                <div className="mt-3">
                  {!showAnswerInput[q._id] ? (
                    <button
                      onClick={() => setShowAnswerInput((prev) => ({ ...prev, [q._id]: true }))}
                      className="text-sm text-orange-600 hover:text-orange-800 underline"
                    >
                      Answer this question
                    </button>
                  ) : (
                    <AnimatePresence>
                      <motion.form
                        key="answer-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={(e) => handleAnswerSubmit(e, q._id)}
                        className="space-y-2 mt-2 overflow-hidden"
                      >
                        <textarea
                          rows="2"
                          className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:text-white"
                          placeholder="Write your answer..."
                          value={answers[q._id] || ''}
                          onChange={(e) => setAnswers({ ...answers, [q._id]: e.target.value })}
                        ></textarea>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
                          >
                            Submit Answer
                          </button>
                          <button
                            type="button"
                            className="text-sm text-gray-500 hover:underline"
                            onClick={() => setShowAnswerInput((prev) => ({ ...prev, [q._id]: false }))}
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.form>
                    </AnimatePresence>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* See More Button */}
      {filteredQuestions.length > 4 && !showAll && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="text-sm text-orange-600 hover:underline"
          >
            See all {filteredQuestions.length} questions
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionList;
