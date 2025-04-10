const fs = require('fs');
const path = require('path');

const APP_DIR = './src/app'; // ← adjusted for src/app structure
const excludedDirs = ['components', 'styles', 'fonts', 'api'];

function findPages(dir, baseRoute = '') {
  let pages = [];

  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !excludedDirs.includes(file)) {
      const newBase = file.startsWith('(') ? baseRoute : `${baseRoute}/${file}`;
      pages = pages.concat(findPages(fullPath, newBase));
    } else if (file === 'page.jsx' || file === 'page.tsx') {
      pages.push(baseRoute || '/');
    }
  });

  return pages;
}

const allPages = findPages(APP_DIR);
console.log('✅ Found App Router Pages:\n', allPages.join('\n'));
