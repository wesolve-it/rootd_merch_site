// Responsive srcset über Netlify Image CDN. Lokal (ohne NETLIFY) kein srcset.
export const netlifySrcSet = (src: string, widths: number[]) =>
  process.env.NETLIFY
    ? widths.map((w) => `/.netlify/images?url=${encodeURIComponent(src)}&w=${w}&q=82 ${w}w`).join(', ')
    : undefined;
