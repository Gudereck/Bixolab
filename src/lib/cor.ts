/** Luminância relativa (WCAG) de uma cor #rrggbb. */
export function luminancia(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export const eClara = (hex: string) => luminancia(hex) > 0.4;

/** Escurece (fator < 1) ou clareia (fator > 1) uma cor #rrggbb. */
export function ajustar(hex: string, fator: number) {
  const canal = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16);
    const v = fator < 1 ? c * fator : c + (255 - c) * (fator - 1);
    return Math.round(Math.min(255, Math.max(0, v)))
      .toString(16)
      .padStart(2, '0');
  };
  return `#${canal(1)}${canal(3)}${canal(5)}`;
}

/** Cor da estampa: tinta escura em peças claras, creme em peças escuras. */
export const corEstampa = (hex: string) => (eClara(hex) ? '#141613' : '#f5f2ea');
