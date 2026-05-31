import { createKcPageStory, type Meta, type StoryObj } from "../../mocks/KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-password.ftl" });

const meta = {
    title: "login/login-password.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAttemptedUsername: Story = {
    args: {
        kcContext: {
            auth: {
                showUsername: true,
                attemptedUsername: "MyUsername"
            }
        }
    }
};

export const WithPasswordError: Story = {
    args: {
        kcContext: {
            realm: {
                resetPasswordAllowed: true
            },
            url: {
                loginAction: "/mock-login",
                loginResetCredentialsUrl: "/mock-reset-password"
            },
            messagesPerField: {
                existsError: (field: string) => field === "password",
                get: () => "Invalid password"
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

export const WithoutResetPasswordOption: Story = {
    args: {
        kcContext: {
            realm: {
                resetPasswordAllowed: false
            },
            url: {
                loginAction: "/mock-login",
                loginResetCredentialsUrl: "/mock-reset-password"
            },
            messagesPerField: {
                existsError: () => false
            }
        }
    }
};
