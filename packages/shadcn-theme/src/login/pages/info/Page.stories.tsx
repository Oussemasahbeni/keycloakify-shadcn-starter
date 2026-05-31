import { createKcPageStory, type Meta, type StoryObj } from "../../mocks/KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "info.ftl" });

const meta = {
    title: "login/info.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        kcContext: {
            messageHeader: "Message header",
            message: {
                summary: "Server info message"
            }
        }
    }
};


export const WithLinkBack: Story = {
    args: {
        kcContext: {
            messageHeader: "Message header",
            message: {
                summary: "Server message"
            },
            actionUri: undefined
        }
    }
};

export const WithRequiredActions: Story = {
    args: {
        kcContext: {
            messageHeader: "Message header",
            message: {
                summary: "Required actions: "
            },
            requiredActions: [
                "CONFIGURE_TOTP",
                "UPDATE_PROFILE",
                "VERIFY_EMAIL",
                "CUSTOM_ACTION"
            ],
            "x-keycloakify": {
                messages: {
                    "requiredAction.CUSTOM_ACTION": "Custom action"
                }
            }
        }
    }
};
