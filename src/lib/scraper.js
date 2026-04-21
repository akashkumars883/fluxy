/* src/lib/scraper.js - Automatic Link Preview Engine */

/**
 * Basic scraper to extract the OpenGraph image from a URL.
 * Falls back to null if no image is found.
 */
export async function getLinkPreview(url) {
  if (!url) return null;
  
  try {
    const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' },
        signal: AbortSignal.timeout(3000) // Timeout after 3s to prevent hanging
    });
    
    if (!response.ok) return null;
    
    const html = await response.text();
    
    // Search for og:image meta tag
    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    
    if (ogImageMatch && ogImageMatch[1]) {
      let imageUrl = ogImageMatch[1];
      // Ensure absolute path
      if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
      if (imageUrl.startsWith('/')) {
        const urlObj = new URL(url);
        imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
      }
      return imageUrl;
    }
    
    return null;
  } catch (error) {
    console.warn(`⚠️ Scraper failed for ${url}:`, error.message);
    return null;
  }
}
