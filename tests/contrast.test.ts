// WCAG 2.2 AA contrast checks for the brand palette as it is actually used.
import { describe, expect, it } from "vitest";

const c = {
  forest950: "#0b2019",
  forest900: "#15382c",
  forest700: "#235a47",
  gold300: "#e6cf8e",
  gold500: "#d2b35d",
  gold700: "#83631a",
  cream50: "#fdfbf7",
  cream100: "#f8f4ec",
  cream150: "#f4eee2",
  ink: "#13261f",
  inkSoft: "#384b43",
  inkMute: "#54655d",
  error: "#a1361f",
};

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

const normalText: [string, string, string][] = [
  ["body text on cream", c.ink, c.cream100],
  ["secondary text on cream", c.inkSoft, c.cream100],
  ["muted text on cream", c.inkMute, c.cream100],
  ["muted text on alt sections", c.inkMute, c.cream150],
  ["gold eyebrow on cream", c.gold700, c.cream100],
  ["gold eyebrow on cards", c.gold700, c.cream50],
  ["links on cream", c.forest700, c.cream100],
  ["gold text on deep green", c.gold300, c.forest950],
  ["gold text on brand green", c.gold300, c.forest900],
  ["cream text on deep green", c.cream50, c.forest950],
  ["button label on gold", c.forest950, c.gold500],
  ["button label on green", c.cream50, c.forest900],
  ["form error on cream", c.error, c.cream100],
];

describe("brand colour contrast (AA, 4.5:1 for normal text)", () => {
  for (const [name, fg, bg] of normalText) {
    it(name, () => expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5));
  }
  it("gold-500 is never used as text on cream (fails AA)", () => {
    expect(ratio(c.gold500, c.cream100)).toBeLessThan(3);
  });
});
