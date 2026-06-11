const fs = require('fs');
const path = require('path');

const dirs = [
  'd:/Full Stack Dev/automixa/src/components/dashboard',
  'd:/Full Stack Dev/automixa/src/app/dashboard',
  'd:/Full Stack Dev/automixa/src/components/ui'
];

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      } else if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
        results.push(file);
      }
    });
  } catch(e) {}
  return results;
}

dirs.forEach(dir => {
  const files = walk(dir);
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    let newContent = content;
    let oldContent;
    do {
      oldContent = newContent;
      newContent = newContent.replace(/(<(?:button|Button)[^>]*?)rounded-(?:md|lg|xl|2xl|3xl|full)([^>]*>)/gi, '$1rounded-sm$2');
    } while (oldContent !== newContent);

    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Updated', file);
    }
  });
});
