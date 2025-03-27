import Link from 'next/link';
import CallToAction from './components/CallToAction';
import RecentPosts from './components/RecentPosts';
import TestimonialsCarousel from './components/TestimonialsCarousel';

export default async function Home() {
  let posts = [];

  try {
    const response = await fetch(`${process.env.URL}/api/post/get`, {
      method: 'POST',
      body: JSON.stringify({ limit: 9, order: 'desc' }),
      cache: 'no-store',
    });

    const data = await response.json();
    posts = data?.posts || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
  }

  // Testimonials array
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
    <div className="flex flex-col justify-center items-center">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center gap-6 py-16 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold lg:text-5xl text-gray-900 dark:text-white">
          Welcome to Experience Book
        </h1>

        <p className="text-gray-600 text-base sm:text-lg dark:text-gray-300 leading-relaxed">
          Discover the power of real experiences. Learn from professionals who have navigated challenges, 
          seized opportunities, and built successful careers. Their stories can guide you toward making 
          informed, confident decisions for your own journey.
        </p>

        <Link
          href="/search?category=null"
          className="text-sm sm:text-base text-orange-500 font-semibold hover:underline transition duration-300"
        >
          View All Experiences &rarr;
        </Link>
      </div>

      {/* Testimonials */}
      <TestimonialsCarousel  testimonials={testimonials}/>

      <div className="flex flex-col items-center text-center py-16 px-6 max-w-6xl mx-auto">
        {/* Recent Posts Component */}
        <RecentPosts limit={4} />
      </div>

      {/* Call to Action */}
      <div className="flex flex-col items-center text-center py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Career Pathways</h2>
        <CallToAction />
      </div>
    </div>
  );
}