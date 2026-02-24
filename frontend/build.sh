#!/bin/bash
# Build script for Vercel with PWA support

# Run expo export
npx expo export --platform web

# Add PWA meta tags to all HTML files
for file in dist/*.html; do
  sed -i 's|<head>|<head>\n<link rel="manifest" href="/manifest.json">\n<meta name="theme-color" content="#FF9933">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n<meta name="apple-mobile-web-app-title" content="Gau Seva">\n<link rel="apple-touch-icon" href="/icon-192.png">|' "$file"
done

echo "Build complete with PWA support!"
