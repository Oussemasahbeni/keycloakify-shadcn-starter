import { useKcClsx } from "@keycloakify/login-ui/useKcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import type { ReactNode } from "react";
import { useEffect } from "react";
import defaultLogo from "../../assets/img/default-logo.svg";
import { useI18n } from "../../i18n";
import { useKcContext } from "../../KcContext";
import { CenteredCardLayout } from "./layouts/CenteredCardLayout";
import { ImageAsideLayout } from "./layouts/ImageAsideLayout";
import { TwoColumnLayout } from "./layouts/TwoColumnLayout";
import { TemplateContent } from "./TemplateContent";
import { useApplyThemePreset } from "./theme/useApplyThemePreset";
import { useInitializeTemplate } from "./useInitializeTemplate";
import { resolveAssetUrl } from "@/login/shared/resolveAssetUrl";

export type TemplateProps = {
    displayInfo?: boolean;
    displayMessage?: boolean;
    displayRequiredFields?: boolean;
    headerNode: ReactNode;
    socialProvidersNode?: ReactNode;
    infoNode?: ReactNode;
    documentTitle?: string;
    bodyClassName?: string;
    children: ReactNode;
};

export function Template(props: TemplateProps) {
    const { documentTitle, bodyClassName } = props;

    const { kcContext } = useKcContext();
    const { msgStr } = useI18n();
    const { kcClsx } = useKcClsx();

    const logoWhiteUrl =
        resolveAssetUrl(kcContext.properties.SHADCN_THEME_LOGO_WHITE_URL) || defaultLogo;

    const logoDarkUrl =
        resolveAssetUrl(kcContext.properties.SHADCN_THEME_LOGO_DARK_URL) || defaultLogo;
    const sideImageUrl = resolveAssetUrl(
        kcContext.properties.SHADCN_THEME_SIDE_IMAGE_URL
    );
    const layout = kcContext.properties.SHADCN_THEME_LAYOUT;

    useEffect(() => {
        document.title =
            documentTitle ??
            msgStr("loginTitle", kcContext.realm.displayName || kcContext.realm.name);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    useInitializeTemplate();
    useApplyThemePreset();

    switch (layout) {
        case "centered-card":
            return (
                <CenteredCardLayout
                    content={
                        <TemplateContent
                            {...props}
                            logoWhiteUrl={logoWhiteUrl}
                            logoDarkUrl={logoDarkUrl}
                            cardClassName="border bg-card shadow-sm"
                        />
                    }
                />
            );
        case "image-aside":
            return (
                <ImageAsideLayout
                    content={
                        <TemplateContent
                            {...props}
                            logoWhiteUrl={logoWhiteUrl}
                            logoDarkUrl={logoDarkUrl}
                            brandingVisibilityClassName="md:hidden"
                            cardClassName="border-none bg-transparent shadow-sm h-full"
                        />
                    }
                    imageUrl={sideImageUrl}
                />
            );
        case "two-column":
        default:
            return (
                <TwoColumnLayout
                    content={
                        <TemplateContent
                            {...props}
                            logoWhiteUrl={logoWhiteUrl}
                            logoDarkUrl={logoDarkUrl}
                            brandingVisibilityClassName="lg:hidden"
                            cardClassName="border-0 shadow-none bg-transparent md:border md:bg-card md:shadow-sm"
                        />
                    }
                    logoUrl={logoDarkUrl}
                />
            );
    }
}
