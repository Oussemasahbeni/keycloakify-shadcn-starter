# Keycloakify Shadcn Starter

A modern, production-ready Keycloak login theme built with React, TypeScript, Tailwind CSS v4, shadcn/ui, and Keycloakify v11.

**npm Package:** [@oussemasahbeni/keycloakify-login-shadcn](https://www.npmjs.com/package/@oussemasahbeni/keycloakify-login-shadcn)

---

## Features

- **Modern UI** - Beautiful, responsive design using Tailwind CSS v4 and shadcn/ui components
- **Dark Mode** - Built-in dark/light/system theme toggle with persistent preferences
- **Multi-language Support** - i18n ready with English, French, and Arabic translations (RTL supported)
- **Custom Email Templates** - Styled email templates using jsx-email for all Keycloak events
- **Complete Login Flow** - All 35+ Keycloak login pages fully customized
- **Social Login Providers** - Pre-styled icons for 16+ OAuth providers (Google, GitHub, Microsoft, etc.)
- **Storybook Integration** - Visual testing and documentation for all components
- **Vite Powered** - Fast development with HMR and optimized builds
- **Type-Safe** - Full TypeScript support throughout the codebase

---

## Quick Start with npm

Get started quickly by using the published npm package in your own project.

### Step 1: Create a new Vite + React + TypeScript project

```bash
pnpm create vite
```

When prompted:

- **Project name:** `keycloak-theme` (or your preferred name)
- **Select a framework:** Choose **React**
- **Select a variant:** Choose **TypeScript**

```bash
cd keycloak-theme
```

### Step 2: Install dependencies

```bash
pnpm add keycloakify @oussemasahbeni/keycloakify-login-shadcn
pnpm install
```

### Step 3: Initialize Keycloakify

```bash
npx keycloakify init
```

When prompted:

- **Which theme type would you like to initialize?** Select **(x) login**
- **Do you want to install the Stories?** Select **(x) Yes (Recommended)**

### Step 4: Configure Vite

Update your `vite.config.ts` to include Tailwind CSS, path aliases, and the Keycloakify plugin:

```typescript
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";
import { defineConfig } from "vite";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        keycloakify({
            accountThemeImplementation: "none"
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    }
});
```

### Step 5: Configure TypeScript paths

Add the path alias to your `tsconfig.app.json`:

```json
{
    "compilerOptions": {
        "paths": {
            "@/*": ["./src/*"]
        }
    }
}
```

### Step 6: Run Storybook and build

```bash
# Run Storybook for component development and testing
pnpm storybook

# Build the Keycloak theme JAR file
pnpm build-keycloak-theme
```

That's it! You now have a fully functional Keycloak login theme using the published package.

---

## Development (for contributors)

If you want to clone this repository and develop/customize the theme locally:

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- [Maven](https://maven.apache.org/) (for building the theme JAR)

### Clone and Install

```bash
# Clone the repository
git clone https://github.com/Oussemasahbeni/keycloakify-shadcn-starter.git
cd keycloakify-shadcn-starter

# Install dependencies
pnpm install
```

### Development Commands

```bash
# Start development server with hot reload
pnpm dev

# Run Storybook for component development
pnpm storybook

# Preview email templates
pnpm emails:preview

# Build the Keycloak theme JAR
pnpm build-keycloak-theme
```

---

## Supported Pages

This theme includes custom implementations for all Keycloak login pages:

| Authentication      | Account Management  | Security              |
| ------------------- | ------------------- | --------------------- |
| Login               | Register            | WebAuthn Authenticate |
| Login with Username | Update Profile      | WebAuthn Register     |
| Login with Password | Update Email        | Configure TOTP        |
| Login OTP           | Delete Account      | Recovery Codes        |
| Login with Passkeys | Logout Confirm      | Reset OTP             |
| OAuth Grant         | Terms & Conditions  | X509 Info             |
| Device Verification | Select Organization | Delete Credential     |

---

### Branding

1. **Logo**: Replace `src/login/assets/img/auth-logo.svg` with your company logo
2. **Colors**: Modify CSS variables in `src/login/index.css`
3. **Fonts**: Update font imports in `src/login/assets/fonts/`

### Internationalization

Add or modify translations in `src/login/i18n.ts`:

```typescript
.withCustomTranslations({
    en: {
        welcomeMessage: "Welcome to Your App",
        loginAccountTitle: "Login to your account",
        // ... more translations
    },
    fr: { /* French translations */ },
    ar: { /* Arabic translations */ }
})
```

### UI Components

The theme uses shadcn/ui components located in `src/components/ui/`:

- `alert.tsx` - Alert messages
- `button.tsx` - Buttons with variants
- `card.tsx` - Card containers
- `checkbox.tsx` - Checkbox inputs
- `input.tsx` - Text inputs
- `label.tsx` - Form labels
- `dropdown-menu.tsx` - Dropdown menus
- `radio-group.tsx` - Radio button groups
- `tooltip.tsx` - Tooltips

---

## Email Templates

Custom email templates are built with [jsx-email](https://jsx.email/) and support multiple languages.

### Available Templates

| Template                     | Description                     |
| ---------------------------- | ------------------------------- |
| `email-verification.tsx`     | Email verification              |
| `password-reset.tsx`         | Password reset link             |
| `executeActions.tsx`         | Required actions                |
| `identity-provider-link.tsx` | IDP linking                     |
| `org-invite.tsx`             | Organization invitation         |
| `event-login_error.tsx`      | Login error notification        |
| `event-update_password.tsx`  | Password change notification    |
| `event-update_totp.tsx`      | TOTP configuration notification |
| And more...                  |                                 |

### Preview Emails Locally

```bash
pnpm emails:preview
```

### Email Locales

Translations are in `src/email/locales/{locale}/translation.json`:

- `en/` - English
- `fr/` - French
- `ar/` - Arabic

---

## Building for Production

### Install Maven

Required for building the Keycloak theme JAR file.

- **macOS**: `brew install maven`
- **Ubuntu/Debian**: `sudo apt-get install maven`
- **Windows**: `choco install openjdk && choco install maven`

### Build the Theme

```bash
pnpm build-keycloak-theme
```

The built theme will be output as a `.jar` file in the `dist_keycloak/` directory.

### Deploy to Keycloak

1. Copy the `.jar` file to your Keycloak's `providers/` directory
2. Restart Keycloak
3. Go to Keycloak Admin Console → **Realm Settings** → **Themes**
4. Select your custom theme from the dropdown

---

## Testing

### Storybook

Run Storybook for visual testing and component documentation:

```bash
pnpm storybook
```

### Local Keycloak Testing

For local testing with a Keycloak instance, see the [Keycloakify documentation](https://docs.keycloakify.dev/testing-your-theme).

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- [Keycloakify](https://keycloakify.dev) - For making Keycloak theming with React possible
- [shadcn/ui](https://ui.shadcn.com) - For the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) - For the utility-first CSS framework
- [jsx-email](https://jsx.email) - For React email templates

---

## Package Information

**npm:** [@oussemasahbeni/keycloakify-login-shadcn](https://www.npmjs.com/package/@oussemasahbeni/keycloakify-login-shadcn)  
**GitHub:** [Oussemasahbeni/keycloakify-shadcn-starter](https://github.com/Oussemasahbeni/keycloakify-shadcn-starter)
