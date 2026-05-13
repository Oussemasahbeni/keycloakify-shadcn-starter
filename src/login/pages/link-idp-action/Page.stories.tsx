import { createKcPageStory, type Meta, type StoryObj } from "../../mocks/KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "link-idp-action.ftl" });

const meta = {
    title: "login/link-idp-action.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        kcContext: {
            idpDisplayName: "GitHub",
            url: { loginAction: "/mock-login-action" }
        }
    }
};


export const DifferentProvider: Story = {
    args: {
        kcContext: {
            idpDisplayName: "Google",
            url: { loginAction: "/custom-login-action" }
        }
    }
};
