import type { PageCategory, PageId, PagePreview } from './types';

/** Identity helper that pins `Id` so each page's `overrides` are page-specific. */
export function definePage<TId extends PageId>(page: PagePreview<TId>): PagePreview {
    return page;
}

/** Convenience: a page whose only scenario is the default render. */
export function simplePage<TId extends PageId>(
    pageId: TId,
    label: string,
    category: PageCategory,
): PagePreview {
    return definePage({
        pageId,
        label,
        category,
        stories: [{ id: 'default', label: 'Default' }],
    });
}

export function fieldError(message: string, ...fields: string[]) {
    return {
        existsError: (...names: string[]) => names.some(name => fields.includes(name)),
        get: (name: string) => (fields.includes(name) ? message : ''),
    };
}
