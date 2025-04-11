import Link from 'next/link';
import CallToAction from './components/CallToAction';
import RecentPosts from './components/RecentPosts';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import NewsletterSignup from './components/NewsletterSignup';

import { Sparkles, Users, FileText } from 'lucide-react';

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
    console.error('Error fetching posts:', error);
  }

  const testimonials = [
    {
      name: 'Bonnie Green',
      role: 'Career Coach & Mentor',
      image: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png',
      title: 'A Platform That Truly Empowers',
      quote:
        'Sharing experiences on Experience Book has been a game-changer. It allows professionals to guide others by sharing real-world insights, making career choices much easier.',
    },
    {
      name: 'Roberta Casas',
      role: 'UX Designer & Educator',
      image: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png',
      title: 'Structured & Insightful Learning',
      quote:
        'Experience Book bridges the gap between theoretical knowledge and real-life experience. It is a must-have resource for anyone looking to make informed career decisions.',
    },
    {
      name: 'Jese Leos',
      role: 'Software Engineer & Mentor',
      image: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png',
      title: 'Practical Knowledge at Your Fingertips',
      quote:
        'Unlike generic career advice platforms, Experience Book provides hands-on, practical insights from professionals who have walked the path before you.',
    },
    {
      name: 'Joseph McFall',
      role: 'Entrepreneur & Public Speaker',
      image: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png',
      title: 'Mentorship Made Accessible',
      quote:
        'Experience Book is revolutionizing how people access mentorship. Whether you are switching careers or just starting out, this platform connects you with real experts.',
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
          Discover the power of real experiences. Learn from professionals who have navigated challenges,
          seized opportunities, and built successful careers. Their stories can guide you toward making
          informed, confident decisions for your own journey.
        </p>
        <Link
          href="/search"
          className="mt-4 inline-block text-sm sm:text-base text-orange-500 font-semibold hover:underline transition duration-300"
        >
          View All Experiences &rarr;
        </Link>
      </section>

      {/* 💬 Testimonials Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* 🚀 Call to Action */}
      <section className="bg-white dark:bg-gray-900 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Explore Industries & Professions
            </h2>
          </div>
          <CallToAction limit={6} />
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
          <RecentPosts limit={4} />
        </div>
      </section>

      <NewsletterSignup />

    </div>
  );
}
