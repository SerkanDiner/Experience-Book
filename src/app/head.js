export default function Head() {
    return (
      <>
        <title>Experience Book – Real Stories from Real Careers</title>
        <meta name="description" content="Discover and share real career experiences from professionals across industries like tech, education, healthcare, and more." />
  
        {/* Favicon */}
        <link rel="icon" href="public/favicon.ico" />
  
        {/* Open Graph (used by Facebook, LinkedIn, etc.) */}
        <meta property="og:title" content="Experience Book" />
        <meta property="og:description" content="Explore real career stories. Share yours and inspire others." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://www.thexperiencebook.com" />
        <meta property="og:type" content="website" />
  
        {/* LinkedIn Preview (custom size, but still uses og:image by default) */}
        <meta property="og:image" content="/linkedin-card.jpg" />
  
        {/* Twitter / X Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Experience Book" />
        <meta name="twitter:description" content="Explore real career stories. Share yours and inspire others." />
        <meta name="twitter:image" content="/twitter-card.jpg" />
      </>
    );
  }
  