import pngToIco from "png-to-ico";
import sharp from "sharp";

/** Sizes bundled into the multi-resolution `favicon.ico`. */
const ICO_SIZES = [16, 32, 48];

/** Transparent padding for non-square sources, so logos are never cropped. */
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 } as const;

/** A buffer is already an ICO when it starts with the icon signature `00 00 01 00`. */
function isIco(bytes: Uint8Array): boolean {
    return bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00;
}

/**
 * Turns an uploaded image into the theme's `favicon.ico`, keyed by filename so
 * it drops straight into `customizeThemeJar`'s `assets` (which overwrites the
 * shipped `login/resources/dist/favicon.ico`).
 *
 * - An uploaded `.ico` is passed through untouched (it is already the target
 *   format, often already multi-resolution).
 * - A `.png` or `.svg` is rasterized by sharp at 16/32/48 px (SVG renders
 *   crisply at each size because it is vector) and bundled into one
 *   multi-resolution `.ico` by `png-to-ico`. `fit: "contain"` letterboxes
 *   non-square sources onto a transparent square so nothing is cropped.
 *
 * (A scalable `icon.svg` companion may be added later; for now the universal
 * `.ico` is the whole favicon story.)
 */
export async function generateFaviconSet(source: Uint8Array): Promise<Record<string, Uint8Array>> {
    if (isIco(source)) {
        return { "favicon.ico": source };
    }

    const pngs = await Promise.all(
        ICO_SIZES.map(size =>
            sharp(source)
                .resize(size, size, { fit: "contain", background: TRANSPARENT })
                .png()
                .toBuffer(),
        ),
    );

    return { "favicon.ico": await pngToIco(pngs) };
}
