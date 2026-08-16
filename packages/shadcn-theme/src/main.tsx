if (window.kcContext !== undefined) {
    void import("./main-kc");
} else {
    void import("./main-kc.dev");
}
