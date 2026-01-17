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
            enterCredentials: "Enter your credentials below to login",
            noAccount: "Don't have an account?",
            doRegister: "Sign up",
            "identity-provider-login-last-used": "Last used",
            "organization.selectTitle": "Choose Your Organization",
            "organization.pickPlaceholder": "Pick an organization to continue"
        },
        ar: {
            welcomeMessage: "مرحبًا بك في Acme inc - بوابتك إلى التخطيط والتنظيم السلس.",
            loginAccountTitle: "تسجيل الدخول  إلى حسابك",
            registerTitle: "تسجيل حساب جديد",
            email: "البريد الإلكتروني",
            enterCredentials: "أدخل بيانات الاعتماد الخاصة بك أدناه لتسجيل الدخول",
            doRegister: "إنشاء حساب",
            noAccount: "ليس لديك حساب؟",
            "identity-provider-login-last-used": "آخر استخدام",
            "organization.selectTitle": "اختر مؤسستك",
            "organization.pickPlaceholder": "اختر مؤسسة للمتابعة"
        },
        fr: {
            welcomeMessage:
                "Bienvenue sur Acme inc Votre passerelle vers une planification et une organisation sans faille.",
            loginAccountTitle: "Connectez-vous à votre compte",
            registerTitle: "Créer    un nouveau compte",
            email: "E-mail",
            enterCredentials:
                "Entrez vos informations d'identification ci-dessous pour vous connecter",
            doRegister: "S'inscrire",
            noAccount: "Vous n'avez pas de compte?",
            "identity-provider-login-last-used": "Dernière utilisation",
            "organization.selectTitle": "Choisissez Votre Organisation",
            "organization.pickPlaceholder": "Sélectionnez une organisation pour continuer"
        }
    })
    .build();

export { I18nProvider, useI18n };
