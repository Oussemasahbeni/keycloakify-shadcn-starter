import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs';

import { ConfigPanel, ImagesPanel } from './config-panel';

export function EditorSidebar() {
    return (
        <aside className="flex w-80 shrink-0 flex-col border-l bg-background">
            <Tabs defaultValue="config" className="flex h-full min-h-0 flex-col gap-0">
                <div className="border-b p-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="config">Config</TabsTrigger>
                        <TabsTrigger value="images">Images</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="config" className="min-h-0 flex-1 overflow-y-auto p-4">
                    <ConfigPanel />
                </TabsContent>
                <TabsContent value="images" className="min-h-0 flex-1 overflow-y-auto p-4">
                    <ImagesPanel />
                </TabsContent>
            </Tabs>
        </aside>
    );
}
