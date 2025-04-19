import Link from 'next/link';
import CallToAction from './components/CallToAction';
import RecentPosts from './components/RecentPosts';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import NewsletterSignup from './components/NewsletterSignup';
import { UserCircle, Sparkles, Users, FileText } from 'lucide-react';

export default async function Home() {
  let posts = [];

  try {
    const response = await fetch(`${process.env.URL}/api/post/get`, {
      method: 'POST',
      body: JSON.stringify({ limit: 9, order: 'desc' }),
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      posts = data?.posts || [];
    } else {
      console.error('Fetch failed with status:', response.status);
    }
  } catch (error) {
    console.error('Error fetching posts:', error.message || error);
  }

  const testimonials = [
    {
      name: 'Emily Hart',
      image: '',
      quote:
        'Experience Book helped me decide between pursuing design or development. Real people, real paths.',
      rating: 5,
      category: 'praise',
    },
    {
      name: 'Marcus Reed',
      image: '',
      quote:
        'I used to feel lost post-graduation. Now I’m confident thanks to advice I found here.',
      rating: 4,
      category: 'suggestion',
    },
    {
      name: 'Sofia Delgado',
      image: '',
      quote:
        'This platform gave me clarity I couldn’t find anywhere else. Highly recommended.',
      rating: 5,
      category: 'praise',
    },
    {
      name: 'Anonymous',
      image: '',
      quote:
        'Even just reading other stories gave me courage to switch industries.',
      rating: 4,
      category: 'praise',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* 🌟 Hero Section */}
      <section className="px-6 pt-20 pb-16 text-center max-w-5xl mx-auto bg-white dark:bg-gray-900">
        <div className="flex justify-center items-center gap-2 text-orange-500 mb-3">
          <Sparkles className="w-6 h-6" />
          <h1 className="text-4xl font-bold lg:text-5xl text-gray-900 dark:text-white">
            Welcome to Experience Book
          </h1>
        </div>
        <p className="text-gray-600 text-base sm:text-lg dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Discover the power of real experiences. Learn from professionals who
          have navigated challenges, seized opportunities, and built successful
          careers. Their stories can guide you toward making informed, confident
          decisions for your own journey.
        </p>
        <Link
          href="/search"
          className="mt-4 inline-block text-sm sm:text-base text-orange-500 font-semibold hover:underline transition duration-300"
        >
          View All Experiences &rarr;
        </Link>
      </section>

      {/* 🗣️ Testimonials Section */}
      <TestimonialsCarousel testimonials={testimonials} />

      {/* 🚀 Call to Action Section */}
      <section className="bg-white dark:bg-gray-900 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Explore Industries & Professions
            </h2>
          </div>
          <CallToAction limit={3} />
        </div>
      </section>

      {/* 🆕 Recent Posts Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recently Shared Experiences
            </h2>
          </div>
          <RecentPosts limit={4} posts={posts} />
        </div>
      </section>

      {/* 📨 Newsletter Signup Section */}
      <NewsletterSignup />
    </div>
  );
}
