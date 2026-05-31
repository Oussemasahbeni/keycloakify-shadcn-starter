import { Monitor, Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'
import { THEMES, useTheme } from './theme-provider'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    const cycleTheme = (e: KeyboardEvent) => {
      if (
        (e.key === 'd' || e.key === 'D') &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName) &&
        !(e.target as HTMLElement).isContentEditable
      ) {
        const order = THEMES
        const currentIndex = order.indexOf(theme)
        const nextTheme = order[(currentIndex + 1) % order.length]
        setTheme(nextTheme)
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', cycleTheme)
    return () => window.removeEventListener('keydown', cycleTheme)
  }, [theme, setTheme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value)}
        >
          <DropdownMenuRadioItem value="light" closeOnClick>
            <Sun className="h-[1.2rem] w-[1.2rem]" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" closeOnClick>
            <Moon className="h-[1.2rem] w-[1.2rem]" />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" closeOnClick>
            <Monitor className="h-[1.2rem] w-[1.2rem]" />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
