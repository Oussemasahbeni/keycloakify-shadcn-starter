import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { GITHUB_URL } from "#/config/constants";
import { getInitials } from "#/lib/utils";
import { createKeycloakUtils } from "oidc-spa/keycloak";

import { useOidc } from "#/oidc";
import { BadgeCheckIcon, Github, LogOut } from "lucide-react";

export function UserMenu() {
    const { decodedIdToken, issuerUri, clientId, validRedirectUri, logout } = useOidc({
        assert: "user logged in",
    });
    const { name, email, preferred_username, picture } = decodedIdToken;

    const keycloakUtils = createKeycloakUtils({ issuerUri });

    const accountLinkUrl = keycloakUtils.getAccountUrl({
        clientId,
        validRedirectUri,
    });

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
                    onClick={() => logout({ redirectTo: "home" })}
                    className="hover:cursor-pointer flex items-center gap-2"
                >
                    <LogOut className="size-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
