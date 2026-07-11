import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { DEFAULT_LOCALE } from "../../../shared/locales";
import { useEditor } from "../../../state/editor-context";
import { renderEmailPreviewFn } from "../../server/render-preview";
import { EmailPreviewToolbar } from "./preview-toolbar";

export function EmailPreviewIframe() {
    const { email, login } = useEditor();
    const renderPreview = useServerFn(renderEmailPreviewFn);
    const templateId = email.template.id;
    const locale = email.config.locale ?? DEFAULT_LOCALE;

    const primaryColor = email.config.primaryPreset ?? login.config.accent;
    const logoUrl = email.config.logoUrl;

    const emailPreviewOptions = queryOptions({
        queryKey: ["email-preview", renderPreview, templateId, locale, primaryColor, logoUrl],
        queryFn: () =>
            renderPreview({
                data: { templateId, locale, theme: { primaryColor, logoUrl } },
            }),
        placeholderData: keepPreviousData,
    });
    const { data: html } = useQuery(emailPreviewOptions);


    return (
        <div className="flex h-full flex-col">
            <EmailPreviewToolbar  />
            <div className="bg-muted/30 h-full overflow-auto p-4">
                <iframe
                    title="Email preview"
                    sandbox="allow-same-origin allow-scripts"
                    srcDoc={html}
                    className="mx-auto block h-full w-full rounded-lg border shadow-sm"
                />
            </div>
        </div>
    );
}
