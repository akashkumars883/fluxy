const fs = require('fs');
const path = require('path');

const files = [
  'src/app/dashboard/page.jsx',
  'src/components/dashboard/DashboardSidebar.jsx',
  'src/components/dashboard/CreatorOverview.jsx',
  'src/components/dashboard/AnalyticsDashboard.jsx',
  'src/components/dashboard/EmptyState.jsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Replace all indigo with sage (for backgrounds, borders, text, rings)
    content = content.replace(/indigo-/g, 'sage-');
    
    // 2. Replace all gray/zinc text colors with text-black
    content = content.replace(/text-zinc-400/g, 'text-black opacity-60');
    content = content.replace(/text-zinc-500/g, 'text-black opacity-80');
    content = content.replace(/text-zinc-600/g, 'text-black opacity-90');
    content = content.replace(/text-zinc-700/g, 'text-black');
    content = content.replace(/text-zinc-800/g, 'text-black');
    content = content.replace(/text-zinc-900/g, 'text-black');
    
    // 3. Flatten shadows
    content = content.replace(/shadow-sm/g, '');
    content = content.replace(/shadow-md/g, '');
    content = content.replace(/shadow-lg/g, '');
    content = content.replace(/shadow-xl/g, '');
    
    // 4. Reduce extreme border radiuses
    content = content.replace(/rounded-2xl/g, 'rounded-md');
    content = content.replace(/rounded-3xl/g, 'rounded-lg');
    content = content.replace(/rounded-xl/g, 'rounded-md');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
