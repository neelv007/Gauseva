const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const publicDir = path.join(__dirname, '..', 'public');

// PWA meta tags to inject
const pwaMeta = `
<link rel="manifest" href="./manifest.json">
<meta name="theme-color" content="#FF9933">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Gau Seva">
<link rel="apple-touch-icon" href="./icon-192.png">
<link rel="apple-touch-icon" sizes="192x192" href="./icon-192.png">
<link rel="apple-touch-icon" sizes="512x512" href="./icon-512.png">
<link rel="icon" type="image/png" sizes="192x192" href="./icon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="./icon-512.png">
`;

// Copy files from public to dist if they exist
const filesToCopy = ['manifest.json', 'icon-192.png', 'icon-512.png'];
filesToCopy.forEach(file => {
  const src = path.join(publicDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${file}`);
  }
});

// Get all HTML files in dist
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add PWA meta tags after <head> if not already present
  if (!content.includes('rel="manifest"')) {
    content = content.replace(/<head[^>]*>/, match => match + pwaMeta);
    fs.writeFileSync(filePath, content);
    console.log(`Updated HTML: ${file}`);
  }
});

// Create a simple service worker for offline support
const swContent = `
// Service Worker for Gau Seva PWA
const CACHE_NAME = 'gauseva-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('./index.html'))
  );
});
`;

fs.writeFileSync(path.join(distDir, 'sw.js'), swContent);
console.log('Created: sw.js (Service Worker)');

// Add service worker registration to HTML files
htmlFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('serviceWorker')) {
    const swScript = `
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW failed:', err));
  });
}
</script>
`;
    content = content.replace('</head>', swScript + '</head>');
    fs.writeFileSync(filePath, content);
    console.log(`Added SW registration to: ${file}`);
  }
});

console.log('\\n✅ PWA support added successfully!');
