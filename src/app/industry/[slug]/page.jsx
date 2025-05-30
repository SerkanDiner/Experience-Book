export const dynamic = 'force-dynamic';

import IndustryTabs from '@/app/components/IndustryTabs';
import { connect } from '@/lib/mongodb/mongoose';
import Post from '@/lib/models/post.model';
import { industryInfo } from '@/constants/industryData';
import SeoHeadWrapper from '@/app/components/SeoHeadWrapper'; // ✅ use this instead of direct SeoHead

import Link from 'next/link';
import Head from 'next/head';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import IndustryClientWrapper from '@/app/components/IndustryClientWrapper'; // ✅ NEW client wrapper

export default async function IndustryPage({ params }) {
  const slug = params.slug;

  await connect();

  const posts = await Post.find({ industry: slug });
  const plainPosts = posts.map((post) => JSON.parse(JSON.stringify(post)));

  const industry = industryInfo[slug];
  const industryKeys = Object.keys(industryInfo);
  const currentIndex = industryKeys.indexOf(slug);
  const prevIndustry = industryKeys[currentIndex - 1];
  const nextIndustry = industryKeys[currentIndex + 1];

  const title = `${industry?.title || slug} Careers | Experience Book`;
  const description = `Explore real-world stories and shared experiences from professionals working in the ${industry?.title || slug} industry.`;
  const url = `https://www.experiencebook.com/industry/${slug}`;

  return (
    <>
      {/* 🔍 SEO Meta Tags */}
      <SeoHeadWrapper title={title} description={description} url={url} />



      {/* 🧠 Structured Schema */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: title,
              description,
              url,
            }),
          }}
        />
      </Head>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* 🧡 Dynamic Summary & Select Menu */}
        <IndustryClientWrapper industry={industry} slug={slug} />

        {/* 📑 Tabs: Posts, Jobs, Users, Products */}
        <IndustryTabs posts={plainPosts} industry={industry} slug={slug} />

        {/* ⏮️ Industry Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-16 gap-4">
          {/* Previous Industry */}
          {prevIndustry ? (
            <Link
              href={`/industry/${prevIndustry}`}
              className="flex items-center gap-2 px-5 py-2 rounded bg-white dark:bg-gray-900 text-orange-600 border border-orange-400 hover:bg-orange-100 transition"
            >
              <FaArrowLeft />
              {industryInfo[prevIndustry]?.title || prevIndustry}
            </Link>
          ) : (
            <div />
          )}

          {/* Next Industry */}
          {nextIndustry ? (
            <Link
              href={`/industry/${nextIndustry}`}
              className="flex items-center gap-2 px-5 py-2 rounded bg-white dark:bg-gray-900 text-orange-600 border border-orange-400 hover:bg-orange-100 transition"
            >
              {industryInfo[nextIndustry]?.title || nextIndustry}
              <FaArrowRight />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </>
  );
}
