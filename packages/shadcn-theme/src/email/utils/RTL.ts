export const applyRTL = (
    baseStyle: React.CSSProperties,
    isRTL: boolean,
    rtlStyle: React.CSSProperties
): React.CSSProperties => {
    return isRTL ? { ...baseStyle, ...rtlStyle } : baseStyle;
};
