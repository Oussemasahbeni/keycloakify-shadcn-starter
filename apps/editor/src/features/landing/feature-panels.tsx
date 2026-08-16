import { LOCALE_COUNT, LOCALES } from "#/lib/locales";
import { cn } from "#/lib/utils";

import { Band, Eyebrow } from "./band";
import { Reveal } from "./reveal";
import { Screenshot } from "./screenshot";

/**
 * Feature panels.
 *
 * The grid draws the rules (`divide-x divide-y`) and each edge cell zeroes its
 * outer border, rather than stacking four separately-bordered cards. That keeps
 * the page reading as one ruled document and lets each panel's media bleed
 * flush to the rule instead of floating inside a rounded box.
 */
export function FeaturePanels() {
    return (
        <Band className="grid divide-y divide-border lg:grid-cols-2 lg:divide-x">
            <Panel
                eyebrow="Live preview"
                title="See the real page, not an approximation"
                body="The editor renders the actual theme in an isolated frame — the same code Keycloak will serve. Change a token and every page updates instantly, across all three layouts."
            >
                <Screenshot
                    src="/images/editor-preview-white.png"
                    alt="The editor with its configuration sidebar beside a live login page preview"
                    width={2560}
                    height={1271}
                    className="w-full rounded-lg border object-cover shadow-sm dark:hidden"
                />
                <Screenshot
                    src="/images/editor-preview-dark.png"
                    alt=""
                    width={2560}
                    height={1271}
                    className="hidden w-full rounded-lg border object-cover shadow-sm dark:block"
                />
            </Panel>

            <Panel
                eyebrow="Internationalisation"
                title={`${LOCALE_COUNT} languages, already translated`}
                body="Every string on every page ships translated, right-to-left included. Preview any locale without leaving the editor."
                className="lg:border-b-0"
            >
                <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] overflow-hidden rounded-lg border">
                    {LOCALES.map(locale => (
                        <span
                            key={locale}
                            className="-ms-px -mt-px border-s border-t border-border/60 px-2 py-2 text-center font-mono text-[0.6875rem] text-muted-foreground transition-colors duration-200 hover:bg-muted/50 hover:text-foreground"
                        >
                            {locale}
                        </span>
                    ))}
                </div>
            </Panel>

            <Panel
                eyebrow="Email templates"
                title="The emails match the login page"
                body="Verification, password reset and the rest are themed from the same palette, so a user who leaves for their inbox comes back to something that still looks like you."
                className="lg:border-b-0"
            >
                {/* Native size is 845×514 — sharp up to ~max-w-sm on 2× screens, so
                    don't display it larger without recapturing. */}
                <Screenshot
                    src="/images/email-preview.png"
                    alt="A themed email sent by Keycloak, styled from the same palette as the login pages"
                    width={845}
                    height={514}
                    className="w-full max-w-sm rounded-lg border shadow-sm"
                />
            </Panel>

            <Panel
                eyebrow="Export"
                title="Leaves as a deploy-ready .jar"
                body="Export bundles your login and email themes into a Keycloak provider JAR. Drop it in providers/, restart, pick the theme. Nothing to build, nothing to wire up."
                className="lg:border-b-0"
            >
                <div className="w-full max-w-sm space-y-1 rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs">
                    <div className="text-muted-foreground">
                        <span className="select-none">$ </span>
                        cp my-theme.jar keycloak/providers/
                    </div>
                    <div className="text-muted-foreground">
                        <span className="select-none">$ </span>
                        ./kc.sh start-dev
                    </div>
                    <div className="pt-1 text-primary">✓ theme available in the admin console</div>
                </div>
            </Panel>
        </Band>
    );
}

function Panel({
    eyebrow,
    title,
    body,
    children,
    className,
}: {
    eyebrow: string;
    title: string;
    body: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <Reveal className="flex flex-col gap-3 p-5 pb-0 sm:p-10 sm:pb-0">
                <Eyebrow>{eyebrow}</Eyebrow>
                <h3 className="text-xl leading-snug font-medium tracking-tight text-balance">{title}</h3>
                <p className="max-w-120 text-sm text-pretty text-muted-foreground">{body}</p>
            </Reveal>
            <div className="flex flex-1 items-center justify-center p-5 pt-0 sm:p-10 sm:pt-0">{children}</div>
        </div>
    );
}
