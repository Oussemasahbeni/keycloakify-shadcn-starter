import { createKcPageStory, type Meta, type StoryObj } from "../../mocks/KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "select-organization.ftl" });

const meta = {
    title: "login/select-organization.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};


/**
 * WithManyOrganizations:
 * - Purpose: Tests when there are many organizations (more than 3), which triggers grid layout.
 * - Scenario: The component renders organizations in a grid layout.
 * - Key Aspect: Ensures that when there are more than 3 organizations, they are displayed in a grid.
 */
export const WithManyOrganizations: Story = {
    args: {
        kcContext: {
            url: {
                loginAction: "/mock-login-action"
            },
            user: {
                organizations: [
                    { alias: "org1", name: "Organization 1" },
                    { alias: "org2", name: "Organization 2" },
                    { alias: "org3", name: "Organization 3" },
                    { alias: "org4", name: "Organization 4" },
                    { alias: "org5", name: "Organization 5" },
                    { alias: "org6", name: "Organization 6" }
                ]
            }
        }
    }
};

/**
 * WithFewOrganizations:
 * - Purpose: Tests when there are few organizations (3 or less), which uses list layout.
 * - Scenario: The component renders organizations in a list layout.
 * - Key Aspect: Ensures that when there are 3 or fewer organizations, they are displayed in a list.
 */
export const WithFewOrganizations: Story = {
    args: {
        kcContext: {
            url: {
                loginAction: "/mock-login-action"
            },
            user: {
                organizations: [
                    { alias: "org1", name: "Organization 1" },
                    { alias: "org2", name: "Organization 2" },
                    { alias: "org3", name: "Organization 3" }
                ]
            }
        }
    }
};

/**
 * WithSingleOrganization:
 * - Purpose: Tests when there is only one organization available.
 * - Scenario: The component renders a single organization button.
 * - Key Aspect: Ensures that a single organization is displayed correctly.
 */
export const WithSingleOrganization: Story = {
    args: {
        kcContext: {
            url: {
                loginAction: "/mock-login-action"
            },
            user: {
                organizations: [{ alias: "org1", name: "My Organization" }]
            }
        }
    }
};
