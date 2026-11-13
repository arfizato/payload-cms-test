/**
 * Admin text used by more than one config.
 *
 * The admin runs in French and English — each user picks on their account page
 * (see `i18n` in payload.config.ts) — so every label is a `{ fr, en }` pair.
 * Payload shows the half matching the user's language.
 *
 * Only texts that repeat across files live here. A sidebar group groups by its
 * label, so two copies that differ by one character split it in two. One-off
 * texts stay inline next to their field, where they are easier to read.
 *
 * Page names ("Nos métiers", "Nos projets") stay French in the English texts:
 * they name pages of a French site, and the editor has to recognise them there.
 */

export const GROUP = {
  content: { fr: 'Contenu', en: 'Content' },
  home: { fr: 'Page d’accueil', en: 'Homepage' },
  about: { fr: 'Page À propos', en: 'About page' },
  site: { fr: 'Tout le site', en: 'Whole site' },
  files: { fr: 'Fichiers', en: 'Files' },
  admin: { fr: 'Administration', en: 'Administration' },
}

export const ORDER = {
  label: { fr: 'Ordre d’affichage', en: 'Display order' },
  description: {
    fr: 'Les plus petits numéros apparaissent en premier.',
    en: 'Lower numbers appear first.',
  },
}

export const OPTIONAL = { fr: 'Facultatif.', en: 'Optional.' }
