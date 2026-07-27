/** TempCore – Tailwind build config
 *  Replaces the runtime cdn.tailwindcss.com script with a compiled,
 *  self-hosted stylesheet (css/tailwind.css) for faster loads and
 *  better Core Web Vitals.
 *
 *  Rebuild after adding new utility classes:
 *      npm run build:css        (one-off, minified)
 *      npm run watch:css        (rebuild on change)
 *
 *  Scans every HTML file plus js/ (in case any utilities are emitted
 *  from script). Custom design tokens live in css/style.css and load
 *  AFTER this file, so they always win on conflict.
 */
module.exports = {
  content: ['./*.html', './tools/*.html', './articles/*.html', './js/*.js'],
  theme: {
    extend: {
      colors: {
        bg:      'var(--bg)',
        surface: 'var(--surface)',
        accent:  'var(--accent)',
        warm:    'var(--warm)',
        hot:     'var(--hot)',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
