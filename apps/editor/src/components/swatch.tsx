export function Swatch({ color }: { color: string }) {
    return <span className="size-4 shrink-0 rounded-full border" style={{ backgroundColor: color }} />;
}