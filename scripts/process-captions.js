const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const inputFile = args[0];
const outputFile = args[1] || 'processed-captions.json';

if (!inputFile) {
  console.error('Usage: node process-captions.js <input-file> [output-file]');
  process.exit(1);
}

try {
  const captionsData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  
  
  const processedCaptions = captionsData.captions.map((caption, index) => {
    return {
      ...caption,
      id: `caption-${index + 1}`,
      text: formatCaptionText(caption.text),
      duration: caption.end - caption.start,
    };
  });
  
  const outputData = {
    ...captionsData,
    captions: processedCaptions,
    processedAt: new Date().toISOString(),
  };
  
  fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
  
  
} catch (error) {
  console.error('Processing failed:', error.message);
  process.exit(1);
}

function formatCaptionText(text) {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\.\.\./g, '…');
}