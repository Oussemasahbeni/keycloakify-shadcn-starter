import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '#/components/ui/tabs'

import { ConfigPanel } from './config-panel'

function ComingSoon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
      {children}
    </div>
  )
}

export function EditorSidebar() {
  return (
    <aside className="flex w-80 shrink-0 flex-col border-l bg-background">
      <Tabs defaultValue="config" className="flex h-full min-h-0 flex-col gap-0">
        <div className="border-b p-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="translations">Translations</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="config"
          className="min-h-0 flex-1 overflow-y-auto p-4"
        >
          <ConfigPanel />
        </TabsContent>
        <TabsContent value="code">
          <ComingSoon>Code export is coming in a later pass.</ComingSoon>
        </TabsContent>
        <TabsContent value="translations">
          <ComingSoon>Translations editing is coming in a later pass.</ComingSoon>
        </TabsContent>
      </Tabs>
    </aside>
  )
}
