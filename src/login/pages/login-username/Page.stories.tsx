import { createKcPageStory, type Meta, type StoryObj } from "../../mocks/KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-username.ftl" });

const meta = {
    title: "login/login-username.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Arabic: Story = {
    args: {
        kcContext: {
            locale: {
                currentLanguageTag: "ar",
                rtl: true
            }
        }
    }
};
export const French: Story = {
    args: {
        kcContext: {
            locale: {
                currentLanguageTag: "fr"
            }
        }
    }
};

export const WithWebauthn: Story = {
    args: {
        kcContext: {
            url: {
                loginAction: "/mock-login-action"
            },
            enableWebAuthnConditionalUI: true
        }
    }
};

export const WithEmailAsUsername: Story = {
    args: {
        kcContext: {
            realm: {
                loginWithEmailAllowed: true,
                registrationEmailAsUsername: true
            }
        }
    }
};

export const WithSocialProviders: Story = {
    args: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: [
                    {
                        loginUrl: "google",
                        alias: "google",
                        providerId: "google",
                        displayName: "Google",
                        iconClasses: "fa fa-google"
                    },
                    {
                        loginUrl: "microsoft",
                        alias: "microsoft",
                        providerId: "microsoft",
                        displayName: "Microsoft",
                        iconClasses: "fa fa-windows"
                    },
                    {
                        loginUrl: "facebook",
                        alias: "facebook",
                        providerId: "facebook",
                        displayName: "Facebook",
                        iconClasses: "fa fa-facebook"
                    },
                    {
                        loginUrl: "instagram",
                        alias: "instagram",
                        providerId: "instagram",
                        displayName: "Instagram",
                        iconClasses: "fa fa-instagram"
                    },
                    {
                        loginUrl: "twitter",
                        alias: "twitter",
                        providerId: "twitter",
                        displayName: "Twitter",
                        iconClasses: "fa fa-twitter"
                    },
                    {
                        loginUrl: "linkedin",
                        alias: "linkedin",
                        providerId: "linkedin",
                        displayName: "LinkedIn",
                        iconClasses: "fa fa-linkedin"
                    },
                    {
                        loginUrl: "stackoverflow",
                        alias: "stackoverflow",
                        providerId: "stackoverflow",
                        displayName: "Stackoverflow",
                        iconClasses: "fa fa-stack-overflow"
                    },
                    {
                        loginUrl: "github",
                        alias: "github",
                        providerId: "github",
                        displayName: "Github",
                        iconClasses: "fa fa-github"
                    },
                    {
                        loginUrl: "gitlab",
                        alias: "gitlab",
                        providerId: "gitlab",
                        displayName: "Gitlab",
                        iconClasses: "fa fa-gitlab"
                    },
                    {
                        loginUrl: "bitbucket",
                        alias: "bitbucket",
                        providerId: "bitbucket",
                        displayName: "Bitbucket",
                        iconClasses: "fa fa-bitbucket"
                    },
                    {
                        loginUrl: "paypal",
                        alias: "paypal",
                        providerId: "paypal",
                        displayName: "PayPal",
                        iconClasses: "fa fa-paypal"
                    },
                    {
                        loginUrl: "openshift",
                        alias: "openshift",
                        providerId: "openshift",
                        displayName: "OpenShift",
                        iconClasses: "fa fa-cloud"
                    }
                ]
            }
        }
    }
};

export const WithErrorMessage: Story = {
    args: {
        kcContext: {
            message: {
                summary:
                    "The time allotted for the connection has elapsed.<br/>The login process will restart from the beginning.",
                type: "error"
            }
        }
    }
};

export const WithOneSocialProvider: Story = {
    args: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: [
                    {
                        loginUrl: "google",
                        alias: "google",
                        providerId: "google",
                        displayName: "Google",
                        iconClasses: "fa fa-google"
                    }
                ]
            }
        }
    }
};

export const WithTwoSocialProviders: Story = {
    args: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: [
                    {
                        loginUrl: "google",
                        alias: "google",
                        providerId: "google",
                        displayName: "Google",
                        iconClasses: "fa fa-google"
                    },
                    {
                        loginUrl: "microsoft",
                        alias: "microsoft",
                        providerId: "microsoft",
                        displayName: "Microsoft",
                        iconClasses: "fa fa-windows"
                    }
                ]
            }
        }
    }
};
export const WithNoSocialProviders: Story = {
    args: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: []
            }
        }
    }
};
export const WithMoreThanTwoSocialProviders: Story = {
    args: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: [
                    {
                        loginUrl: "google",
                        alias: "google",
                        providerId: "google",
                        displayName: "Google",
                        iconClasses: "fa fa-google"
                    },
                    {
                        loginUrl: "microsoft",
                        alias: "microsoft",
                        providerId: "microsoft",
                        displayName: "Microsoft",
                        iconClasses: "fa fa-windows"
                    },
                    {
                        loginUrl: "facebook",
                        alias: "facebook",
                        providerId: "facebook",
                        displayName: "Facebook",
                        iconClasses: "fa fa-facebook"
                    },
                    {
                        loginUrl: "twitter",
                        alias: "twitter",
                        providerId: "twitter",
                        displayName: "Twitter",
                        iconClasses: "fa fa-twitter"
                    }
                ]
            }
        }
    }
};
export const WithSocialProvidersAndWithoutRememberMe: Story = {
    args: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: [
                    {
                        loginUrl: "google",
                        alias: "google",
                        providerId: "google",
                        displayName: "Google",
                        iconClasses: "fa fa-google"
                    }
                ]
            },
            realm: { rememberMe: false }
        }
    }
};

export const WithCustomProvider: Story = {
    args: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: [
                    {
                        loginUrl: "custom",
                        alias: "custom",
                        providerId: "custom",
                        displayName: "Custom"
                    }
                ]
            }
        }
    }
};
