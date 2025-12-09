/**
 * Font loading utilities
 */

/**
 * Wait for fonts to load using the Font Loading API
 */
export function waitForFonts(): Promise<void> {
  if (!('fonts' in document)) {
    // Font Loading API not supported, resolve immediately
    return Promise.resolve();
  }

  return document.fonts.ready.then(() => {});
}

/**
 * Prevent FOUT (Flash of Unstyled Text) by adding a class when fonts are loaded
 */
export function preventFOUT(): void {
  if (!document.fonts) {
    // Font Loading API not supported
    document.documentElement.classList.add('fonts-loaded');
    return;
  }

  // Check if fonts are already loaded
  if (document.fonts.status === 'loaded') {
    document.documentElement.classList.add('fonts-loaded');
    return;
  }

  // Wait for fonts to load
  document.fonts.ready
    .then(() => {
      document.documentElement.classList.add('fonts-loaded');
    })
    .catch(() => {
      // Fallback: add class anyway after timeout
      setTimeout(() => {
        document.documentElement.classList.add('fonts-loaded');
      }, 3000);
    });
}

/**
 * Load a specific font family
 */
export async function loadFont(fontFamily: string, fontWeight = '400'): Promise<void> {
  if (!('fonts' in document)) {
    return Promise.resolve();
  }

  try {
    await document.fonts.load(`${fontWeight} 1em ${fontFamily}`);
  } catch {
    // Silently fail if font loading fails
  }
}

/**
 * Preload critical fonts
 */
export function preloadCriticalFonts(): void {
  const fontsToLoad = [
    { family: 'Inter', weight: '400' },
    { family: 'Inter', weight: '500' },
    { family: 'Inter', weight: '700' },
    { family: 'Playfair Display', weight: '700' },
  ];

  Promise.all(fontsToLoad.map(({ family, weight }) => loadFont(family, weight))).then(() => {
    document.documentElement.classList.add('fonts-loaded');
  });
}
