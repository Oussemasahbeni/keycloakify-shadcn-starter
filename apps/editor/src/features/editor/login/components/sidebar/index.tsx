import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { Images, Palette } from "lucide-react";

import { AssetsPanel } from "./assets-panel";
import { BrandingPanel } from "./branding-panel";

export function LoginThemeSidebar() {
    return (
        <aside className="bg-background flex shrink-0 flex-col border-l">
            <Tabs defaultValue="config" className="flex h-full min-h-0 flex-col gap-0">
                <div className="border-b p-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="branding">
                            <Palette />
                            Branding
                        </TabsTrigger>
                        <TabsTrigger value="assets">
                            <Images />
                            Assets
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="branding" className="min-h-0 flex-1 overflow-y-auto p-4">
                    <BrandingPanel />
                </TabsContent>
                <TabsContent value="assets" className="min-h-0 flex-1 overflow-y-auto p-4">
                    <AssetsPanel />
                </TabsContent>
            </Tabs>
        </aside>
    );
}
