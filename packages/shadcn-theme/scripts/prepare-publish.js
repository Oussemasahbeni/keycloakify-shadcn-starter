import fs from "fs";
import path from "path";

const TARGET_DIR = "keycloak-theme_to_publish";
const NPM_PACKAGE_NAME = "@oussemasahbeni/keycloakify-login-shadcn";

// dependencies to REMOVE entirely from the published package
const DEPS_TO_EXCLUDE = ["react", "react-dom", "i18next", "react-i18next", "keycloakify", "keycloakify-emails"];

// directories to copy into the 'keycloak-theme' folder
const DIRS_TO_COPY = [
    { src: "src/login", dest: "keycloak-theme/login" },
    { src: "src/components", dest: "keycloak-theme/components" },
    {
        src: "public/early-color-scheme.js",
        dest: "keycloak-theme/public/early-color-scheme.js",
    },
    { src: "public/keycloak-theme", dest: "keycloak-theme/public/keycloak-theme" },
    { src: "README.md", dest: "README.md" },
];

// Clean/Create Target Directory
if (fs.existsSync(TARGET_DIR)) {
    fs.rmSync(TARGET_DIR, { recursive: true, force: true });
}
fs.mkdirSync(TARGET_DIR);

// Read Root Package.json
const rootPackageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

// Construct New Package.json
const newPackageJson = {
    name: NPM_PACKAGE_NAME,
    version: rootPackageJson.version,
    description: "Keycloakify Shadcn Theme extensions",
    license: rootPackageJson.license,
    repository: rootPackageJson.repository,
    type: "module",
    main: "keycloak-theme/login/index.js",
    files: ["keycloak-theme"],
    peerDependencies: {},
};

// Sort Dependencies
const allDeps = { ...rootPackageJson.dependencies };

Object.entries(allDeps).forEach(([depName, depVersion]) => {
    //  If it's in the exclusion list, skip it completely
    if (DEPS_TO_EXCLUDE.includes(depName)) {
        return;
    }

    //  Otherwise, move to peerDependencies (shadcn deps, tailwind, etc.)
    else {
        newPackageJson.peerDependencies[depName] = resolveVersion(depName, depVersion);
    }
});

// Write package.json
fs.writeFileSync(path.join(TARGET_DIR, "package.json"), JSON.stringify(newPackageJson, null, 2));
console.log(`✅ Generated package.json in ${TARGET_DIR}`);

// Copy Directories
DIRS_TO_COPY.forEach(({ src, dest }) => {
    const srcPath = path.resolve(src);
    const destPath = path.join(TARGET_DIR, dest);

    if (fs.existsSync(srcPath)) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.cpSync(srcPath, destPath, { recursive: true });
        console.log(`✅ Copied ${src} -> ${destPath}`);
    } else {
        console.warn(`⚠️ Warning: Source directory ${src} not found.`);
    }
});

// Resolve catalog:/workspace: specifiers to concrete ranges by reading the
// version actually installed in this package's node_modules.
function resolveVersion(depName, spec) {
    if (!spec.startsWith("catalog:") && !spec.startsWith("workspace:")) {
        return spec;
    }
    const pkgPath = path.resolve("node_modules", depName, "package.json");
    const { version } = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    return `^${version}`;
}
