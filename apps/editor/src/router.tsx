import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { LoadingScreen } from "./components/loading-screen";
import { NotFound } from "./components/not-found";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
    const router = createTanStackRouter({
        routeTree,
        scrollRestoration: true,
        defaultPreload: "intent",
        defaultPreloadStaleTime: 0,
        defaultViewTransition: true,
        defaultNotFoundComponent: () => <NotFound />,
        defaultPendingComponent: () => <LoadingScreen />,
    });

    return router;
}

declare module "@tanstack/react-router" {
    interface Register {
        router: ReturnType<typeof getRouter>;
    }
}
