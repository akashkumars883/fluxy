const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/components/dashboard');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Aggressively remove any shadow- classes (shadow-md, shadow-zinc-500/20, shadow-[0_...], etc.)
  content = content.replace(/shadow-[a-zA-Z0-9\/\-\[\]\_]+/g, '');
  
  // Also remove standalone "shadow" and "shadow-inner"
  content = content.replace(/\bshadow\b/g, '');
  content = content.replace(/\bshadow-inner\b/g, '');
  content = content.replace(/\bdrop-shadow-[a-zA-Z0-9\-]+\b/g, '');

  // Replace any rounded-[...] with rounded-md
  content = content.replace(/rounded-\[[^\]]+\]/g, 'rounded-md');

  // Also catch double rounded classes if they exist e.g. "rounded-md rounded-md"
  content = content.replace(/rounded-md\s+rounded-md/g, 'rounded-md');

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Fixed shadows and custom radiuses in all dashboard components');
