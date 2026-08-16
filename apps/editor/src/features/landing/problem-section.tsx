import { Band, Eyebrow } from "./band";

const STEPS = [
    {
        label: "Today",
        title: "PatternFly, or hand-written FreeMarker",
        body: "Keycloak's stock pages ship with PatternFly's look. Matching them to your product means editing .ftl templates and layering CSS on markup you don't control.",
    },
    {
        label: "The catch",
        title: "It's 38 pages, not one",
        body: "The login form is the easy part. Password reset, OTP, recovery codes, passkeys, IdP linking, consent, logout, every error screen — each needs the same treatment, and they all drift apart over time.",
    },
    {
        label: "Instead",
        title: "Pick your tokens, take the theme",
        body: "Choose a palette, a typeface, a radius and a layout. Every page updates together, stays consistent, and leaves as a JAR your ops team can drop into Keycloak.",
    },
];

export function ProblemSection() {
    return (
        <Band className="grid md:grid-cols-3 md:divide-x">
            {STEPS.map(step => (
                <div key={step.label} className="max-md:border-b max-md:last:border-b-0">
                    <div className="flex h-full flex-col gap-3 p-6 sm:p-8">
                        <Eyebrow>{step.label}</Eyebrow>
                        <h3 className="text-xl leading-snug font-medium tracking-tight text-balance">{step.title}</h3>
                        <p className="text-sm text-pretty text-muted-foreground">{step.body}</p>
                    </div>
                </div>
            ))}
        </Band>
    );
}
