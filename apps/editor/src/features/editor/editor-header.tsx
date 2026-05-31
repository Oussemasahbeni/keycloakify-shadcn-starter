import { Logo } from '#/components/logo'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { useOidc } from '#/oidc'
import {
  BadgeCheckIcon,
  Download,
  Github,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react'

import { ModeToggle } from '#/components/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { GITHUB_URL } from '#/config/constants'
import { createKeycloakUtils } from 'oidc-spa/keycloak'
import { useEditor } from './editor-context'
import { VIEWPORTS } from './viewport'

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
  return initials.toUpperCase() || '?'
}

function formatRelativeTime(date: Date) {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  const divisions: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
  ]
  let duration = (date.getTime() - Date.now()) / 1000
  for (const [amount, unit] of divisions) {
    if (Math.abs(duration) < amount) {
      return rtf.format(Math.round(duration), unit)
    }
    duration /= amount
  }
  return rtf.format(Math.round(duration), 'week')
}

function ViewportToggle() {
  const { viewport, setViewport } = useEditor()

  return (
    <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
      {VIEWPORTS.map(({ id, label, icon: Icon }) => {
        const isActive = viewport === id
        return (
          <Tooltip key={id}>
            <TooltipTrigger
              render={
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="icon"
                  className="size-8"
                  aria-pressed={isActive}
                  onClick={() => setViewport(id)}
                >
                  <Icon className="size-4" />
                  <span className="sr-only">{label}</span>
                </Button>
              }
            />
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}

function PreviewThemeToggle() {
  const { previewColorScheme, setPreviewColorScheme } = useEditor()

  return (
    <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant={previewColorScheme === 'light' ? 'secondary' : 'ghost'}
              size="icon"
              className="size-8"
              aria-pressed={previewColorScheme === 'light'}
              onClick={() => setPreviewColorScheme('light')}
            >
              <Sun className="size-4" />
              <span className="sr-only">Light</span>
            </Button>
          }
        />
        <TooltipContent>Light</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant={previewColorScheme === 'dark' ? 'secondary' : 'ghost'}
              size="icon"
              className="size-8"
              aria-pressed={previewColorScheme === 'dark'}
              onClick={() => setPreviewColorScheme('dark')}
            >
              <Moon className="size-4" />
              <span className="sr-only">Dark</span>
            </Button>
          }
        />
        <TooltipContent>Dark</TooltipContent>
      </Tooltip>
    </div>
  )
}

function SaveStatus() {
  const { saveStatus, lastSavedAt } = useEditor()

  const label =
    saveStatus === 'saving'
      ? 'Saving…'
      : saveStatus === 'error'
        ? 'Save failed'
        : lastSavedAt
          ? `Saved ${formatRelativeTime(lastSavedAt)}`
          : 'Not saved yet'

  return (
    <span className="hidden text-xs text-muted-foreground sm:inline">
      {label}
    </span>
  )
}

function ExportButton() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="sm">
            <Download className="size-4" />
            Export
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export theme</DialogTitle>
          <DialogDescription>
            Export will produce a Keycloakify-ready theme bundle. It becomes
            available once theme editing and saving are wired up.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

function UserMenu() {
  const { decodedIdToken, issuerUri, clientId, validRedirectUri, logout } =
    useOidc({
      assert: 'user logged in',
    })
  const { name, email, preferred_username, picture } = decodedIdToken

  const keycloakUtils = createKeycloakUtils({ issuerUri })

  const accountLinkUrl = keycloakUtils.getAccountUrl({
    clientId,
    validRedirectUri,
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              {picture ? <AvatarImage src={picture} alt={name} /> : null}
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Open user menu</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="truncate text-sm font-medium">{name}</span>
            <span className="truncate text-xs font-normal text-muted-foreground">
              {email ?? preferred_username}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <a
              href={accountLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full"
            >
              <BadgeCheckIcon />
              Account
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full"
          >
            <Github />
            GitHub
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => logout({ redirectTo: 'home' })}
          className="hover:cursor-pointer flex items-center gap-2"
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function EditorHeader() {
  return (
    <header className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <Logo size={28} />
        <span className="font-semibold">Theme Editor</span>
      </div>

      <div className="flex items-center gap-4">
        <ViewportToggle />
        <PreviewThemeToggle />
      </div>

      <div className="flex items-center justify-end gap-2">
        <SaveStatus />
        <ExportButton />
        <ModeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
