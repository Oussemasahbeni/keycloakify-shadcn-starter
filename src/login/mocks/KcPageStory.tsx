import type { DeepPartial } from "@keycloakify/login-ui/tools/DeepPartial";
import type { KcContext } from "../KcContext";
import KcPage from "../KcPage";
import { getKcContextMock } from "./getKcContextMock";
export type { Meta, StoryObj } from "../../kc.gen";

export function createKcPageStory<PageId extends KcContext["pageId"]>(params: {
    pageId: PageId;
}) {
    const { pageId } = params;

    function KcPageStory(props: {
        kcContext?: DeepPartial<Extract<KcContext, { pageId: PageId }>>;
    }) {
        const { kcContext: overrides } = props;

        const kcContextMock = getKcContextMock({
            pageId,
            overrides
        });

        return <KcPage kcContext={kcContextMock} />;
    }

    return { KcPageStory };
}