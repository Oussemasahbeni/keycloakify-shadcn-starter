import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { generateFaviconSet } from "../favicon";

/** The 4-byte ICO signature: `00 00 01 00`. */
function isIco(bytes: Uint8Array): boolean {
    return bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00;
}

const realIco = new Uint8Array([
    0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x20, 0x20, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
]);

describe("generateFaviconSet", () => {
    it("passes an uploaded .ico through untouched", async () => {
        const { "favicon.ico": out } = await generateFaviconSet(realIco);
        expect(Buffer.from(out).equals(Buffer.from(realIco))).toBe(true);
    });

    it("converts a PNG to a valid .ico", async () => {
        const png = await sharp({
            create: {
                width: 64,
                height: 64,
                channels: 4,
                background: { r: 255, g: 0, b: 0, alpha: 1 },
            },
        })
            .png()
            .toBuffer();

        const { "favicon.ico": out } = await generateFaviconSet(png);
        expect(isIco(out)).toBe(true);
        expect(out.length).toBeGreaterThan(0);
    });

    it("converts an SVG to a valid .ico", async () => {
        const svg = new TextEncoder().encode(
            '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#3b82f6"/></svg>',
        );

        const { "favicon.ico": out } = await generateFaviconSet(svg);
        expect(isIco(out)).toBe(true);
        expect(out.length).toBeGreaterThan(0);
    });
});
