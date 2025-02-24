import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

async function updateReadme() {
  const docsDir = path.join(rootDir, 'docs');
  const readmePath = path.join(rootDir, 'README.md');
  
  const files = await fs.readdir(docsDir);
  const mdFiles = files.filter(file => file.endsWith('.md') && file !== 'README.md');

  let readmeContent = await fs.readFile(readmePath, 'utf-8');

  const docsSection = [
    '## Documentation',
    '',
    'Generated documentation for each module:',
    '',
    ...mdFiles.map(file => {
      const name = path.basename(file, '.md');
      return `- [${name}](docs/${file})`;
    }),
    ''
  ].join('\n');

  const docsRegex = /## Documentation\n[\s\S]*?(?=##|$)/;
  if (docsRegex.test(readmeContent)) {
    readmeContent = readmeContent.replace(docsRegex, docsSection);
  } else {
    readmeContent += '\n' + docsSection;
  }

  await fs.writeFile(readmePath, readmeContent);
  console.log('README.md updated with documentation links');
}

updateReadme().catch(console.error); 