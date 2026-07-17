import { oidcFnMiddleware } from "#/oidc";
import { emailTemplateIds } from "@kc-studio/shadcn-theme/email";
import { renderEmailPreview } from "@kc-studio/shadcn-theme/email-preview";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supportedLocaleValues } from "../shared/model/locales";

const schema = z.object({
    templateId: z.enum(emailTemplateIds),
    locale: z.enum(supportedLocaleValues),
    plainText: z.boolean().optional(),
    theme: z.object({
        primaryColor: z.string(),
        logoUrl: z.string().optional(),
    }),
});

export const renderEmailPreviewFn = createServerFn({ method: "POST" })
    .middleware([oidcFnMiddleware({ assert: "user logged in" })])
    .validator(schema)
    .handler(async ({ data }) => {
        return renderEmailPreview({
            templateId: data.templateId,
            locale: data.locale,
            theme: data.theme,
            plainText: data.plainText,
        });
    });
