import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "#/components/ui/popover";
import { cn } from "#/lib/utils";

import type { Permission, Scope } from "../api/representations";

const MAX_AVATARS = 3;

const scopeName = (scope: Scope | string) => (typeof scope === "string" ? scope : scope.name);

const nameParts = (user: Permission) => [user.firstName, user.lastName].filter((part): part is string => !!part);

const displayName = (user: Permission) => nameParts(user).join(" ") || user.username;

const initials = (user: Permission) => {
    const parts = nameParts(user);
    return (parts.length > 0 ? parts.map(part => part[0]).join("") : user.username.slice(0, 2)).toUpperCase();
};

/** Only users who still hold at least one scope count as "shared with". */
const sharedUsers = (permissions: Permission[] = []) => permissions.filter(user => user.scopes.length > 0);

type SharedWithListProps = {
    permissions?: Permission[];
    className?: string;
};

/** One row per user: initials, name / email, and the scopes they were granted. */
export const SharedWithList = ({ permissions, className }: SharedWithListProps) => (
    <ul className={cn("flex flex-col gap-3", className)}>
        {sharedUsers(permissions).map(user => (
            <li key={user.username} className="flex items-center gap-3">
                <Avatar size="sm">
                    <AvatarFallback>{initials(user)}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">{displayName(user)}</span>
                    {user.email && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
                </div>
                <div className="flex flex-wrap justify-end gap-1">
                    {user.scopes.map(scope => (
                        <Badge key={scopeName(scope)} variant="outline">
                            {scopeName(scope)}
                        </Badge>
                    ))}
                </div>
            </li>
        ))}
    </ul>
);

type SharedWithAvatarsProps = {
    permissions?: Permission[];
};

/**
 * Overlapping initials avatars for the users a resource is shared with (max {@link MAX_AVATARS},
 * then a "+n" counter); clicking opens a popover listing everyone with their scopes.
 */
export const SharedWithAvatars = ({ permissions }: SharedWithAvatarsProps) => {
    const { t } = useTranslation();
    const users = sharedUsers(permissions);

    if (users.length === 0) {
        return (
            <span className="text-sm text-muted-foreground" data-testid="shared-with-none">
                {t("notShared", { defaultValue: "Not shared" })}
            </span>
        );
    }

    const hidden = users.length - MAX_AVATARS;
    const sharedWith = t("sharedWith", { defaultValue: "Shared with" });

    return (
        <Popover>
            <PopoverTrigger
                aria-label={`${sharedWith}: ${users.map(displayName).join(", ")}`}
                data-testid={`shared-with-${users.map(user => user.username).join(",")}`}
                className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
                <AvatarGroup>
                    {users.slice(0, MAX_AVATARS).map(user => (
                        <Avatar key={user.username} size="sm">
                            <AvatarFallback>{initials(user)}</AvatarFallback>
                        </Avatar>
                    ))}
                    {hidden > 0 && <AvatarGroupCount>+{hidden}</AvatarGroupCount>}
                </AvatarGroup>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80">
                <PopoverHeader>
                    <PopoverTitle>{sharedWith}</PopoverTitle>
                </PopoverHeader>
                <SharedWithList permissions={users} />
            </PopoverContent>
        </Popover>
    );
};
