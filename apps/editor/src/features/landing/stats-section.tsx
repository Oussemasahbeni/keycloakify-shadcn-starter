import { Card, CardContent } from "#/components/ui/card";
import { DotPattern } from "#/components/dot-pattern";
import { Layout, LayoutTemplate, Languages, Palette } from "lucide-react";

const stats = [
    {
        icon: LayoutTemplate,
        value: "39",
        label: "Login Pages",
        description: "Every login & registration screen",
    },
    {
        icon: Languages,
        value: "30",
        label: "Languages",
        description: "Built-in translations",
    },
    {
        icon: Palette,
        value: "18",
        label: "Color Presets",
        description: "Plus 7 base palettes",
    },
    {
        icon: Layout,
        value: "3",
        label: "Layouts",
        description: "Two-column · centered · image-aside",
    },
];

export function StatsSection() {
    return (
        <section className="py-12 sm:py-16 relative">
            <div className="absolute inset-0 bg-linear-to-r from-primary/8 via-transparent to-secondary/20" />
            <DotPattern className="opacity-75" size="md" fadeStyle="circle" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {stats.map(stat => (
                        <Card
                            key={stat.label}
                            className="text-center bg-background/60 backdrop-blur-sm border-border/50 py-0"
                        >
                            <CardContent className="p-6">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-primary/10 rounded-xl">
                                        <stat.icon className="size-6 text-primary" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                                        {stat.value}
                                    </h3>
                                    <p className="font-semibold text-foreground">{stat.label}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {stat.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
