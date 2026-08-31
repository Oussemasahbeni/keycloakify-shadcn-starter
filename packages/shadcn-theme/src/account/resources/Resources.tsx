/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260700.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/Resources.tsx" --revert
 */

import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";

import { Page } from "../components/page/Page";
import { ResourcesTab } from "./ResourcesTab";

export const Resources = () => {
    const { t } = useTranslation();

    return (
        <Page title={t("resources")} description={t("resourceIntroMessage")}>
            <Tabs defaultValue="myResources" className="gap-6">
                <TabsList variant="line">
                    <TabsTrigger value="myResources" data-testid="myResources">
                        {t("myResources")}
                    </TabsTrigger>
                    <TabsTrigger value="sharedWithMe" data-testid="sharedWithMe">
                        {t("sharedWithMe")}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="myResources">
                    <ResourcesTab />
                </TabsContent>
                <TabsContent value="sharedWithMe">
                    <ResourcesTab isShared />
                </TabsContent>
            </Tabs>
        </Page>
    );
};

export default Resources;
