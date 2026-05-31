import { createKcPageStory, type Meta, type StoryObj } from "../../mocks/KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "code.ftl" });

const meta = {
    title: "login/code.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};


/**
 * This reflects the state when "Dark Theme" is set to "Disabled" in the realm settings
 * (Theme configuration tab of the Keycloak Admin UI).
 *
 * You should enable this configuration if you want to hide the "dark mode switch"
 * and ensure that the theme always renders in light mode, even if the user's system
 * preference is set to dark.
 */
export const WithDarkModeForbidden: Story = {
    args: {
        kcContext: {
            darkMode: false
        }
    }
};

export const WithErrorCode: Story = {
    args: {
        kcContext: {
            code: {
                success: false,
                error: "Failed to generate code"
            }
        }
    }
};
export const WithFrenchLanguage: Story = {
    args: {
        kcContext: {
            locale: {
                currentLanguageTag: "fr"
            },
            code: {
                success: true,
                code: "XYZ789"
            }
        }
    }
};
export const WithHtmlErrorMessage: Story = {
    args: {
        kcContext: {
            code: {
                success: false,
                error: "Something went wrong. <a href='https://example.com'>Try again</a>"
            }
        }
    }
};
