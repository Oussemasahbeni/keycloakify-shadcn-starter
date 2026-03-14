import { ThemeProvider } from "@/login/components/ui/ThemeProvider";
import type { ClassKey } from "@keycloakify/login-ui/useKcClsx";
import type { ReactNode } from "react";
import "./index.css";
import { useKcContext } from "./KcContext";
import { getTheme } from "./shared/getColorScheme";

type Classes = { [key in ClassKey]?: string };

type StyleLevelCustomization = {
    doUseDefaultCss: boolean;
    classes?: Classes;
    loadCustomStylesheet?: () => void;
    Provider?: (props: { children: ReactNode }) => ReactNode;
};

// eslint-disable-next-line react-refresh/only-export-components
function Provider(props: { children: ReactNode }) {
    const { children } = props;

    const { kcContext } = useKcContext();

    return (
        <ThemeProvider defaultTheme={getTheme(kcContext.darkMode)}>
            {children}
        </ThemeProvider>
    );
}

export function useStyleLevelCustomization(): StyleLevelCustomization {
    return {
        doUseDefaultCss: false,
        Provider
    };
}
