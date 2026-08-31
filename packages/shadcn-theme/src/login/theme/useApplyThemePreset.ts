import { useKcContext } from "../KcContext";
import { useApplyThemePresetFromProperties } from "./applyThemePreset";

/**
 * Applies the resolved theme preset to the document root.
 * The source of truth is `kcContext.properties`, so both Storybook globals and
 * deployed environment variables go through the same path.
 */
export function useApplyThemePreset() {
    const { kcContext } = useKcContext();

    useApplyThemePresetFromProperties(kcContext.properties);
}
