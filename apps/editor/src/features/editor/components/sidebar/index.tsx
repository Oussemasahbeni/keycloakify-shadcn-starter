import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";

import { ConfigPanel } from "./config-panel";
import { FaviconPanel } from "./favicon-panel";
import { ImagesPanel } from "./images-panel";

export function EditorSidebar() {
    return (
        <aside className="flex shrink-0 flex-col border-l bg-background">
            <Tabs defaultValue="config" className="flex h-full min-h-0 flex-col gap-0">
                <div className="border-b p-2">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="config">Config</TabsTrigger>
                        <TabsTrigger value="images">Images</TabsTrigger>
                        <TabsTrigger value="favicon">Favicon</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="config" className="min-h-0 flex-1 overflow-y-auto p-4">
                    <ConfigPanel />
                </TabsContent>
                <TabsContent value="images" className="min-h-0 flex-1 overflow-y-auto p-4">
                    <ImagesPanel />
                </TabsContent>
                <TabsContent value="favicon" className="min-h-0 flex-1 overflow-y-auto p-4">
                    <FaviconPanel />
                </TabsContent>
            </Tabs>
        </aside>
    );
}
