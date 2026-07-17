import { describe, expect, it } from "vitest";
import { MAX_FAVICON_BYTES, getFaviconError } from "../validation/favicon";

const file = (name: string, type: string, size = 10) =>
    new File([new Uint8Array(size)], name, { type });

describe("getFaviconError", () => {
    it("accepts png/svg/ico by extension (even with empty MIME)", () => {
        expect(getFaviconError(file("a.png", ""))).toBeNull();
        expect(getFaviconError(file("a.svg", ""))).toBeNull();
        expect(getFaviconError(file("a.ico", ""))).toBeNull();
    });
    it("accepts by MIME when the extension is missing", () => {
        expect(getFaviconError(file("blob", "image/png"))).toBeNull();
    });
    it("rejects the wrong type", () => {
        expect(getFaviconError(file("a.txt", "text/plain"))).toMatch(/PNG, SVG, or ICO/i);
    });
    it("rejects an oversize file", () => {
        expect(getFaviconError(file("a.png", "image/png", MAX_FAVICON_BYTES + 1))).toMatch(
            /too large/i,
        );
    });
});
