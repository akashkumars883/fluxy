const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/HelpSlider.jsx', 'utf8');

content = content.replace('className=\"p-6 border-b', 'className=\"px-6 py-4 sm:px-8 sm:py-5 border-b');
content = content.replace('className=\"p-6 flex-1', 'className=\"px-6 py-4 sm:px-8 sm:py-6 flex-1');
content = content.replace('className=\"p-6 border-t', 'className=\"px-6 py-5 border-t');
content = content.replace('className=\"p-6 bg-rose-50/60', 'className=\"px-6 py-5 bg-rose-50/60');
content = content.replace('className=\"p-6 bg-rose-50/50', 'className=\"px-6 py-5 bg-rose-50/50');

content = content.replace(/space-y-8/g, 'space-y-6');
content = content.replace(/space-y-6/g, 'space-y-5');
content = content.replace(/space-y-4/g, 'space-y-3');

content = content.replace(/rounded-\\[20px\\]/g, 'rounded-2xl');
content = content.replace(/rounded-\\[24px\\]/g, 'rounded-2xl');
content = content.replace(/rounded-\\[28px\\]/g, 'rounded-[20px]');

fs.writeFileSync('src/components/dashboard/HelpSlider.jsx', content);
console.log('Padding fixed successfully.');
