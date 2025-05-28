'use client';

export default function About() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 sm:p-10">
        
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center mb-8">
          About <span className="text-orange-500">Experience Book</span>
        </h1>

        {/* Content */}
        <div className="flex flex-col gap-6 text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">

          <p className="border-l-4 border-orange-400 pl-4">
            <strong className="text-gray-800 dark:text-white">Experience Book</strong> is a platform designed to share real-world career experiences and insights. 
            We believe that learning from the experiences of others can guide individuals toward making informed career decisions. 
            Our mission is to connect professionals from different industries with those seeking advice, mentorship, and a deeper understanding of various career paths.
          </p>

          <p className="border-l-4 border-orange-400 pl-4">
            Whether you are a student exploring career options, a professional considering a change, 
            or someone curious about different industries, <strong className="text-gray-800 dark:text-white">Experience Book</strong> offers a space where stories, challenges, 
            and lessons are shared to make career advice more accessible, relatable, and practical.
          </p>

          <p className="border-l-4 border-orange-400 pl-4">
            <strong className="text-gray-800 dark:text-white">Join Our Community:</strong>  
            Explore stories, engage with others, and even contribute your own experiences.  
            By participating in discussions, liking posts, and responding to comments, you become part of a supportive learning community where insights and experiences shape meaningful career choices.
          </p>

          {/* 👇 New Paragraph About the Company */}
          <p className="border-l-4 border-orange-400 pl-4">
            <strong className="text-gray-800 dark:text-white">Ownership & Development:</strong>{' '}
            Experience Book is proudly developed and maintained by a UK-registered company,
            <strong> BEES-X LIMITED</strong>, based in Watford, England. 
            As a private limited company specializing in software publishing and development, 
            our goal is to build innovative platforms that deliver real-world value through technology, education, and community.
          </p>

          <p className="pt-4 border-t text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
            This platform is built with <strong>Next.js</strong> and{' '}
            <a
              href="https://go.clerk.com/fgJHKlt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:underline"
            >
              Clerk
            </a>{' '}
            for a secure and seamless experience.
          </p>
        </div>
      </div>
    </section>
  );
}
