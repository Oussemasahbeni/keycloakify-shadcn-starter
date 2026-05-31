import { Button } from '#/components/ui/button'
import { DotPattern } from '#/components/dot-pattern'
import { ArrowRight, Play } from 'lucide-react'

function getAppUrl(path: string): string {
  const basename = import.meta.env.VITE_BASENAME || ''
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return basename + cleanPath
}

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-linear-to-b from-background to-background/80 pt-16 sm:pt-20 pb-16"
    >
      <div className="absolute inset-0">
        <DotPattern className="opacity-100" size="md" fadeStyle="ellipse" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Build Better
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {' '}
              Keycloak Themes{' '}
            </span>
            with a Visual Editor
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Customize your Keycloak login pages visually using shadcn/ui
            components. Built for developers who value both design and
            developer experience.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="text-base cursor-pointer"
              render={<a href={getAppUrl('/auth/sign-in')} />}
              nativeButton={false}
            >
              Get Started Free
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base cursor-pointer"
              render={<a href="#" />}
              nativeButton={false}
            >
              <Play data-icon="inline-start" />
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-6xl">
          <div className="relative group">
            <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl" />

            <div className="relative rounded-xl border bg-card shadow-2xl">
              <img
                src="/dashboard-light.png"
                alt="Dashboard Preview - Light Mode"
                className="w-full rounded-xl object-cover block dark:hidden"
              />

              <div className="absolute bottom-0 left-0 w-full h-32 md:h-40 lg:h-48 bg-gradient-to-b from-background/0 via-background/70 to-background rounded-b-xl" />

              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  className="rounded-full size-16 p-0 cursor-pointer hover:scale-105 transition-transform"
                  render={<a href="#" aria-label="Watch demo video" />}
                  nativeButton={false}
                >
                  <Play className="fill-current" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
