#!/usr/bin/env node

/**
 * PWA Icon Generator
 * 
 * This script generates optimized PWA icons with a simple, clean design.
 * It creates three icon sizes:
 * - 192x192 (< 20KB) - Standard PWA icon
 * - 512x512 (< 50KB) - High-resolution PWA icon
 * - 180x180 (< 20KB) - Apple Touch Icon
 * 
 * The icons feature a simple "B" letter on a gradient background,
 * representing a blog website.
 */

import sharp from 'sharp';
import { writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const ICON_SIZES = [
  { size: 192, name: 'pwa-192x192.png', maxSize: 20 * 1024 },
  { size: 512, name: 'pwa-512x512.png', maxSize: 50 * 1024 },
  { size: 180, name: 'apple-touch-icon.png', maxSize: 20 * 1024 }
];

const OUTPUT_DIR = join(__dirname, '..', 'public');

/**
 * Create an SVG icon with a "B" letter on a gradient background
 */
function createIconSVG(size) {
  const fontSize = Math.floor(size * 0.6);
  const strokeWidth = Math.floor(size * 0.02);
  
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
      <text 
        x="50%" 
        y="50%" 
        dominant-baseline="central" 
        text-anchor="middle" 
        font-family="Arial, sans-serif" 
        font-weight="bold" 
        font-size="${fontSize}" 
        fill="white"
        stroke="white"
        stroke-width="${strokeWidth}"
      >B</text>
    </svg>
  `.trim();
}

/**
 * Generate an optimized PNG icon from SVG
 */
async function generateIcon(size, outputName, maxSize) {
  console.log(`Generating ${outputName} (${size}x${size})...`);
  
  const svg = createIconSVG(size);
  const outputPath = join(OUTPUT_DIR, outputName);
  
  // Start with quality 90
  let quality = 90;
  let buffer;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    buffer = await sharp(Buffer.from(svg))
      .resize(size, size)
      .png({ quality, compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();
    
    if (buffer.length <= maxSize || quality <= 40) {
      break;
    }
    
    quality -= 5;
    attempts++;
  }
  
  await writeFile(outputPath, buffer);
  
  const sizeKB = (buffer.length / 1024).toFixed(2);
  const targetKB = (maxSize / 1024).toFixed(0);
  const status = buffer.length <= maxSize ? '✓' : '⚠';
  
  console.log(`  ${status} Created ${outputName}: ${sizeKB}KB (target: <${targetKB}KB, quality: ${quality})`);
  
  return buffer.length;
}

/**
 * Main function
 */
async function main() {
  console.log('🎨 PWA Icon Generator\n');
  console.log('Creating optimized icons for your blog...\n');
  
  const results = [];
  
  for (const config of ICON_SIZES) {
    const size = await generateIcon(config.size, config.name, config.maxSize);
    results.push({ ...config, actualSize: size });
  }
  
  console.log('\n📊 Summary:');
  console.log('━'.repeat(60));
  
  let allUnderLimit = true;
  for (const result of results) {
    const sizeKB = (result.actualSize / 1024).toFixed(2);
    const targetKB = (result.maxSize / 1024).toFixed(0);
    const percentage = ((result.actualSize / result.maxSize) * 100).toFixed(1);
    const status = result.actualSize <= result.maxSize ? '✓' : '⚠';
    
    if (result.actualSize > result.maxSize) {
      allUnderLimit = false;
    }
    
    console.log(`${status} ${result.name.padEnd(25)} ${sizeKB.padStart(8)}KB / ${targetKB}KB (${percentage}%)`);
  }
  
  console.log('━'.repeat(60));
  
  if (allUnderLimit) {
    console.log('\n✅ All icons generated successfully and meet size requirements!');
  } else {
    console.log('\n⚠️  Some icons exceed target size. Consider simplifying the design.');
  }
  
  console.log('\n💡 Tip: You can customize the icon design by editing this script.');
  console.log('   Icons are located in the public/ directory.\n');
}

// Run the script
main().catch(err => {
  console.error('❌ Error generating icons:', err);
  process.exit(1);
});
