import { domAnimation, LazyMotion, m, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Motion setup for the landing page, loaded lazily so only the ~15 kB
 * `domAnimation` feature set ships. Wrap the page once; `Reveal` instances
 * anywhere below pick the features up from context. `reducedMotion="user"`
 * drops the translate (but keeps the fade) for anyone whose OS asks for
 * reduced motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
    return (
        <LazyMotion features={domAnimation} strict>
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </LazyMotion>
    );
}

/**
 * One-shot rise-in when the element scrolls into view. Keep it off anything
 * above the fold — the hidden initial state is server-rendered, so content
 * inside a `Reveal` is invisible until hydration.
 */
export function Reveal({
    children,
    className,
    delay = 0,
}: {
    children: ReactNode;
    className?: string;
    /** Seconds — use small multiples (0.08–0.1 × index) to stagger siblings. */
    delay?: number;
}) {
    return (
        <m.div
            className={className}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98], delay }}
        >
            {children}
        </m.div>
    );
}
