import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { CardDecorator } from './card-decorator'
import { Code, Crown, Github, Layout, Palette } from 'lucide-react'

const values = [
  {
    icon: Code,
    title: 'Developer First',
    description:
      'Every component is built with the developer experience in mind, ensuring clean code and easy integration.',
  },
  {
    icon: Palette,
    title: 'Design Excellence',
    description:
      'We maintain the highest design standards, following shadcn/ui principles and modern UI patterns.',
  },
  {
    icon: Layout,
    title: 'Production Ready',
    description:
      'Battle-tested components used in real applications with proven performance and reliability across different environments.',
  },
  {
    icon: Crown,
    title: 'Premium Quality',
    description:
      'Hand-crafted with attention to detail and performance optimization, ensuring exceptional user experience and accessibility.',
  },
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <Badge variant="outline" className="mb-4">
            About
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Built for developers, by developers
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            We're passionate about creating the best visual editor for
            Keycloak themes. Our mission is to accelerate development and help
            developers build beautiful login interfaces faster.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4 mb-12">
          {values.map((value, index) => (
            <Card key={index} className="group shadow-xs py-2">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center">
                  <CardDecorator>
                    <value.icon className="size-6" aria-hidden />
                  </CardDecorator>
                  <h3 className="mt-6 font-medium text-balance">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-sm">
                    {value.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="cursor-pointer"
              render={
                <a
                  href="https://github.com/Oussemasahbeni/keycloakify-shadcn-theme-editor"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
            >
              <Github data-icon="inline-start" />
              Star on GitHub
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer"
              render={
                <a
                  href="https://discord.com/invite/XEQhPc9a6p"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
            >
              Join Discord Community
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
