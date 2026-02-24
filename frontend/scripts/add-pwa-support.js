const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

const pwaMeta = `
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#FF9933">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Gau Seva">
<link rel="apple-touch-icon" href="/icon-192.png">
<link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png">
<link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png">
`;

// Get all HTML files in dist
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add PWA meta tags after <head>
  if (!content.includes('rel="manifest"')) {
    content = content.replace('<head>', '<head>' + pwaMeta);
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${file}`);
  }
});

console.log('PWA support added to all HTML files!');
