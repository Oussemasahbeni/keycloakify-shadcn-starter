import { ChevronLeftIcon, ChevronRightIcon, RefreshCwIcon, SearchIcon, XIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "#/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "#/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";

const DEFAULT_PER_PAGE_OPTIONS = [10, 20, 50, 100];

export type DataTableToolbarProps = {
    /** Called with the trimmed query on Enter and with "" on clear. */
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
    onRefresh?: () => void;
    /** Zero-based index of the first visible row. */
    first: number;
    perPage: number;
    /** Page sizes offered in the select (must include `perPage`). */
    perPageOptions?: number[];
    /** Number of rows on the current page (after filtering). */
    count: number;
    /** Whether a page after this one exists. */
    hasNext: boolean;
    onFirstChange: (first: number) => void;
    onPerPageChange: (perPage: number) => void;
    /** Extra controls rendered between the search box and the pagination. */
    children?: ReactNode;
};

/**
 * Search + refresh + compact pagination, shared by every paged list in the console.
 * Works for client-side paging (see `useClientPagination`) and server-side paging alike:
 * the caller only ever receives a zero-based `first` and a `perPage`.
 */
export function DataTableToolbar({
    onSearch,
    searchPlaceholder,
    onRefresh,
    first,
    perPage,
    perPageOptions = DEFAULT_PER_PAGE_OPTIONS,
    count,
    hasNext,
    onFirstChange,
    onPerPageChange,
    children,
}: DataTableToolbarProps) {
    const { t } = useTranslation();
    const [query, setQuery] = useState("");

    const firstIndex = count === 0 ? 0 : first + 1;
    const lastIndex = first + count;

    return (
        <div className="flex flex-wrap items-center gap-2">
            {onSearch && (
                <InputGroup className="max-w-xs">
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupInput
                        type="text"
                        data-testid="table-search-input"
                        placeholder={searchPlaceholder ?? t("search", { defaultValue: "Search" })}
                        aria-label={t("search", { defaultValue: "Search" })}
                        value={query}
                        onChange={event => setQuery(event.currentTarget.value)}
                        onKeyDown={event => {
                            if (event.key === "Enter") {
                                onSearch(query.trim());
                            }
                        }}
                    />
                    {query !== "" && (
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton
                                size="icon-xs"
                                aria-label={t("clear", { defaultValue: "Clear" })}
                                onClick={() => {
                                    setQuery("");
                                    onSearch("");
                                }}
                            >
                                <XIcon />
                            </InputGroupButton>
                        </InputGroupAddon>
                    )}
                </InputGroup>
            )}
            {children}
            {onRefresh && (
                <Button variant="ghost" size="sm" data-testid="refresh" onClick={onRefresh}>
                    <RefreshCwIcon data-icon="inline-start" />
                    {t("refresh")}
                </Button>
            )}

            <div className="ms-auto flex items-center gap-1">
                <Select
                    value={String(perPage)}
                    items={Object.fromEntries(perPageOptions.map(option => [String(option), String(option)]))}
                    onValueChange={value => onPerPageChange(Number(value))}
                >
                    <SelectTrigger size="sm" aria-label={t("perPage", { defaultValue: "Items per page" })}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {perPageOptions.map(option => (
                            <SelectItem key={option} value={String(option)}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <span className="px-2 text-sm text-muted-foreground tabular-nums">
                    {firstIndex} - {lastIndex}
                </span>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("previousPage", { defaultValue: "Previous page" })}
                    disabled={first <= 0}
                    onClick={() => onFirstChange(Math.max(0, first - perPage))}
                >
                    <ChevronLeftIcon className="rtl:-scale-x-100" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("nextPage", { defaultValue: "Next page" })}
                    disabled={!hasNext}
                    onClick={() => onFirstChange(first + perPage)}
                >
                    <ChevronRightIcon className="rtl:-scale-x-100" />
                </Button>
            </div>
        </div>
    );
}
