/**
 * The fragment a métier's row answers to on /metiers — "Traitement du vitrage"
 * becomes `traitement-du-vitrage`, so the homepage can link to
 * `/metiers#traitement-du-vitrage`.
 *
 * Derived from the title rather than stored, because services have no slug
 * field. The cost: renaming a métier changes its anchor. Both ends are built
 * from the same title in the same render, so the site's own links never break —
 * only a link someone saved by hand would.
 */
export const metierAnchor = (title: string): string =>
  title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const metierHref = (title: string): string => `/metiers#${metierAnchor(title)}`
