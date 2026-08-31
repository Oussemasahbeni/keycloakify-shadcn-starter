import { useMemo, useState } from "react";

import { useStoredState } from "../../shared/keycloak-ui-shared";
import type { DataTableToolbarProps } from "../components/DataTableToolbar";

/** The toolbar props a client-paged list needs; spread onto `<DataTableToolbar>`. */
type ToolbarProps = Pick<
    DataTableToolbarProps,
    "onSearch" | "first" | "perPage" | "count" | "hasNext" | "onFirstChange" | "onPerPageChange"
>;

/**
 * Search + paging state for lists the API returns in full: filters `items` with `matches`,
 * slices the current page, resets to the first page whenever the query or page size changes,
 * and remembers the page size in localStorage (same `pageSize` key as upstream).
 */
export function useClientPagination<T>(items: T[] | undefined, matches: (item: T, query: string) => boolean) {
    const [search, setSearch] = useState("");
    const [first, setFirst] = useState(0);
    const [perPage, setPerPage] = useStoredState(localStorage, "pageSize", 10);

    const filtered = useMemo(
        () => (items ?? []).filter(item => search === "" || matches(item, search)),
        [items, search, matches],
    );
    const page = filtered.slice(first, first + perPage);
    const hasNext = first + perPage < filtered.length;

    const toolbarProps: ToolbarProps = {
        onSearch: query => {
            setSearch(query);
            setFirst(0);
        },
        first,
        perPage,
        count: page.length,
        hasNext,
        onFirstChange: setFirst,
        onPerPageChange: size => {
            setPerPage(size);
            setFirst(0);
        },
    };

    return { search, first, perPage, filtered, page, hasNext, toolbarProps };
}
