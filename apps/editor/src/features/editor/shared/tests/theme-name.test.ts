import { describe, expect, it } from "vitest";
import { getThemeNameError } from "../validation/theme-name";

describe("getThemeNameError", () => {
    it("accepts a valid slug", () => {
        expect(getThemeNameError("acme-login")).toBeNull();
    });
    it("rejects blank", () => {
        expect(getThemeNameError("   ")).toMatch(/required/i);
    });
    it("rejects uppercase / spaces / bad leading char", () => {
        expect(getThemeNameError("My Theme")).toMatch(/lowercase/i);
        expect(getThemeNameError("-nope")).toMatch(/lowercase/i);
    });
});
