import type { ReactNode } from "react";

import { Spinner } from "#/components/ui/spinner";
import { TableCell, TableRow } from "#/components/ui/table";

type TableStateRowProps = {
    /** Number of columns in the table, so the row spans the full width. */
    colSpan: number;
    children?: ReactNode;
};

/** Full-width loading row: keeps the table header and its card in place while data loads. */
export const TableLoadingRow = ({ colSpan }: TableStateRowProps) => (
    <TableRow className="hover:bg-transparent">
        <TableCell colSpan={colSpan} className="py-8 text-center">
            <Spinner className="mx-auto size-5" />
        </TableCell>
    </TableRow>
);

/** Full-width muted message row for "no rows" / "no results" inside a table. */
export const TableEmptyRow = ({ colSpan, children }: TableStateRowProps) => (
    <TableRow className="hover:bg-transparent">
        <TableCell colSpan={colSpan} className="py-8 text-center text-muted-foreground">
            {children}
        </TableCell>
    </TableRow>
);
