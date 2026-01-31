import { i18nBuilder } from "@keycloakify/login-ui/i18n";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { I18nProvider, useI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            welcomeMessage:
                "Welcome to Acme inc - Your gateway to seamless planning and organization.",
            loginAccountTitle: "Login to your account",
            registerTitle: "Register a new account",
            email: "Email",
            noAccount: "Don't have an account?",
            doRegister: "Sign up",
            "organization.selectTitle": "Choose Your Organization",
            "organization.pickPlaceholder": "Pick an organization to continue",
            "identity-provider-login-last-used": "Last used"
        },
        ar: {
            welcomeMessage: "مرحبًا بك في Acme inc - بوابتك إلى التخطيط والتنظيم السلس.",
            loginAccountTitle: "تسجيل الدخول  إلى حسابك",
            registerTitle: "تسجيل حساب جديد",
            email: "البريد الإلكتروني",
            doRegister: "إنشاء حساب",
            noAccount: "ليس لديك حساب؟",
            "organization.selectTitle": "اختر مؤسستك",
            "organization.pickPlaceholder": "اختر مؤسسة للمتابعة",
            "identity-provider-login-last-used": "آخر استخدام"
        },
        fr: {
            welcomeMessage:
                "Bienvenue sur Acme inc Votre passerelle vers une planification et une organisation sans faille.",
            loginAccountTitle: "Connectez-vous à votre compte",
            registerTitle: "Créer    un nouveau compte",
            email: "E-mail",
            doRegister: "S'inscrire",
            noAccount: "Vous n'avez pas de compte?",
            "organization.selectTitle": "Choisissez Votre Organisation",
            "organization.pickPlaceholder":
                "Sélectionnez une organisation pour continuer",
            "identity-provider-login-last-used": "Dernière utilisation"
        }
    })
    .build();

export { I18nProvider, useI18n };
