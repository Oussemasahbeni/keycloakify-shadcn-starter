import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/editor/")({
    beforeLoad: () => {
        throw Route.redirect({ to: "/editor/login", replace: true });
    },
});
